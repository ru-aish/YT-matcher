'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import { sendMessageAction } from '../../../actions';
import {
  ArrowLeft,
  Send,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import styles from './chat.module.css';

function cleanEnvVar(value) {
  if (!value) return '';
  return value.replace(/['"]/g, '').trim();
}

export default function ChatClient({ initialData }) {
  const router = useRouter();
  const { deal, currentUser, otherUser, messages: initialMessages } = initialData;
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pusher real-time subscription
  useEffect(() => {
    const key = cleanEnvVar(process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.NEXT_PUBLIC_key || '');
    const cluster = cleanEnvVar(process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.NEXT_PUBLIC_cluster || '');

    if (!key || !cluster) return;

    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe(`deal-${deal.id}`);

    channel.bind('new-message', (data) => {
      // Avoid duplicates (from our own sends)
      if (data.senderId !== currentUser.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`deal-${deal.id}`);
      pusher.disconnect();
    };
  }, [deal.id, currentUser.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const content = input.trim();
    setInput('');
    setSending(true);

    // Optimistic add
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      dealId: deal.id,
      senderId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await sendMessageAction(deal.id, content);
      if (res.success) {
        // Replace optimistic with real
        setMessages(prev =>
          prev.map(m => m.id === optimisticMsg.id ? res.message : m)
        );
      }
    } catch {
      // Remove optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatPage}>
      {/* Context Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <button className={styles.chatHeaderBack} onClick={() => router.push('/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className={styles.chatPartnerName}>
              {otherUser?.name || otherUser?.companyName || 'Partner'}
            </div>
            <div className={styles.chatDealInfo}>
              <span className={styles.chatDealMeta}>Deal #{deal.id}</span>
              <span className={styles.chatDealMeta}>·</span>
              <span className={styles.chatDealMeta}>${deal.price?.toLocaleString() || 0}</span>
              <span className={`badge ${deal.status === 'escrow_funded' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {deal.status?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => router.push(`/deal/${deal.id}`)}
        >
          <ExternalLink size={14} />
          Deal Details
        </button>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages} ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className={styles.chatEmpty}>
            <div className={styles.chatEmptyIcon}>
              <MessageSquare size={24} />
            </div>
            <span style={{ fontSize: '0.85rem' }}>No messages yet</span>
            <span style={{ fontSize: '0.75rem', maxWidth: 280 }}>
              Start the conversation about your deal with {otherUser?.name || 'your partner'}.
            </span>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = msg.senderId === currentUser.id;
            const senderUser = isSent ? currentUser : otherUser;

            return (
              <div
                key={msg.id}
                className={`${styles.message} ${isSent ? styles.sent : styles.received}`}
              >
                <div className={styles.messageAvatar}>
                  {senderUser?.avatarUrl ? (
                    <img src={senderUser.avatarUrl} alt="" />
                  ) : (
                    getInitials(senderUser?.name)
                  )}
                </div>
                <div>
                  <div className={styles.messageBubble}>{msg.content}</div>
                  <div className={styles.messageTime}>{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className={styles.chatInputArea} onSubmit={handleSend}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className={styles.chatSendBtn}
          disabled={!input.trim() || sending}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
