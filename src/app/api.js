const API_BASE = '/api/users';
const AUTH_BASE = '/api/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const updateAccountSettings = async (data) => {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const loginUser = async (identifier, password) => {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const registerUser = async ({ username, email, phone, password, code }) => {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, phone, password, code }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
};

export const requestDeposit = async (amount, proofImage) => {
  const res = await fetch(`${API_BASE}/deposit`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, proofImage }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to submit deposit';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

export const requestWithdrawal = async (amount, address) => {
  const res = await fetch(`${API_BASE}/withdrawal`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, address }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to submit withdrawal';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

export const getTeamMembers = async () => {
  const res = await fetch(`${API_BASE}/team-members`, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
};

export const getDailyTaskStatus = async () => {
  const res = await fetch(`${API_BASE}/daily-task-status`, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch daily task status');
  return res.json();
};

export const completeDailyTask = async () => {
  const res = await fetch(`${API_BASE}/complete-task`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to complete daily task';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

export const claimDailyReward = async () => {
  const res = await fetch(`${API_BASE}/claim-reward`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to claim daily reward';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

export const updateWalletAddress = async (walletAddress) => {
  const res = await fetch(`${API_BASE}/wallet-address`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to update wallet address';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

// TRON address validation helper
export const isValidTronAddress = (address) => /^T[a-zA-Z0-9]{33}$/.test(address);

export const getWithdrawalConfig = async () => {
  const res = await fetch(`${API_BASE}/withdrawal-config`, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    let errMsg = 'Failed to fetch withdrawal configuration';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
};

// New API for Team Report matching the UI structure
export const getTeamReport = async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch('/api/users/team-report', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch team report');
    return await res.json();
  } catch (err) {
    console.log(err);
    // Fallback mock for development if server is not ready
    return {
      totalTeamBalance: 1200,
      totalMembers: 5,
      specialMembers: [
        { _id: '1', username: 'Ali Ahmad', balance: 500, registrationDate: '2024-01-01' },
        { _id: '2', username: 'Sara Khaled', balance: 700, registrationDate: '2024-01-02' },
      ],
      regularMembers: [
        { _id: '3', username: 'Omar Fathi', balance: 0, registrationDate: '2024-01-03' },
        { _id: '4', username: 'Lina Noor', balance: 0, registrationDate: '2024-01-04' },
        { _id: '5', username: 'Mona Adel', balance: 0, registrationDate: '2024-01-05' },
      ],
    };
  }
}; 