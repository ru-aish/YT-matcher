'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  acceptCreatorAction,
  rejectInterestAction,
  updateCampaignAction,
  deleteCampaignAction,
} from '../../../../campaign-actions';
import {
  ArrowLeft,
  Users,
  Handshake,
  DollarSign,
  CheckCircle,
  X,
  MessageSquare,
  ExternalLink,
  Trash2,
  Edit3,
  AlertTriangle,
  Video,
  Building2,
} from 'lucide-react';

export default function CampaignDetailClient({ data }) {
  const router = useRouter();
  const { campaign, brand, interests: initialInterests, deals: initialDeals, currentUser } = data;
  const [interests, setInterests] = useState(initialInterests || []);
  const [deals, setDeals] = useState(initialDeals || []);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);

  const isBrand = currentUser?.role === 'brand';
  const pendingInterests = interests.filter(i => i.status === 'interested');
  const acceptedInterests = interests.filter(i => i.status === 'accepted');
  const handleAccept = async (creatorId) => {
    setLoading(`accept-${creatorId}`);
    setError('');
    try {
      const res = await acceptCreatorAction(campaign.id, creatorId);
      if (res.success) {
        router.refresh();
        // Optimistic: move interest to accepted
        setInterests(prev => prev.map(i =>
          i.creator?.id === creatorId ? { ...i, status: 'accepted' } : i
        ));
        // Find the creator profile to append to deals
        const creatorInterest = interests.find(i => i.creator?.id === creatorId);
        const creatorObj = creatorInterest?.creator || null;
        const newDeal = {
          id: res.dealId,
          campaignId: campaign.id,
          brandId: currentUser.id,
          creatorId: creatorId,
          title: campaign.title,
          description: campaign.description || campaign.requiredDeliverable,
          requirements: campaign.requirements || campaign.requiredDeliverable,
          status: 'pending',
          price: campaign.budgetMaxUsd || campaign.budgetMinUsd || campaign.budget || 0,
          creator: creatorObj,
        };
        setDeals(prev => [newDeal, ...prev]);
      } else {
        setError(res.error);
      }
    } catch {
      setError('Failed to accept creator');
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (interestId) => {
    setLoading(`reject-${interestId}`);
    setError('');
    try {
      const res = await rejectInterestAction(interestId);
      if (res.success) {
        setInterests(prev => prev.filter(i => i.id !== interestId));
      } else {
        setError(res.error);
      }
    } catch {
      setError('Failed to reject interest');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    setLoading('delete');
    try {
      const res = await deleteCampaignAction(campaign.id);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error);
      }
    } catch {
      setError('Failed to delete campaign');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="stagger">
      <style>{`
        .creator-hover-title:hover {
          text-decoration-color: currentColor !important;
        }
      `}</style>
      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {campaign.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 4 }}>
            <span className={`badge ${campaign.status === 'active' ? 'badge-success' : campaign.status === 'paused' ? 'badge-warning' : 'badge-neutral'}`}>
              {campaign.status}
            </span>
            <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ${campaign.budget?.toLocaleString() || 0} budget
            </span>
          </div>
        </div>
        {isBrand && (
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading === 'delete'}>
            <Trash2 size={14} />
            {loading === 'delete' ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <AlertTriangle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* Campaign Info */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        {campaign.description && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="text-label" style={{ marginBottom: 'var(--space-sm)' }}>Description</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>{campaign.description}</p>
          </div>
        )}
        {campaign.requirements && (
          <div>
            <div className="text-label" style={{ marginBottom: 'var(--space-sm)' }}>Requirements</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>{campaign.requirements}</p>
          </div>
        )}
      </div>

      {/* Interested Creators */}
      {isBrand && (
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Users size={18} style={{ color: 'var(--accent)' }} />
            Interested Creators
            {pendingInterests.length > 0 && (
              <span className="badge badge-accent">{pendingInterests.length}</span>
            )}
          </h3>

          {pendingInterests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              No pending interests yet. Creators will express interest when they see your campaign.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {pendingInterests.map((interest) => (
                <div key={interest.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div 
                    onClick={() => setSelectedCreator(interest.creator)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flex: 1, cursor: 'pointer', minWidth: 0 }}
                    title="Click to view creator profile"
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {interest.creator?.avatarUrl ? (
                        <img src={interest.creator.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <Video size={16} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color var(--duration-fast)' }} className="creator-hover-title">{interest.creator?.name || 'Creator'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Video size={11} />
                        {interest.creator?.youtubeChannel || 'No channel'}
                      </div>
                      {interest.creator?.bio && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                          {interest.creator.bio.slice(0, 120)}{interest.creator.bio.length > 120 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAccept(interest.creator?.id)}
                      disabled={loading === `accept-${interest.creator?.id}`}
                    >
                      <CheckCircle size={14} />
                      {loading === `accept-${interest.creator?.id}` ? '...' : 'Accept'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(interest.id)}
                      disabled={loading === `reject-${interest.id}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Deals */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Handshake size={18} style={{ color: 'var(--secondary)' }} />
          Active Deals
          {deals.length > 0 && <span className="badge badge-success">{deals.length}</span>}
        </h3>

        {deals.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
            No deals created yet. Accept interested creators to start deals.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {deals.map((deal) => (
              <div key={deal.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                <div 
                  onClick={() => setSelectedCreator(deal.creator)}
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  title="Click to view creator profile"
                >
                  <div 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: '0.95rem', 
                      color: 'var(--secondary)', 
                      textDecoration: 'underline', 
                      textDecorationColor: 'transparent',
                      transition: 'text-decoration-color var(--duration-fast)'
                    }} 
                    className="creator-hover-title"
                  >
                    {deal.creator?.name || 'Creator'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 4 }}>
                    <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{deal.id}</span>
                    <span className={`badge ${deal.status === 'escrow_funded' ? 'badge-success' : 'badge-warning'}`}>
                      {deal.status.replace('_', ' ')}
                    </span>
                    <span className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--status-success)' }}>
                      ${deal.price?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/deal/${deal.id}`)}>
                    <ExternalLink size={14} /> Deal
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/chat/${deal.id}`)}>
                    <MessageSquare size={14} /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Creator Profile Modal */}
      {selectedCreator && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(5, 5, 5, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)',
            animation: 'fadeIn var(--duration-fast) var(--ease-out)',
          }}
          onClick={() => setSelectedCreator(null)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              animation: 'scaleIn var(--duration-normal) var(--ease-spring)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selectedCreator.avatarUrl ? (
                    <img src={selectedCreator.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <Video size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {selectedCreator.name || 'Creator'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Video size={11} />
                    {selectedCreator.youtubeChannel || 'No channel'}
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-ghost btn-icon btn-sm" 
                onClick={() => setSelectedCreator(null)}
                style={{ width: 28, height: 28 }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {/* Channel Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div className="text-label" style={{ fontSize: '0.65rem', marginBottom: 4 }}>Subscribers</div>
                  <div className="text-mono text-accent" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {selectedCreator.subscriberCount?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: '0 0 10px var(--accent-glow)' }}>
                  <div className="text-label" style={{ fontSize: '0.65rem', marginBottom: 4 }}>Avg. Views / Video</div>
                  <div className="text-mono text-secondary-color" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {selectedCreator.averageViewsPerVideo?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div className="text-label" style={{ fontSize: '0.65rem', marginBottom: 4 }}>Niche</div>
                  <div className="text-mono" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>
                    {selectedCreator.primaryNiche || 'N/A'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div className="text-label" style={{ fontSize: '0.65rem', marginBottom: 4 }}>Min Sponsorship</div>
                  <div className="text-mono text-secondary-color" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {selectedCreator.minimumSponsorshipRateUsd ? `$${selectedCreator.minimumSponsorshipRateUsd.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Channel URL & Audience */}
              <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Audience Country:</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>{selectedCreator.topAudienceCountry || 'Global'}</span>
                </div>
                {selectedCreator.youtubeChannelUrl && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-xs)' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Channel Link:</span>
                    <a 
                      href={selectedCreator.youtubeChannelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      Visit Channel <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <div className="text-label" style={{ marginBottom: 'var(--space-sm)' }}>Bio / Description</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {selectedCreator.bio || 'No bio provided.'}
                </p>
              </div>

              {/* Modal Footer (Action buttons) */}
              {isBrand && pendingInterests.some(i => i.creator?.id === selectedCreator.id) && (
                <div style={{ display: 'flex', gap: 'var(--space-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      handleAccept(selectedCreator.id);
                      setSelectedCreator(null);
                    }}
                    disabled={loading === `accept-${selectedCreator.id}`}
                  >
                    <CheckCircle size={14} />
                    Accept Application
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ width: '48px', padding: 0 }}
                    onClick={() => {
                      const interest = pendingInterests.find(i => i.creator?.id === selectedCreator.id);
                      if (interest) handleReject(interest.id);
                      setSelectedCreator(null);
                    }}
                    disabled={loading === `accept-${selectedCreator.id}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
