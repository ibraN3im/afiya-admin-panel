const API_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('adminToken');

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear token and reload to show login page
      localStorage.removeItem('adminToken');
      window.location.reload();
      throw new Error('Session expired. Please login again.');
    }

    let error;
    try {
      error = await response.json();
    } catch (e) {
      // If response is not JSON, use status text
      error = { message: response.statusText || 'Something went wrong' };
    }
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Statistics
  getStatistics: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // User Management
  getAllUsers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createAdminUser: async (userData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateUser: async (userId: string, userData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Team Management
  getAllTeamMembers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/team`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createTeamMember: async (memberData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
    return handleResponse(response);
  },

  updateTeamMember: async (memberId: string, memberData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/team/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
    return handleResponse(response);
  },

  deleteTeamMember: async (memberId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/team/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Product Management
  getAllProducts: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createProduct: async (productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (productId: string, productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Order Management
  getAllOrders: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  searchOrdersByNumber: async (orderNumber: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/search/${encodeURIComponent(orderNumber)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  deleteOrder: async (orderId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Messages
  getAllMessages: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getUnreadCount: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  markAsRead: async (notificationId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  markAllAsRead: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};