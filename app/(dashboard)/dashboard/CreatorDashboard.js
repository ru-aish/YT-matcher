'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAvailableCampaignsAction,
  expressInterestAction,
} from '../../campaign-actions';
import { getMyDealsAction } from '../../actions';
import {
  Search,
  Megaphone,
  Hand,
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function CreatorDashboard({ initialUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('available');
  const [campaigns, setCampaigns] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expressingId, setExpressingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [campaignsRes, dealsRes] = await Promise.all([
        getAvailableCampaignsAction(),
        getMyDealsAction(),
      ]);

      if (campaignsRes.success) setCampaigns(campaignsRes.campaigns || []);
      if (dealsRes.success) setDeals(dealsRes.deals || []);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (campaignId) => {
    setExpressingId(campaignId);
    try {
      const res = await expressInterestAction(campaignId);
      if (res.success) {
        await loadData();
      } else {
        setError(res.error || 'Failed to express interest');
      }
    } catch {
      setError('Failed to express interest');
    } finally {
      setExpressingId(null);
    }
  };

  // Filter logic
  const ongoingDeals = deals.filter(d => d.status !== 'completed');
  const completedDeals = deals.filter(d => d.status === 'completed');

  const filteredCampaigns = campaigns.filter(c =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeals = (activeTab === 'ongoing' ? ongoingDeals : completedDeals).filter(d =>
    !searchQuery || d.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalDeals = deals.length;
  const totalEarnings = deals.reduce((sum, d) => sum + (d.price || 0), 0);

  const tabs = [
    { id: 'available', label: 'Available Campaigns', count: campaigns.length },
    { id: 'ongoing', label: 'My Deals', count: ongoingDeals.length },
    { id: 'completed', label: 'Completed', count: completedDeals.length },
  ];

  return (
    <div className="stagger">
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Available Campaigns</div>
          <div className={`${styles.statValue} ${styles.statAccent}`}>{campaigns.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Deals</div>
          <div className={`${styles.statValue} ${styles.statSecondary}`}>{ongoingDeals.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Earnings</div>
          <div className={styles.statValue} style={{ color: 'var(--status-success)' }}>
            <span className="text-mono">${totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.toolbar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.filterBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="text-mono" style={{ fontSize: '0.7rem' }}>({tab.count})</span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.campaignGrid}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 160 }} />
          ))}
        </div>
      ) : activeTab === 'available' ? (
        /* Available Campaigns */
        filteredCampaigns.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Megaphone size={28} />
            </div>
            <h3 className={styles.emptyTitle}>No campaigns available</h3>
            <p className={styles.emptyDesc}>
              New campaigns from brands will appear here. Check back soon!
            </p>
          </div>
        ) : (
          <div className={styles.campaignGrid}>
            {filteredCampaigns.map((campaign) => {
              const hasInterest = !!campaign.myInterest;
              const isAccepted = campaign.myInterest?.status === 'accepted';
              const isRejected = campaign.myInterest?.status === 'rejected';

              return (
                <div key={campaign.id} className={styles.campaignCard} style={{ cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 
                      className={styles.campaignCardTitle}
                      style={{ cursor: 'pointer', color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color var(--duration-fast)' }}
                      onClick={() => router.push(`/dashboard/campaign/${campaign.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
                    >
                      {campaign.title}
                    </h3>
                    {hasInterest && (
                      <span className={`badge ${
                        isAccepted ? 'badge-success' :
                        isRejected ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {campaign.myInterest.status}
                      </span>
                    )}
                  </div>

                  {campaign.brand && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                      {campaign.brand.companyName || campaign.brand.name}
                    </div>
                  )}

                  {campaign.description && (
                    <p className={styles.campaignCardDesc}>{campaign.description}</p>
                  )}

                  {campaign.requirements && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-md)', lineHeight: 1.4 }}>
                      <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>Requirements:</strong>
                      <br />
                      {campaign.requirements}
                    </div>
                  )}

                  <div className={styles.campaignCardMeta}>
                    <div className={styles.campaignCardStat}>
                      <DollarSign size={12} />
                      <span>${campaign.budget?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {!hasInterest ? (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleExpressInterest(campaign.id)}
                      disabled={expressingId === campaign.id}
                    >
                      {expressingId === campaign.id ? (
                        'Expressing interest...'
                      ) : (
                        <>
                          <Hand size={16} />
                          I'm Interested
                        </>
                      )}
                    </button>
                  ) : isAccepted ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={14} />
                      Accepted! Check your deals tab.
                    </div>
                  ) : isRejected ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-danger)' }}>
                      Interest was declined by the brand.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} />
                      Waiting for brand response...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Deals (ongoing or completed) */
        filteredDeals.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <MessageSquare size={28} />
            </div>
            <h3 className={styles.emptyTitle}>
              {activeTab === 'ongoing' ? 'No active deals' : 'No completed deals'}
            </h3>
            <p className={styles.emptyDesc}>
              {activeTab === 'ongoing'
                ? 'Express interest in available campaigns to start getting deals!'
                : 'Your completed deals will appear here.'}
            </p>
          </div>
        ) : (
          <div className={styles.campaignGrid}>
            {filteredDeals.map((deal) => (
              <div key={deal.id} className={styles.campaignCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className={styles.campaignCardTitle}>
                    {deal.otherUser?.companyName || deal.otherUser?.name || 'Brand'}
                  </h3>
                  <span className={`badge ${
                    deal.status === 'escrow_funded' ? 'badge-success' :
                    deal.status === 'completed' ? 'badge-neutral' : 'badge-warning'
                  }`}>
                    {deal.status.replace('_', ' ')}
                  </span>
                </div>

                <div className={styles.campaignCardMeta}>
                  <div className={styles.campaignCardStat}>
                    <DollarSign size={12} />
                    <span>${deal.price?.toLocaleString() || 0}</span>
                  </div>
                  <div className={styles.campaignCardStat}>
                    <span className="text-mono">#{deal.id}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => router.push(`/deal/${deal.id}`)}
                  >
                    <ExternalLink size={14} />
                    Deal Room
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => router.push(`/chat/${deal.id}`)}
                  >
                    <MessageSquare size={14} />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
