'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCampaignsAction,
  createCampaignAction,
} from '../../campaign-actions';
import {
  Plus,
  Search,
  Filter,
  Megaphone,
  Users,
  Handshake,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function BrandDashboard({ initialUser }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create campaign form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newReqs, setNewReqs] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCampaignsAction();
      if (res.success) {
        setCampaigns(res.campaigns || []);
      } else {
        setError(res.error || 'Failed to load campaigns');
      }
    } catch {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await createCampaignAction({
        title: newTitle,
        description: newDesc,
        requirements: newReqs,
        budget: newBudget,
      });
      if (res.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        setNewReqs('');
        setNewBudget('');
        await loadCampaigns();
      } else {
        setError(res.error || 'Failed to create campaign');
      }
    } catch {
      setError('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  // Filter campaigns
  const filtered = campaigns.filter((c) => {
    const matchesSearch = !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalCampaigns = campaigns.length;
  const totalInterests = campaigns.reduce((sum, c) => sum + (c.interestCount || 0), 0);
  const totalDeals = campaigns.reduce((sum, c) => sum + (c.dealCount || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);

  return (
    <div className="stagger">
      {/* Header */}
      <div className={styles.dashHeader}>
        <h2 className={styles.dashTitle}>My Campaigns</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Campaigns</div>
          <div className={`${styles.statValue} ${styles.statAccent}`}>
            {totalCampaigns}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Interested Creators</div>
          <div className={`${styles.statValue} ${styles.statSecondary}`}>
            {totalInterests}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Deals</div>
          <div className={styles.statValue} style={{ color: 'var(--text-primary)' }}>
            {totalDeals}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Budget</div>
          <div className={styles.statValue} style={{ color: 'var(--status-success)' }}>
            <span className="text-mono">${totalBudget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {['all', 'active', 'paused', 'completed'].map((status) => (
          <button
            key={status}
            className={`${styles.filterBtn} ${statusFilter === status ? styles.active : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <div className={styles.campaignGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 160 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Megaphone size={28} />
          </div>
          <h3 className={styles.emptyTitle}>
            {searchQuery || statusFilter !== 'all' ? 'No matching campaigns' : 'No campaigns yet'}
          </h3>
          <p className={styles.emptyDesc}>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first campaign to start discovering and partnering with YouTube creators.'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className={styles.campaignGrid}>
          {filtered.map((campaign) => (
            <div
              key={campaign.id}
              className={styles.campaignCard}
              onClick={() => router.push(`/dashboard/campaign/${campaign.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <h3 className={styles.campaignCardTitle}>{campaign.title}</h3>
                <span className={`badge ${
                  campaign.status === 'active' ? 'badge-success' :
                  campaign.status === 'paused' ? 'badge-warning' : 'badge-neutral'
                }`}>
                  {campaign.status}
                </span>
              </div>

              {campaign.description && (
                <p className={styles.campaignCardDesc}>{campaign.description}</p>
              )}

              <div className={styles.campaignCardMeta}>
                <div className={styles.campaignCardStat}>
                  <DollarSign size={12} />
                  <span>${campaign.budget?.toLocaleString() || 0}</span>
                </div>
                <div className={styles.campaignCardStat}>
                  <Users size={12} />
                  <span>{campaign.interestCount || 0} interested</span>
                </div>
                <div className={styles.campaignCardStat}>
                  <Handshake size={12} />
                  <span>{campaign.dealCount || 0} deals</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create Campaign</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Q4 Tech Review Push"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="input"
                  placeholder="What is this campaign about?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements for Creators</label>
                <textarea
                  className="input"
                  placeholder="What do you need from creators? (content type, timeline, etc.)"
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Budget (USD)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="5000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  min="0"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                  style={{ flex: 1 }}
                >
                  {creating ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
