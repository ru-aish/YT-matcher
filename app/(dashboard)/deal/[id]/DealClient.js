'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import { updateDealStatusAction } from '../../../actions';
import {
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Lock,
  CheckCircle,
  Video,
  Building2,
  ExternalLink,
} from 'lucide-react';
import styles from './DealClient.module.css';

function cleanEnvVar(value) {
  if (!value) return '';
  return value.replace(/['"]/g, '').trim();
}

export default function DealClient({ initialData }) {
  const router = useRouter();
  const { deal: initialDeal, currentUser, otherUser } = initialData;
  const [deal, setDeal] = useState(initialDeal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Subscribe to real-time events via Pusher
  useEffect(() => {
    const key = cleanEnvVar(process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.NEXT_PUBLIC_key || '');
    const cluster = cleanEnvVar(process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.NEXT_PUBLIC_cluster || '');

    if (!key || !cluster) return;

    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe(`deal-${deal.id}`);

    channel.bind('status-updated', (data) => {
      if (data.status) {
        setDeal(prev => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`deal-${deal.id}`);
      pusher.disconnect();
    };
  }, [deal.id]);

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateDealStatusAction(deal.id, newStatus);
      if (res.error) {
        setError(res.error);
      } else if (res.deal) {
        setDeal(res.deal);
        setSuccess(`Deal status updated to ${newStatus.replace('_', ' ')}!`);
      }
    } catch {
      setError('Failed to update deal status.');
    } finally {
      setLoading(false);
    }
  };

  const isBrand = currentUser.role === 'brand';
  const isCreator = currentUser.role === 'creator';

  return (
    <div className="stagger">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Deal Room
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 4 }}>
            <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              #MATCH-{deal.id}
            </span>
            <span>·</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {isBrand ? <Video size={12} /> : <Building2 size={12} />}
              Partner: {otherUser?.name || 'Partner'}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => router.push(`/chat/${deal.id}`)}
        >
          <MessageSquare size={16} />
          Open Chat Room
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className={styles.dealRoom}>
        {/* Left: Agreement Parameters */}
        <div className={styles.dealMain}>
          <div className="card">
            <h3 className={styles.sectionTitle}>Agreement Details</h3>
            <div className={styles.paramList}>
              <div className={styles.paramItem}>
                <span className={styles.paramLabel}>Title</span>
                <span className={styles.paramValue}>{deal.title || 'Untitled Deal'}</span>
              </div>
              {deal.description && (
                <div className={styles.paramItem} style={{ flexDirection: 'column', gap: 4 }}>
                  <span className={styles.paramLabel}>Description</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {deal.description}
                  </span>
                </div>
              )}
              {deal.requirements && (
                <div className={styles.paramItem} style={{ flexDirection: 'column', gap: 4 }}>
                  <span className={styles.paramLabel}>Requirements</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {deal.requirements}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Escrow Funding widget */}
        <div className={styles.escrowBox}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '0.95rem', marginBottom: 0 }}>
            Escrow State
          </h3>

          <div className={styles.budgetDisplay}>
            <div className={styles.budgetValue}>
              ${deal.price?.toLocaleString() || 0}
            </div>
            <div className={styles.budgetLabel}>Contract Value</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
            <span className={`${styles.escrowBadge} ${deal.status === 'completed' ? styles.funded : deal.status === 'escrow_funded' ? styles.funded : styles.pending}`}>
              {deal.status.replace('_', ' ')}
            </span>
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          {/* Conditional Instructions & Actions */}
          {deal.status === 'pending' && (
            <>
              {isBrand ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className={`${styles.escrowMsg} ${styles.warning}`}>
                    Please fund the escrow to secure this campaign. Funds will be held safely until the creator delivers the work.
                  </div>
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={() => handleUpdateStatus('escrow_funded')}
                    disabled={loading}
                  >
                    <Lock size={16} />
                    {loading ? 'Funding...' : 'Fund Escrow (Simulate)'}
                  </button>
                </div>
              ) : (
                <div className={`${styles.escrowMsg} ${styles.warning}`}>
                  ⚠️ Awaiting escrow funding from the Brand. Please do not start production until funds are secured.
                </div>
              )}
            </>
          )}

          {deal.status === 'escrow_funded' && (
            <>
              {isBrand ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className={`${styles.escrowMsg} ${styles.success}`}>
                    Escrow is funded. Once the creator completes the integration and you approve the video, release the funds.
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={loading}
                  >
                    <CheckCircle size={16} />
                    {loading ? 'Releasing...' : 'Release Funds (Payout)'}
                  </button>
                </div>
              ) : (
                <div className={`${styles.escrowMsg} ${styles.success}`}>
                  🎉 Escrow is funded! It is now safe to begin production. Coordinate script and draft approvals via the Chat Room.
                </div>
              )}
            </>
          )}

          {deal.status === 'completed' && (
            <div className={`${styles.escrowMsg} ${styles.success}`} style={{ textAlign: 'center' }}>
              <ShieldCheck size={32} style={{ margin: '0 auto var(--space-sm)', color: 'var(--status-success)' }} />
              <strong>Deal Completed</strong>
              <br />
              Funds have been released to the creator.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
