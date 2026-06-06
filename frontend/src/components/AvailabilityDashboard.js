import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AvailabilityDashboard.css';

const AvailabilityDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    // Optional: Refresh users every 10 seconds
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Make sure the backend is running on port 5000.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/availability`,
        { available: !currentStatus }
      );
      
      // Update local state with the response
      setUsers(users.map(user =>
        user.id === userId ? response.data.user : user
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update availability. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading team availability...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👥 Team Availability Tracker</h1>
        <p className="subtitle">Click toggles to update team member availability</p>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="users-grid">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`user-card ${user.available ? 'available' : 'unavailable'}`}
            >
              <div className="user-header">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-status">
                    {user.available ? (
                      <>
                        <span className="status-badge available">● Available</span>
                      </>
                    ) : (
                      <>
                        <span className="status-badge unavailable">● Away</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="toggle-container">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={user.available}
                    onChange={() => handleToggleAvailability(user.id, user.available)}
                    disabled={updatingId === user.id}
                    className="toggle-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </label>
                {updatingId === user.id && (
                  <span className="updating-indicator">Updating...</span>
                )}
              </div>

              <div className="user-footer">
                <small className="timestamp">
                  Updated: {new Date(user.updated_at).toLocaleDateString()} {' '}
                  {new Date(user.updated_at).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">No users found</div>
        )}
      </div>

      <div className="dashboard-footer">
        <button className="refresh-button" onClick={fetchUsers}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default AvailabilityDashboard;
