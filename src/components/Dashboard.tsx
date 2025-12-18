import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { adminAPI } from '../api'
import * as Tabs from '@radix-ui/react-tabs'
import {
  LayoutDashboard, Users, Package, ShoppingCart, Trash2, Download,
  DollarSign, TrendingUp, CheckCircle, AlertCircle, LogOut, Plus, Edit, Eye, User, MessageCircle
} from 'lucide-react'
import { AddProductForm, AddAdminForm } from './ProductForms'
import { TeamMemberForm } from './TeamMemberForm'
import { InvoicePreview } from './InvoicePreview'
import { PrintableInvoice } from './PrintableInvoice'
import { NotificationBell } from './NotificationBell'
interface DashboardProps {
  onLogout: () => void
  adminUser?: any
}

export default function Dashboard({ onLogout, adminUser }: DashboardProps) {
  const [statistics, setStatistics] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [showAddAdminForm, setShowAddAdminForm] = useState(false)
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [previewingInvoice, setPreviewingInvoice] = useState<any>(null)
  const [printingInvoice, setPrintingInvoice] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderNumberFilter, setOrderNumberFilter] = useState<string>(''); // New state for order number filter
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [productSearchTerm, setProductSearchTerm] = useState<string>('');
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Update the useEffect to use the search API when orderNumberFilter is provided
  useEffect(() => {
    // Apply filters when orders, dateFilter, statusFilter, or orderNumberFilter changes
    let filtered = [...orders];

    // Apply date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        if (startDate && endDate) {
          return orderDate >= startDate && orderDate <= endDate;
        } else if (startDate) {
          return orderDate >= startDate;
        } else if (endDate) {
          return orderDate <= endDate;
        }
        return true;
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply order number filter (client-side filtering)
    if (orderNumberFilter) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(orderNumberFilter.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, dateFilter, statusFilter, orderNumberFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Check if token exists
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Please login to access admin panel');
        window.location.reload();
        return;
      }

      const [stats, usersData, productsData, ordersData, teamData, messagesData] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getAllUsers(),
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getAllTeamMembers(),
        adminAPI.getAllMessages(),
      ])

      setStatistics(stats)
      setUsers(usersData.users)
      setProducts(productsData.products)
      setOrders(ordersData.orders)
      setTeamMembers(teamData.teamMembers || [])
      setMessages(messagesData.messages || [])
    } catch (error: any) {
      console.error('Dashboard data loading error:', error);

      // If token is invalid, reload page to show login
      if (error.message?.includes('Session expired') || error.message?.includes('Token is not valid') || error.message?.includes('token')) {
        localStorage.removeItem('adminToken');
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshDashboardData = async () => {
    try {
      const [stats, usersData, productsData, ordersData, teamData] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getAllUsers(),
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getAllTeamMembers(),
      ])

      setStatistics(stats)
      setUsers(usersData.users)
      setProducts(productsData.products)
      setOrders(ordersData.orders)
      setTeamMembers(teamData.teamMembers || [])

      toast.success('Data refreshed successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to refresh dashboard data')
    }
  }

  const handleCreateProduct = async (productData: any) => {
    try {
      const newProduct = await adminAPI.createProduct(productData);
      setProducts([newProduct, ...products]);
      setShowAddProductForm(false);
      toast.success('Product created successfully');
      loadDashboardData(); // Refresh data
      // Notify that products have been updated
      toast.info('Product list updated. Frontend will refresh automatically.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      const updatedProduct = await adminAPI.updateProduct(productId, productData);
      setProducts(products.map(p => p._id === productId ? updatedProduct : p));
      setEditingProduct(null);
      toast.success('Product updated successfully');
      // Notify that products have been updated
      toast.info('Product list updated. Frontend will refresh automatically.');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleCreateAdminUser = async (userData: any) => {
    try {
      const newUser = await adminAPI.createAdminUser(userData);
      setUsers([newUser, ...users]);
      setShowAddAdminForm(false);
      setEditingAdmin(null);
      toast.success('Admin user created successfully');
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast.error(error.message || 'Failed to create admin user');
    }
  };

  const handleUpdateAdminUser = async (userId: string, userData: any) => {
    try {
      // Remove password field if it's empty (when editing)
      const dataToSend = { ...userData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const updatedUser = await adminAPI.updateUser(userId, dataToSend);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      setEditingAdmin(null);
      toast.success('Admin user updated successfully');
    } catch (error: any) {
      console.error('Error updating admin user:', error);
      toast.error(error.message || 'Failed to update admin user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await adminAPI.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await adminAPI.deleteProduct(productId)
      setProducts(products.filter(p => p._id !== productId))
      toast.success('Product deleted successfully')
      // Notify that products have been updated
      toast.info('Product list updated. Frontend will refresh automatically.');
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updated = await adminAPI.updateOrderStatus(orderId, status)
      setOrders(orders.map(o => o._id === orderId ? updated : o))
      toast.success('Order status updated successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      await adminAPI.deleteOrder(orderId)
      setOrders(orders.filter(o => o._id !== orderId))
      toast.success('Order deleted successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handlePrintInvoice = (order: any) => {
    setPrintingInvoice(order);
  };

  const handleCreateTeamMember = async (memberData: any) => {
    try {
      const newMember = await adminAPI.createTeamMember(memberData);
      setTeamMembers([newMember, ...teamMembers]);
      setShowTeamMemberForm(false);
      toast.success('Team member created successfully');
      loadDashboardData(); // Refresh data
    } catch (error: any) {
      console.error('Error creating team member:', error);
      toast.error(error.message || 'Failed to create team member');
    }
  };

  const handleUpdateTeamMember = async (memberId: string, memberData: any) => {
    try {
      const updatedMember = await adminAPI.updateTeamMember(memberId, memberData);
      setTeamMembers(teamMembers.map(m => m.id === memberId ? updatedMember : m));
      setEditingTeamMember(null);
      toast.success('Team member updated successfully');
    } catch (error: any) {
      console.error('Error updating team member:', error);
      toast.error(error.message || 'Failed to update team member');
    }
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      await adminAPI.deleteTeamMember(memberId)
      setTeamMembers(teamMembers.filter(m => m.id !== memberId))
      toast.success('Team member deleted successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  };

  const handleNotificationOrderClick = (orderId: string) => {
    // Switch to orders tab
    setActiveTab('orders');

    // Wait for tab to switch and then scroll to order
    setTimeout(() => {
      const orderElement = orderRefs.current[orderId];
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the order briefly
        orderElement.style.transition = 'box-shadow 0.3s ease';
        orderElement.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.5)';
        setTimeout(() => {
          orderElement.style.boxShadow = '';
        }, 2000);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="admin-header">
        <div className="px-4 py-4">
          <div className="d-flex navbg flex-md-row align-items-md-center justify-content-between gap-4">

            <div>
              <div className="d-flex align-items-center gap-4 admin-navbar">
                {/* Logo */}
                <div className="logo-admin-panel">
                  <div className="d-flex align-items-center gap-2 cursor-pointer">
                    <img
                      src="https://scontent.fdxb1-1.fna.fbcdn.net/v/t39.30808-1/597829220_25326756927005449_7484898340885741205_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=6nqeCIXObGgQ7kNvwHS90ED&_nc_oc=Admmt5t36eCZ5J0Gaf2wc025U5ssCU6VdUyfrY1oG8mmTiUu8_h_6Y4Qk-MfEq6z4rc&_nc_zt=24&_nc_ht=scontent.fdxb1-1.fna&_nc_gid=Ku2MYO-kGnSaDxhjtboIyQ&oh=00_Afl9d6JlAYKzS62EUwg446kCAhBaQu5t8Uh6xfxhADmzIw&oe=6949C6AC"
                      alt="Afiya Zone Logo"
                    />
                    <h1 className="h3 fw-bold mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Afiya Zone Admin Panel</h1>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">
                      {adminUser?.name || adminUser?.email || 'Admin'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ref-log-btn">
                <button
                  onClick={onLogout}
                  className="btn btn-outline-danger d-flex align-items-center gap-2 logout-admin-btn"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <button
                  onClick={refreshDashboardData}
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                  </svg>
                  <span>Refresh</span>
                </button>

              </div>
            </div>
            {/* <div><NotificationBell onNotificationClick={handleNotificationOrderClick} /></div> */}

            <div><NotificationBell onNotificationClick={handleNotificationOrderClick} /></div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-4">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-100">
          <Tabs.List className="tabs-list">
            <Tabs.Trigger
              value="overview"
              className="tab-trigger"
            >
              <LayoutDashboard size={16} />
              <span>Overview</span>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="team"
              className="tab-trigger"
            >
              <User size={16} />
              <span>Team</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="messages"
              className="tab-trigger"
            >
              <MessageCircle size={16} />
              <span>Messages</span>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="admins"
              className="tab-trigger"
            >
              <Users size={16} />
              <span>Admins</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="users"
              className="tab-trigger"
            >
              <Users size={16} />
              <span>Users</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="products"
              className="tab-trigger"
            >
              <Package size={16} />
              <span>Products</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="orders"
              className="tab-trigger"
            >
              <ShoppingCart size={16} />
              <span>Orders</span>
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview" className="tab-content">
            {/* Statistics Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-6 crad-statistic col-lg-3">
                <div className="stat-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-2">Total Users</p>
                        <h3 className="fw-bold mb-0">{statistics?.totalUsers || 0}</h3>
                      </div>
                      <div className="stat-icon primary">
                        <Users className="text-light" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 crad-statistic col-lg-3">
                <div className="stat-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-2">Total Products</p>
                        <h3 className="fw-bold mb-0">{statistics?.totalProducts || 0}</h3>
                      </div>
                      <div className="stat-icon info">
                        <Package className="text-light" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 crad-statistic col-lg-3">
                <div className="stat-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-2">Total Orders</p>
                        <h3 className="fw-bold mb-0">{statistics?.totalOrders || 0}</h3>
                      </div>
                      <div className="stat-icon success">
                        <ShoppingCart className="text-light" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 crad-statistic col-lg-3">
                <div className="stat-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-2">Total Revenue</p>
                        <h3 className="fw-bold mb-0">AED {statistics?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                      </div>
                      <div className="stat-icon warning">
                        <DollarSign className="text-light" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="card">
              <div className="card-body">
                <h3 className="card-title mb-4">Orders by Status</h3>
                <div className="row g-3">
                  <div className="col-md-3 col-6">
                    <div className="card border-0 bg-light-subtle">
                      <div className="card-body2 text-center">
                        <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mx-auto mb-3 p-2" style={{ width: '48px', height: '48px' }}>
                          <AlertCircle className="text-muted" size={24} />
                        </div>
                        <p className="text-muted small mb-1">Pending</p>
                        <p className="h5 fw-bold mb-0">{statistics?.ordersByStatus?.pending || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="card border-0 bg-light-subtle">
                      <div className="card-body2 text-center">
                        <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mx-auto mb-3 p-2" style={{ width: '48px', height: '48px' }}>
                          <TrendingUp className="text-warning" size={24} />
                        </div>
                        <p className="text-muted small mb-1">Processing</p>
                        <p className="h5 fw-bold mb-0">{statistics?.ordersByStatus?.processing || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="card border-0 bg-light-subtle">
                      <div className="card-body2 text-center">
                        <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mx-auto mb-3 p-2" style={{ width: '48px', height: '48px' }}>
                          <Package className="text-info" size={24} />
                        </div>
                        <p className="text-muted small mb-1">Shipped</p>
                        <p className="h5 fw-bold mb-0">{statistics?.ordersByStatus?.shipped || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="card border-0 bg-light-subtle">
                      <div className="card-body2 text-center">
                        <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mx-auto mb-3 p-2" style={{ width: '48px', height: '48px' }}>
                          <CheckCircle className="text-success" size={24} />
                        </div>
                        <p className="text-muted small mb-1">Delivered</p>
                        <p className="h5 fw-bold mb-0">{statistics?.ordersByStatus?.delivered || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Messages Tab */}
          <Tabs.Content value="messages" className="tab-content">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <h3 className="card-title mb-0">Contact Messages</h3>
                  <span className="badge bg-primary">{messages.length} messages</span>
                </div>

                {messages.length === 0 ? (
                  <p className="text-muted mb-0">No messages yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Subject</th>
                          <th>Message</th>
                          <th>Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr key={msg.id}>
                            <td className="fw-semibold">{msg.name}</td>
                            <td>{msg.email}</td>
                            <td>{msg.phone || '-'}</td>
                            <td>{msg.subject || '-'}</td>
                            <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                              {msg.message}
                            </td>
                            <td className="text-muted small">
                              {new Date(msg.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>

          {/* Admins Tab */}
          <Tabs.Content value="admins" className="tab-content">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <h3 className="card-title mb-0">Admin Management</h3>
                  <button
                    onClick={() => setShowAddAdminForm(true)}
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add New Admin</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => user.role === 'admin')
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user) => (
                          <tr key={user.id} className="table-success fw-semibold">
                            <td>
                              {user.firstName}
                              <span className="ms-2">👑</span>
                            </td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                              <span className="badge bg-success">
                                👑 Admin
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  onClick={() => setEditingAdmin(user)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit admin"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete admin"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {users.filter(user => user.role === 'admin').length === 0 && (
                    <div className="text-center py-8 text-muted">
                      <Users size={48} className="mb-3" />
                      <p>No admin users found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Users Tab */}
          <Tabs.Content value="users" className="tab-content">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <h3 className="card-title mb-0">Regular Users Management</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => user.role !== 'admin')
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user) => (
                          <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                              <span className={`badge bg-info`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {users.filter(user => user.role !== 'admin').length === 0 && (
                    <div className="text-center py-8 text-muted">
                      <Users size={48} className="mb-3" />
                      <p>No regular users found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Products Tab */}
          <Tabs.Content value="products" className="tab-content">
            <div className="card ">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <h3 className="card-title mb-0">Product Management</h3>
                  <button
                    onClick={() => setShowAddProductForm(true)}
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      className="admin-products-search"
                      placeholder="Search products by name..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                    <button
                      className="admin-products-clear"
                      type="button"
                      onClick={() => setProductSearchTerm('')}
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(product =>
                          product.name?.en?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                          product.name?.ar?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                          !productSearchTerm
                        )
                        .map((product) => (
                          <tr key={product._id}>
                            <td>{product.name?.en || 'N/A'}</td>
                            <td className="text-capitalize">{product.category}</td>
                            <td>AED {product.price?.toFixed(2)}</td>
                            <td>{product.stock || 0}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit product"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className=" btn btn-sm btn-outline-danger"
                                  title="Delete product" style={{ marginBottom: '0' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Orders Tab */}
          <Tabs.Content value="orders" className="tab-content">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title mb-4">Order Management</h3>

                {/* Filter Controls */}
                <div className="Order-management-filter mb-4">

                  <div className="d-flex flex-column align-items-center">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control h-33"
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control h-33"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select h-33"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <label className="form-label">Order Number</label>
                    <input
                      type="text"
                      className="form-control h-33"
                      placeholder="Search"
                      value={orderNumberFilter}
                      onChange={(e) => setOrderNumberFilter(e.target.value)}
                    />
                    {orderNumberFilter && (
                      <small className="form-text text-muted">
                        Filtering by order number: "{orderNumberFilter}"
                      </small>
                    )}
                  </div>
                  <div>
                    <button
                      className="admin-products-clear"
                      onClick={() => {
                        setDateFilter({ startDate: '', endDate: '' });
                        setStatusFilter('all');
                        setOrderNumberFilter(''); // Clear order number filter
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>

                </div>

                <div className="row g-4">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="col-12">
                      <div
                        ref={(el) => {
                          if (el) {
                            orderRefs.current[order._id] = el;
                          }
                        }}
                        className="card border order-view"
                      >
                        <div className="card-body ">
                          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                            <div>
                              <h4 className="card-title mb-1">Order #{order.orderNumber}</h4>
                              <p className="text-muted small mb-1">
                                Customer: {order.user?.firstName} {order.user?.lastName}
                              </p>
                              <p className="text-muted small mb-0">
                                {new Date(order.createdAt).toLocaleString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true })}
                              </p>
                              {/* Display admin information */}
                              {order.createdBy && (
                                <p className="created-by text-muted small mb-0">
                                  Created by: {order.createdBy.firstName} {order.createdBy.lastName}
                                </p>
                              )}
                              {order.updatedBy && (
                                <p className="last-updated-by text-muted small mb-0">
                                  Last updated by: {order.updatedBy.firstName} {order.updatedBy.lastName}
                                </p>
                              )}
                              {!order.createdBy && !order.updatedBy && (
                                <p className="text-muted small mb-0">
                                  No admin info available
                                </p>
                              )}
                            </div>
                            <div className="text-md-end">
                              <p className="h4 fw-bold mb-2">AED {order.total.toFixed(2)}</p>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className="form-control"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-light-subtle rounded p-3 mb-4">
                            <h5 className="small fw-medium mb-3">Items</h5>
                            <div className="row g-2">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="col-12">
                                  <div className="d-flex justify-content-between small">
                                    <span>{item.name?.en || 'Product'} × {item.quantity}</span>
                                    <span className="fw-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="d-flex flex-wrap gap-2">
                            <button
                              onClick={() => setPreviewingInvoice(order)}
                              className="btn btn-outline-secondary d-flex align-items-center gap-1"
                            >
                              <Eye size={16} />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(order)}
                              className="btn btn-primary d-flex align-items-center gap-1"
                            >
                              <Download size={16} />
                              <span>Print</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="btn btn-danger d-flex align-items-center gap-1"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Team Tab */}
          <Tabs.Content value="team" className="tab-content">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <h3 className="card-title mb-0">Team Management</h3>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => setShowTeamMemberForm(true)}
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Add Team Member</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id}>
                          <td>
                            <img
                              src={member.image}
                              alt={member.name?.en || 'Team member'}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{member.name?.en || ''}</div>
                              <small className="text-muted">{member.name?.ar || ''}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{member.position?.en || ''}</div>
                              <small className="text-muted">{member.position?.ar || ''}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${member.department === 'management' ? 'primary' : member.department === 'medical' ? 'success' : member.department === 'support' ? 'info' : member.department === 'marketing' ? 'warning' : 'secondary'}`}>
                              {member.department}
                            </span>
                          </td>
                          <td>{member.email || '-'}</td>
                          <td>
                            <span className={`badge ${member.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{member.order}</td>
                          <td>
                            <div className="btn-group">
                              <button
                                onClick={() => setEditingTeamMember(member)}
                                className="btn btn-sm btn-outline-primary"
                                title="Edit team member"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTeamMember(member.id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete team member"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {teamMembers.length === 0 && (
                    <div className="text-center py-8">
                      <User className="text-muted mx-auto mb-3" size={48} />
                      <p className="text-muted">No team members found</p>
                      <button
                        onClick={() => setShowTeamMemberForm(true)}
                        className="btn btn-primary"
                      >
                        Add First Team Member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Add Product Form */}
      {showAddProductForm && (
        <AddProductForm
          key="add-product"
          onSubmit={handleCreateProduct}
          onCancel={() => setShowAddProductForm(false)}
        />
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <AddProductForm
          key={`edit-product-${editingProduct._id}`}
          initialData={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct._id, data)}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Add/Edit Admin Form */}
      {(showAddAdminForm || editingAdmin) && (
        <AddAdminForm
          initialData={editingAdmin || null}
          onSubmit={editingAdmin ? (data) => handleUpdateAdminUser(editingAdmin.id, data) : handleCreateAdminUser}
          onCancel={() => {
            setShowAddAdminForm(false);
            setEditingAdmin(null);
          }}
        />
      )}

      {/* Invoice Preview */}
      {previewingInvoice && (
        <InvoicePreview
          order={previewingInvoice}
          onClose={() => setPreviewingInvoice(null)}
          onDownload={() => {
            handlePrintInvoice(previewingInvoice);
            setPreviewingInvoice(null);
          }}
        />
      )}

      {/* Printable Invoice */}
      {printingInvoice && (
        <PrintableInvoice
          order={printingInvoice}
          onClose={() => setPrintingInvoice(null)}
        />
      )}

      {/* Team Member Forms */}
      {showTeamMemberForm && (
        <TeamMemberForm
          key="add-team-member"
          onSubmit={handleCreateTeamMember}
          onCancel={() => setShowTeamMemberForm(false)}
        />
      )}

      {editingTeamMember && (
        <TeamMemberForm
          key={`edit-team-member-${editingTeamMember.id}`}
          initialData={editingTeamMember}
          onSubmit={(data) => handleUpdateTeamMember(editingTeamMember.id, data)}
          onCancel={() => setEditingTeamMember(null)}
        />
      )}
    </div>
  )
}