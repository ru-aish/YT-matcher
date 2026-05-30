'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from '../../actions';
import {
  User,
  Video,
  Building2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Globe,
  Users as UsersIcon,
  DollarSign,
  Tag,
} from 'lucide-react';
import styles from './ProfileSetup.module.css';

export default function ProfileSetup({ initialUser }) {
  const router = useRouter();
  const [user] = useState(initialUser);
  // Role is fixed at registration — never re-selected here.
  const role = user.role === 'brand' ? 'brand' : 'creator';

  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');

  // Creator fields
  const [youtubeChannel, setYoutubeChannel] = useState(user.youtubeChannel || '');
  const [primaryNiche, setPrimaryNiche] = useState(user.primaryNiche || '');
  const [subscriberCount, setSubscriberCount] = useState(user.subscriberCount ?? '');
  const [minRate, setMinRate] = useState(user.minimumSponsorshipRateUsd ?? '');

  // Brand fields
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || '');
  const [productDescription, setProductDescription] = useState(user.productDescription || '');
  const [targetCreatorNiche, setTargetCreatorNiche] = useState(user.targetCreatorNiche || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditing = user.profileCompleted;

  // Lock background scroll while the (non-skippable) modal is open.
  useEffect(() => {
    if (isEditing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateProfileAction({
        name,
        role,
        bio,
        youtubeChannel: role === 'creator' ? youtubeChannel : null,
        primaryNiche: role === 'creator' ? primaryNiche : null,
        subscriberCount: role === 'creator' ? subscriberCount : null,
        minimumSponsorshipRateUsd: role === 'creator' ? minRate : null,
        companyName: role === 'brand' ? companyName : null,
        websiteUrl: role === 'brand' ? websiteUrl : null,
        productDescription: role === 'brand' ? productDescription : null,
        targetCreatorNiche: role === 'brand' ? targetCreatorNiche : null,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('Profile saved!');
        router.refresh();
      }
    } catch {
      setError('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="profile-setup-title">
      <div className={styles.backdrop} />
      <div className={styles.modal}>
        <div className={styles.accentBar} />

        <div className={styles.header}>
          <div className={`${styles.roleBadge} ${role === 'brand' ? styles.roleBadgeBrand : styles.roleBadgeCreator}`}>
            {role === 'brand' ? <Building2 size={15} /> : <Sparkles size={15} />}
            {role === 'brand' ? 'Brand account' : 'Creator account'}
          </div>
          <h2 id="profile-setup-title" className={styles.title}>
            {isEditing ? 'Edit your profile' : 'Complete your profile'}
          </h2>
          <p className={styles.subtitle}>
            {isEditing
              ? 'Keep your details up to date.'
              : role === 'brand'
                ? 'Tell creators who you are and what you’re looking for. This unlocks your dashboard.'
                : 'Tell brands about your channel so the right deals find you. This unlocks your dashboard.'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-lg)' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Display name */}
          <div className="form-group">
            <label className="form-label">{role === 'brand' ? 'Brand name' : 'Display name'}</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                className="input input-with-icon"
                placeholder={role === 'brand' ? 'e.g. TechCorp' : 'e.g. Marques Brownlee'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {role === 'creator' ? (
            <>
              <div className={styles.fieldRow}>
                <div className="form-group">
                  <label className="form-label">YouTube channel</label>
                  <div className="input-wrapper">
                    <Video size={16} className="input-icon" />
                    <input
                      type="text"
                      className="input input-with-icon"
                      placeholder="youtube.com/c/yourchannel"
                      value={youtubeChannel}
                      onChange={(e) => setYoutubeChannel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Primary niche</label>
                  <div className="input-wrapper">
                    <Tag size={16} className="input-icon" />
                    <input
                      type="text"
                      className="input input-with-icon"
                      placeholder="e.g. Tech, Gaming, Beauty"
                      value={primaryNiche}
                      onChange={(e) => setPrimaryNiche(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className="form-group">
                  <label className="form-label">Subscribers</label>
                  <div className="input-wrapper">
                    <UsersIcon size={16} className="input-icon" />
                    <input
                      type="number"
                      min="0"
                      className="input input-with-icon"
                      placeholder="e.g. 120000"
                      value={subscriberCount}
                      onChange={(e) => setSubscriberCount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Min. sponsorship rate (USD)</label>
                  <div className="input-wrapper">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      min="0"
                      className="input input-with-icon"
                      placeholder="e.g. 1500"
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.fieldRow}>
                <div className="form-group">
                  <label className="form-label">Company name</label>
                  <div className="input-wrapper">
                    <Building2 size={16} className="input-icon" />
                    <input
                      type="text"
                      className="input input-with-icon"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <div className="input-wrapper">
                    <Globe size={16} className="input-icon" />
                    <input
                      type="text"
                      className="input input-with-icon"
                      placeholder="https://yourbrand.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target creator niche</label>
                <div className="input-wrapper">
                  <Tag size={16} className="input-icon" />
                  <input
                    type="text"
                    className="input input-with-icon"
                    placeholder="e.g. Tech reviewers, fitness creators"
                    value={targetCreatorNiche}
                    onChange={(e) => setTargetCreatorNiche(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">What are you promoting?</label>
                <textarea
                  className="input"
                  placeholder="Describe your product or campaign goals..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  style={{ minHeight: '90px' }}
                />
              </div>
            </>
          )}

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">{role === 'brand' ? 'About the brand' : 'About you'}</label>
            <textarea
              className="input"
              placeholder={
                role === 'brand'
                  ? 'A short intro creators will see...'
                  : 'A short intro brands will see...'
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              style={{ minHeight: '90px' }}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-block btn-lg ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update profile' : 'Complete setup & enter dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
