import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../api/auth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setFormData((prev) => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateProfile(payload);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to update profile.');
    }
  };

  return (
    <div className="auth-card profile-card">
      <h1>My Profile</h1>
      <p className="profile-intro">Manage your account details and keep your profile current.</p>

      {loading ? (
        <div className="loader">Loading profile...</div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-card">{error}</div>}
          {successMessage && <div className="info-card">{successMessage}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat new password"
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="button button-primary">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
