'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  updateProfileAction, 
  seedMockCreatorsAction, 
  getCreatorsAction, 
  getMyDealsAction, 
  createDealAction 
} from '../actions';
import { useClerk } from '@clerk/nextjs';
import { 
  LogOut, 
  User, 
  Sparkles, 
  Building2, 
  Video, 
  CheckCircle,
  Database,
  Search,
  Bell,
  Layers,
  Settings,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export default function DashboardClient({ initialUser }) {
  const router = useRouter();
  const { signOut } = useClerk();
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Profile form state
  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.role || 'creator');
  const [bio, setBio] = useState(user.bio || '');
  const [youtubeChannel, setYoutubeChannel] = useState(user.youtubeChannel || '');
  const [companyName, setCompanyName] = useState(user.companyName || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Creators & deals list state
  const [creators, setCreators] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoadingData(true);
      setError('');
      try {
        if (user.role === 'brand' && process.env.NODE_ENV === 'development') {
          // Attempt seeding mock creators in local dev automatically
          await seedMockCreatorsAction();
          const creatorsRes = await getCreatorsAction();
          if (creatorsRes.success) {
            setCreators(creatorsRes.creators || []);
          } else {
            setError(creatorsRes.error || "Failed to load creators");
          }
        }
        
        const dealsRes = await getMyDealsAction();
        if (dealsRes.success) {
          setDeals(dealsRes.deals || []);
        } else {
          console.warn("Failed to load deals:", dealsRes.error);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoadingData(false);
      }
    }
    
    if (user.profileCompleted) {
      loadDashboardData();
    }
  }, [user.profileCompleted, user.role]);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = {
        name,
        role,
        bio,
        youtubeChannel: role === 'creator' ? youtubeChannel : null,
        companyName: role === 'brand' ? companyName : null,
      };

      const res = await updateProfileAction(data);
      if (res.error) {
        setError(res.error);
      } else if (res.user) {
        setUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        if (!user.profileCompleted) {
          router.refresh();
        }
      }
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDeal = async (creatorId) => {
    setLoading(true);
    setError('');
    try {
      const res = await createDealAction(creatorId, 1200); // default mock budget
      if (res.success) {
        router.push(`/deal/${res.dealId}`);
      } else {
        setError(res.error || "Failed to start deal");
      }
    } catch (err) {
      setError("Failed to start deal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <Sparkles style={{ color: '#8b5cf6' }} />
            <span>YT Matcher</span>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Layers size={18} />
              Overview
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <User size={18} />
              Profile Settings
            </button>
          </nav>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user.name || user.email}</span>
            <span className="user-role">{user.role}</span>
          </div>
          
          <button onClick={handleLogout} className="logout-btn" title="Sign Out" disabled={loading}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div className="welcome-section">
            <h1>Welcome, {user.name || 'User'}!</h1>
            <p>Role: <span style={{ textTransform: 'uppercase', fontWeight: 700, color: user.role === 'brand' ? '#06b6d4' : '#8b5cf6' }}>{user.role}</span></p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '20px', 
                  padding: '8px 12px 8px 32px', 
                  color: 'white',
                  fontSize: '0.85rem'
                }} 
              />
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Display general errors */}
        {error && activeTab !== 'profile' && (
          <div className="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Panel Content */}
        {activeTab === 'profile' || !user.profileCompleted ? (
          /* Profile Settings Panel */
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div className="auth-card" style={{ maxWidth: '100%', animation: 'slideUp 0.4s ease' }}>
              <div className="auth-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h2 className="auth-title">
                  {user.profileCompleted ? 'Edit Profile Details' : 'Complete Your Profile'}
                </h2>
                <p className="auth-subtitle">
                  {user.profileCompleted 
                    ? 'Keep your details updated' 
                    : 'Select your role and fill in your profile before getting matched'}
                </p>
              </div>

              {error && activeTab === 'profile' && (
                <div className="alert">
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success">
                  <CheckCircle size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                {/* Role selection toggle (only editable if completing profile for the first time) */}
                <div className="form-group">
                  <label className="form-label">I am a...</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className={`btn ${role === 'creator' ? 'btn-purple' : ''}`}
                      style={{ 
                        flex: 1, 
                        background: role === 'creator' ? '#8b5cf6' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: role === 'creator' ? '#8b5cf6' : 'var(--border-color)',
                        color: role === 'creator' ? '#ffffff' : 'var(--text-secondary)',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: user.profileCompleted ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => !user.profileCompleted && setRole('creator')}
                      disabled={user.profileCompleted}
                    >
                      <Sparkles size={16} />
                      Creator
                    </button>
                    
                    <button
                      type="button"
                      className={`btn ${role === 'brand' ? 'btn-cyan' : ''}`}
                      style={{ 
                        flex: 1, 
                        background: role === 'brand' ? '#06b6d4' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: role === 'brand' ? '#06b6d4' : 'var(--border-color)',
                        color: role === 'brand' ? '#ffffff' : 'var(--text-secondary)',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: user.profileCompleted ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => !user.profileCompleted && setRole('brand')}
                      disabled={user.profileCompleted}
                    >
                      <Building2 size={16} />
                      Brand / Company
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Marques Brownlee or TechCorp"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {role === 'creator' ? (
                  <div className="form-group">
                    <label className="form-label">YouTube Channel Name / URL</label>
                    <div className="input-wrapper">
                      <Video className="input-icon" />
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="youtube.com/c/yourchannel"
                        value={youtubeChannel}
                        onChange={(e) => setYoutubeChannel(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <div className="input-wrapper">
                      <Building2 className="input-icon" />
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Bio / Description</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Tell us about yourself or your company campaign goals..."
                    style={{ minHeight: '120px', paddingLeft: '1rem', resize: 'vertical' }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn ${role === 'brand' ? 'btn-cyan' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Overview Dashboard showing Creators and Deals */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'slideUp 0.4s ease' }}>
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '1.5rem', 
              width: '100%' 
            }}>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Role</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: user.role === 'brand' ? '#06b6d4' : '#8b5cf6' }}>
                  {user.role === 'brand' ? 'Brand Partner' : 'Creator'}
                </div>
              </div>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Chat Threads</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                  {deals.length}
                </div>
              </div>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Potential Budget</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                  ${deals.reduce((sum, d) => sum + (d.price || 0), 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Dashboard Contents Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: user.role === 'brand' ? '2fr 1.2fr' : '1fr', 
              gap: '2rem' 
            }}>
              {/* Creator discovery directory (for Brands) OR main active chats list (for Creators) */}
              <div>
                {user.role === 'brand' ? (
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles size={22} style={{ color: '#8b5cf6' }} />
                      Discover YouTube Creators
                    </h2>

                    {loadingData ? (
                      <div style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading creators list...</div>
                    ) : creators.length === 0 ? (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No creators have registered or seeded yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {creators.map((creator) => (
                          <div 
                            key={creator.id} 
                            style={{ 
                              background: 'rgba(255,255,255,0.02)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '12px', 
                              padding: '1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                              transition: 'all 0.2s ease',
                            }}
                            className="creator-card-item"
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                              <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{creator.name}</h3>
                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', alignItems: 'center' }}>
                                  <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{creator.youtubeChannel}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                                  <span style={{ color: 'var(--text-muted)' }}>{creator.email}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleStartDeal(creator.id)}
                                className="btn btn-purple"
                                style={{ 
                                  padding: '8px 16px', 
                                  fontSize: '0.85rem', 
                                  borderRadius: '8px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px',
                                  margin: 0,
                                  width: 'auto'
                                }}
                                disabled={loading}
                              >
                                <MessageSquare size={14} />
                                Start Deal & Chat
                              </button>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                              {creator.bio || "No biography provided."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Creator View: Active Deals list */
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MessageSquare size={22} style={{ color: '#8b5cf6' }} />
                      Active Brand Collaborations
                    </h2>

                    {loadingData ? (
                      <div style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading collaboration threads...</div>
                    ) : deals.length === 0 ? (
                      <div className="empty-state-card" style={{ padding: '3.5rem' }}>
                        <div className="empty-state-icon" style={{ background: 'rgba(139, 92, 246, 0.05)', color: '#8b5cf6' }}>
                          <MessageSquare size={36} />
                        </div>
                        <h3>No Active Conversations Yet</h3>
                        <p style={{ maxWidth: '400px', margin: '0.5rem auto 0' }}>
                          Once a brand starts a sponsorship conversation with you, it will appear here. Complete your profile details so brands can find your channel!
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        {deals.map((deal) => (
                          <div 
                            key={deal.id}
                            onClick={() => router.push(`/deal/${deal.id}`)}
                            style={{ 
                              background: 'rgba(255,255,255,0.02)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '12px', 
                              padding: '1.5rem',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            className="deal-list-item"
                          >
                            <div>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                                Proposal with {deal.otherUser?.companyName || deal.otherUser?.name || 'Brand'}
                              </h3>
                              <p style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                                Thread #{deal.id}
                              </p>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                Contact: {deal.otherUser?.email} | Status: <span style={{ color: deal.status === 'escrow_funded' ? '#10b981' : 'orange', fontWeight: 600 }}>{deal.status}</span>
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>${deal.price}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget</div>
                              </div>
                              <button 
                                className="btn btn-purple" 
                                style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', margin: 0 }}
                              >
                                Enter Chat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Active Chats listing (for Brands only) */}
              {user.role === 'brand' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={20} style={{ color: '#06b6d4' }} />
                    Active Deals
                  </h2>

                  {loadingData ? (
                    <div style={{ color: 'var(--text-secondary)' }}>Loading chats...</div>
                  ) : deals.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No active discussions initiated yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {deals.map((deal) => (
                        <div 
                          key={deal.id}
                          onClick={() => router.push(`/deal/${deal.id}`)}
                          style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '10px', 
                            padding: '1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          className="deal-list-item-side"
                        >
                          <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem', marginBottom: '0.25rem' }}>
                            {deal.otherUser?.name || 'Creator'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '0.75rem' }}>
                            {deal.otherUser?.youtubeChannel}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700, marginBottom: '0.75rem' }}>
                            Thread #{deal.id}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>${deal.price}</span>
                            <span style={{ 
                              color: deal.status === 'escrow_funded' ? '#10b981' : 'orange',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}>
                              {deal.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
