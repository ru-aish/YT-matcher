'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import { sendMessageAction, updateDealStatusAction } from '../../actions';
import { 
  ArrowLeft, 
  Send, 
  ShieldAlert, 
  DollarSign, 
  Check, 
  Video, 
  Building2, 
  Database,
  Lock
} from 'lucide-react';

export default function DealClient({ initialData }) {
  const router = useRouter();
  const { deal: initialDeal, currentUser, otherUser, messages: initialMessages } = initialData;

  const [deal, setDeal] = useState(initialDeal);
  const [messages, setMessages] = useState(initialMessages || []);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to real-time events via Pusher
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn("Pusher client key or cluster not configured. Real-time updates disabled.");
      return;
    }

    // Enable logging in dev
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true
    });

    const channel = pusher.subscribe(`deal-${deal.id}`);

    // Bind message event
    channel.bind('new-message', (data) => {
      setMessages((prev) => {
        // Prevent duplicate messages if already sent by this client
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    // Bind status update event
    channel.bind('status-updated', (data) => {
      if (data.status) {
        setDeal((prev) => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [deal.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || loading) return;

    const textToSend = messageText;
    setMessageText('');
    setLoading(true);
    setError('');

    try {
      const res = await sendMessageAction(deal.id, textToSend, currentUser.googleId);
      if (res.error) {
        setError(res.error);
        // Put text back in input
        setMessageText(textToSend);
      } else if (res.message) {
        // Append locally if Pusher hasn't triggered it yet
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.message.id)) return prev;
          return [...prev, res.message];
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
      setMessageText(textToSend);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFundEscrow = async () => {
    if (escrowLoading || deal.status === 'escrow_funded') return;

    setEscrowLoading(true);
    setError('');

    try {
      const res = await updateDealStatusAction(deal.id, 'escrow_funded', currentUser.googleId);
      if (res.error) {
        setError(res.error);
      } else if (res.deal) {
        setDeal(res.deal);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fund escrow.");
    } finally {
      setEscrowLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#0d0d12',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid #1f1f2e',
        background: '#121218',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            className="hover-bg-gray"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Deal with {otherUser?.name || 'Partner'}
              </h1>
              <span style={{
                background: deal.status === 'escrow_funded' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: deal.status === 'escrow_funded' ? '#10b981' : '#f59e0b',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: deal.status === 'escrow_funded' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                {deal.status.replace('_', ' ')}
              </span>
            </div>
            
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              {otherUser?.role === 'creator' ? (
                <>
                  <Video size={12} style={{ color: '#8b5cf6' }} />
                  <span>YouTube Creator • {otherUser.youtubeChannel}</span>
                </>
              ) : (
                <>
                  <Building2 size={12} style={{ color: '#06b6d4' }} />
                  <span>Brand Client • {otherUser?.companyName || 'Company'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Escrow ID: <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>#MATCH-{deal.id}</span>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        flex: 1,
        height: 'calc(100vh - 65px)',
        overflow: 'hidden'
      }}>
        {/* Left Panel: Agreement Details */}
        <aside style={{
          background: '#121218',
          borderRight: '1px solid #1f1f2e',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '1.25rem' }}>
              Agreement Parameters
            </h2>

            {/* Price/Budget Widget */}
            <div style={{
              background: '#161622',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #27273f',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Contract Budget</span>
              <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', marginTop: '4px' }}>
                <DollarSign size={28} />
                <span style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{deal.price}</span>
                <span style={{ fontSize: '0.9rem', color: '#9ca3af', marginLeft: '6px', fontWeight: 500 }}>USD</span>
              </div>
            </div>

            {/* Escrow Status Widget */}
            <div style={{
              background: '#161622',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #27273f',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Secured Funds Status</span>
              {deal.status === 'escrow_funded' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '6px',
                    borderRadius: '50%'
                  }}>
                    <Check size={18} />
                  </div>
                  <span>Escrow Fully Funded</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginTop: '8px', fontWeight: 600 }}>
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '6px',
                    borderRadius: '50%'
                  }}>
                    <Lock size={18} />
                  </div>
                  <span>Awaiting Funding</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {currentUser.role === 'brand' && deal.status !== 'escrow_funded' && (
              <button
                onClick={handleSimulateFundEscrow}
                disabled={escrowLoading}
                style={{
                  width: '100%',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: escrowLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'opacity 0.2s',
                }}
                className="btn-escrow-action"
              >
                {escrowLoading ? 'Simulating escrow transfer...' : 'Fund Escrow (Simulate)'}
              </button>
            )}

            {currentUser.role === 'creator' && deal.status !== 'escrow_funded' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px dashed rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: '#f59e0b',
                fontSize: '0.85rem',
                lineHeight: 1.4
              }}>
                ⚠️ Please do not start producing video content until the Brand funds the escrow. We will notify you here the second funds are secured.
              </div>
            )}

            {deal.status === 'escrow_funded' && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px dashed rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: '#10b981',
                fontSize: '0.85rem',
                lineHeight: 1.4
              }}>
                🎉 Funds are secured in escrow contract. Creator can now safely proceed with video production and script approvals.
              </div>
            )}
          </div>

          {/* Secure disclaimer */}
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.01)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #1f1f2e',
            marginTop: '1rem'
          }}>
            <ShieldAlert size={14} style={{ color: '#06b6d4', flexShrink: 0 }} />
            <span>Escrow transactions are secured under YT Matcher marketplace rules.</span>
          </div>
        </aside>

        {/* Right Panel: The Live Chat Room */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#0d0d12',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Top warning alert */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '10px 20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {messages.length === 0 ? (
              <div style={{
                margin: 'auto',
                textAlign: 'center',
                maxWidth: '360px',
                color: '#9ca3af',
                animation: 'fadeIn 0.5s ease'
              }}>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b5cf6',
                  margin: '0 auto 1rem'
                }}>
                  <Database size={28} />
                </div>
                <h3 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.25rem' }}>Beginning of Discussion</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                  Start details, campaign milestones, rates, and schedule details directly below.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div 
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      alignSelf: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {/* Sender name label */}
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#9ca3af', 
                      marginBottom: '4px',
                      marginLeft: isMe ? '0' : '4px',
                      marginRight: isMe ? '4px' : '0',
                    }}>
                      {isMe ? 'You' : otherUser?.name}
                    </span>

                    {/* Message Bubble */}
                    <div style={{
                      background: isMe 
                        ? (currentUser.role === 'brand' ? '#06b6d4' : '#8b5cf6')
                        : '#1e1e2f',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '0.9rem',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {msg.content}
                    </div>

                    {/* Timestamp */}
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#6b7280', 
                      marginTop: '4px',
                      marginLeft: isMe ? '0' : '4px',
                      marginRight: isMe ? '4px' : '0',
                    }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid #1f1f2e',
              background: '#121218',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <input 
              type="text"
              placeholder={`Send message to ${otherUser?.name || 'partner'}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                background: '#0d0d12',
                border: '1px solid #27273f',
                borderRadius: '24px',
                padding: '12px 20px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              className="chat-input-field"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || loading}
              style={{
                background: currentUser.role === 'brand' ? '#06b6d4' : '#8b5cf6',
                border: 'none',
                color: '#ffffff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: (!messageText.trim() || loading) ? 'not-allowed' : 'pointer',
                opacity: (!messageText.trim() || loading) ? 0.6 : 1,
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
