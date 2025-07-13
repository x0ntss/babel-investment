const API_BASE = '/api/admin';

export const adminLogin = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid admin credentials');
  return res.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUserBalance = async (userId, action, amount) => {
  const res = await fetch(`${API_BASE}/users/${userId}/balance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ action, amount }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update user balance');
  return res.json();
};

export const getTransactions = async () => {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const reviewTransaction = async (userId, transactionId, status, reason) => {
  const res = await fetch(`${API_BASE}/transactions/${userId}/${transactionId}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status, reason }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to review transaction';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
};

export const getUsersByTeamMember = async (teamMemberId) => {
  const res = await fetch(`${API_BASE}/team-member/${teamMemberId}/users`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch users for team member');
  return res.json();
};

export const getTeamMembersForUser = async (userId) => {
  const res = await fetch(`${API_BASE}/team/${userId}/members`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
}; 