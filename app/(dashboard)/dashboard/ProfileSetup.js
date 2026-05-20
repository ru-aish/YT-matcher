'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from '../../actions';
import { User, Video, Building2, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './ProfileSetup.module.css';

export default function ProfileSetup({ initialUser }) {
  const router = useRouter();
  const [user] = useState(initialUser);
  const [role, setRole] = useState(user.role || 'creator');
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [youtubeChannel, setYoutubeChannel] = useState(user.youtubeChannel || '');
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        companyName: role === 'brand' ? companyName : null,
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

  const isEditing = user.profileCompleted;

  return (
    <div className={styles.setup}>
      <div className={styles.setupCard}>
        <div className={styles.setupHeader}>
          <h2 className={styles.setupTitle}>
            {isEditing ? 'Edit Profile' : 'Complete Your Profile'}
          </h2>
          <p className={styles.setupSubtitle}>
            {isEditing
              ? 'Keep your details up to date'
              : 'Set up your role and details to start using YT Matcher'}
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
          {/* Role Selector */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'creator' ? styles.active : ''}`}
                onClick={() => !isEditing && setRole('creator')}
                disabled={isEditing}
              >
                <Sparkles size={18} />
                Creator
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'brand' ? styles.active : ''}`}
                onClick={() => !isEditing && setRole('brand')}
                disabled={isEditing}
              >
                <Building2 size={18} />
                Brand
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                className="input input-with-icon"
                placeholder="e.g. Marques Brownlee or TechCorp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role-specific field */}
          {role === 'creator' ? (
            <div className="form-group">
              <label className="form-label">YouTube Channel</label>
              <div className="input-wrapper">
                <Video className="input-icon" />
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
          ) : (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div className="input-wrapper">
                <Building2 className="input-icon" />
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
          )}

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio / Description</label>
            <textarea
              className="input"
              placeholder="Tell us about yourself or your campaign goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              style={{ minHeight: '120px' }}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-block btn-lg ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
