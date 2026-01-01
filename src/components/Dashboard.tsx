import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { adminAPI } from "../api"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Trash2,
  Download,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LogOut,
  Plus,
  Edit,
  Eye,
  User,
  MessageCircle,
  Search,
  RefreshCw,
  Printer,
} from "lucide-react"
import { AddProductForm, AddAdminForm } from "./ProductForms"
import { TeamMemberForm } from "./TeamMemberForm"
import { InvoicePreview } from "./InvoicePreview"
import { PrintableInvoice } from "./PrintableInvoice"
import { NotificationBell } from "./NotificationBell"

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
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
    startDate: "",
    endDate: "",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orderNumberFilter, setOrderNumberFilter] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [productSearchTerm, setProductSearchTerm] = useState<string>("")
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    let filtered = [...orders]

    if (dateFilter.startDate || dateFilter.endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt)
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null

        if (startDate && endDate) {
          return orderDate >= startDate && orderDate <= endDate
        } else if (startDate) {
          return orderDate >= startDate
        } else if (endDate) {
          return orderDate <= endDate
        }
        return true
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (orderNumberFilter) {
      filtered = filtered.filter((order) => order.orderNumber.toLowerCase().includes(orderNumberFilter.toLowerCase()))
    }

    setFilteredOrders(filtered)
  }, [orders, dateFilter, statusFilter, orderNumberFilter])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("adminToken")
      if (!token) {
        toast.error("Please login to access admin panel")
        window.location.reload()
        return
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
      console.error("Dashboard data loading error:", error)

      if (
        error.message?.includes("Session expired") ||
        error.message?.includes("Token is not valid") ||
        error.message?.includes("token")
      ) {
        localStorage.removeItem("adminToken")
        toast.error("Session expired. Please login again.")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(error.message || "Failed to load dashboard data")
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshDashboardData = async () => {
    setRefreshing(true);
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

      toast.success("Data refreshed successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh dashboard data")
    } finally {
      setRefreshing(false);
    }
  }

  const handleCreateProduct = async (productData: any) => {
    try {
      const newProduct = await adminAPI.createProduct(productData)
      setProducts([newProduct, ...products])
      setShowAddProductForm(false)
      toast.success("Product created successfully")
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.message || "Failed to create product")
    }
  }

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      const updatedProduct = await adminAPI.updateProduct(productId, productData)
      setProducts(products.map((p) => (p._id === productId ? updatedProduct : p)))
      setEditingProduct(null)
      toast.success("Product updated successfully")
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast.error(error.message || "Failed to update product")
    }
  }

  const handleCreateAdminUser = async (userData: any) => {
    try {
      const newUser = await adminAPI.createAdminUser(userData)
      setUsers([newUser, ...users])
      setShowAddAdminForm(false)
      setEditingAdmin(null)
      toast.success("Admin user created successfully")
    } catch (error: any) {
      console.error("Error creating admin user:", error)
      toast.error(error.message || "Failed to create admin user")
    }
  }

  const handleUpdateAdminUser = async (userId: string, userData: any) => {
    try {
      const dataToSend = { ...userData }
      if (!dataToSend.password) {
        delete dataToSend.password
      }

      const updatedUser = await adminAPI.updateUser(userId, dataToSend)
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      setEditingAdmin(null)
      toast.success("Admin user updated successfully")
    } catch (error: any) {
      console.error("Error updating admin user:", error)
      toast.error(error.message || "Failed to update admin user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await adminAPI.deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
      toast.success("User deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await adminAPI.deleteProduct(productId)
      setProducts(products.filter((p) => p._id !== productId))
      toast.success("Product deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updated = await adminAPI.updateOrderStatus(orderId, status)
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)))
      toast.success("Order status updated successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      await adminAPI.deleteOrder(orderId)
      setOrders(orders.filter((o) => o._id !== orderId))
      toast.success("Order deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handlePrintInvoice = (order: any) => {
    setPrintingInvoice(order)
  }

  const handleCreateTeamMember = async (memberData: any) => {
    try {
      const newMember = await adminAPI.createTeamMember(memberData)
      setTeamMembers([newMember, ...teamMembers])
      setShowTeamMemberForm(false)
      toast.success("Team member created successfully")
      loadDashboardData()
    } catch (error: any) {
      console.error("Error creating team member:", error)
      toast.error(error.message || "Failed to create team member")
    }
  }

  const handleUpdateTeamMember = async (memberId: string, memberData: any) => {
    try {
      const updatedMember = await adminAPI.updateTeamMember(memberId, memberData)
      setTeamMembers(teamMembers.map((m) => (m.id === memberId ? updatedMember : m)))
      setEditingTeamMember(null)
      toast.success("Team member updated successfully")
    } catch (error: any) {
      console.error("Error updating team member:", error)
      toast.error(error.message || "Failed to update team member")
    }
  }

  const handleDeleteTeamMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      await adminAPI.deleteTeamMember(memberId)
      setTeamMembers(teamMembers.filter((m) => m.id !== memberId))
      toast.success("Team member deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleNotificationOrderClick = (orderId: string) => {
    setActiveTab("orders")

    setTimeout(() => {
      const orderElement = orderRefs.current[orderId]
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: "smooth", block: "center" })
        orderElement.style.transition = "box-shadow 0.3s ease"
        orderElement.style.boxShadow = "0 0 0 3px rgba(0, 158, 247, 0.5)"
        setTimeout(() => {
          orderElement.style.boxShadow = ""
        }, 2000)
      }
    }, 100)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "badge-warning",
      processing: "badge-info",
      shipped: "badge-primary",
      delivered: "badge-success",
      cancelled: "badge-danger",
    }
    return statusMap[status] || "badge-info"
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "team", label: "Team", icon: User },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "admins", label: "Admins", icon: Users },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ]

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Admin Panel...</p>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src="https://i.imgur.com/HDmpMTk.jpg"
            alt="Logo"
          />
          <h4 className="sidebar-title">Afiya Zone Admin-Panel</h4>
        </div>

        <div className="sidebar-section">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{adminUser?.name || adminUser?.email || "Admin"}</div>
              <div className="sidebar-user-role">
                <h4 >Administrator</h4>
                <button onClick={onLogout} className="logout-btn">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="search-wrapper">
            {/* <Search size={18} className="search-icon" />
            <input type="text" className="search-input" placeholder="Search..." /> */}
          </div>

          <div className="header-actions">
            <NotificationBell onNotificationClick={handleNotificationOrderClick} />

            <button
              onClick={refreshDashboardData}
              className={`header-btn ${refreshing ? 'refreshing' : ''}`}
              title="Refresh"
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'rotating' : ''} />
            </button>


          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stat Cards */}
              <div className="stat-cards">
                <div className="stat-card red">
                  <div className="stat-card-value">{statistics?.totalUsers || 0}</div>
                  <div className="stat-card-label">Total Users</div>
                  <div className="stat-card-icon">
                    <Users />
                  </div>
                </div>

                <div className="stat-card yellow">
                  <div className="stat-card-value">{statistics?.totalProducts || 0}</div>
                  <div className="stat-card-label">Total Products</div>
                  <div className="stat-card-icon">
                    <Package />
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-card-value">{statistics?.totalOrders || 0}</div>
                  <div className="stat-card-label">Total Orders</div>
                  <div className="stat-card-icon">
                    <ShoppingCart />
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-card-value">AED {statistics?.totalRevenue?.toFixed(2) || "0.00"}</div>
                  <div className="stat-card-label">Total Revenue</div>
                  <div className="stat-card-icon">
                    <DollarSign />
                  </div>
                </div>
              </div>

              {/* Orders by Status */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Orders by Status</h3>
                </div>
                <div className="card-body">
                  <div className="status-cards">
                    <div className="status-card">
                      <div className="status-card-icon">
                        <AlertCircle size={24} />
                      </div>
                      <div className="status-card-label">Pending</div>
                      <div className="status-card-value">{statistics?.ordersByStatus?.pending || 0}</div>
                    </div>

                    <div className="status-card">
                      <div className="status-card-icon">
                        <TrendingUp size={24} />
                      </div>
                      <div className="status-card-label">Processing</div>
                      <div className="status-card-value">{statistics?.ordersByStatus?.processing || 0}</div>
                    </div>

                    <div className="status-card">
                      <div className="status-card-icon">
                        <Package size={24} />
                      </div>
                      <div className="status-card-label">Shipped</div>
                      <div className="status-card-value">{statistics?.ordersByStatus?.shipped || 0}</div>
                    </div>

                    <div className="status-card">
                      <div className="status-card-icon">
                        <CheckCircle size={24} />
                      </div>
                      <div className="status-card-label">Delivered</div>
                      <div className="status-card-value">{statistics?.ordersByStatus?.delivered || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Contact Messages</h3>
                <span className="badge badge-primary">{messages.length} messages</span>
              </div>
              <div className="card-body">
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <MessageCircle />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
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
                            <td style={{ fontWeight: 500 }}>{msg.name}</td>
                            <td>{msg.email}</td>
                            <td>{msg.phone || "-"}</td>
                            <td>{msg.subject || "-"}</td>
                            <td style={{ maxWidth: "300px" }}>{msg.message}</td>
                            <td className="text-muted text-sm">{new Date(msg.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Admin Management</h3>
                  <button onClick={() => setShowAddAdminForm(true)} className="btn btn-primary">
                    <Plus size={16} />
                    <span>Add New Admin</span>
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-container">
                    <table className="data-table">
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
                          .filter((user) => user.role === "admin")
                          .sort((a, b) => a.firstName.localeCompare(b.firstName))
                          .map((user) => (
                            <tr key={user.id}>
                              <td style={{ fontWeight: 500 }}>{user.firstName}</td>
                              <td>{user.lastName}</td>
                              <td>{user.email}</td>
                              <td>{user.phone}</td>
                              <td>
                                <span className="badge badge-success">Admin</span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button onClick={() => setEditingAdmin(user)} className="btn-icon badge-edit" title="Edit">
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="btn-icon badge-danger"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {users.filter((user) => user.role === "admin").length === 0 && (
                      <div className="empty-state">
                        <Users />
                        <p>No admin users found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Regular Users Management</h3>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="data-table">
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
                        .filter((user) => user.role !== "admin")
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user) => (
                          <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                              <span className="badge badge-info">{user.role}</span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn-icon badge-danger"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {users.filter((user) => user.role !== "admin").length === 0 && (
                    <div className="empty-state">
                      <Users />
                      <p>No regular users found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Product Management</h3>
                <button onClick={() => setShowAddProductForm(true)} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>
              <div className="card-body">
                <div className="filter-bar">
                  <div className="filter-group" style={{ flex: 1 }}>
                    <label>Search Products</label>
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                  </div>
                  {productSearchTerm && (
                    <button className="filter-clear" onClick={() => setProductSearchTerm("")}>
                      Clear
                    </button>
                  )}
                </div>

                <div className="table-container">
                  <table className="data-table">
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
                        .filter(
                          (product) =>
                            product.name?.en?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                            product.name?.ar?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                            !productSearchTerm,
                        )
                        .map((product) => (
                          <tr key={product._id}>
                            <td style={{ fontWeight: 500 }}>{product.name?.en || "N/A"}</td>
                            <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                            <td>AED {product.price?.toFixed(2)}</td>
                            <td>{product.stock || 0}</td>
                            <td>
                              <div className="action-buttons">
                                <button onClick={() => setEditingProduct(product)} className="btn-icon badge-edit" title="Edit">
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="btn-icon badge-danger"
                                  title="Delete"
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
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Order Management</h3>
              </div>
              <div className="card-body">
                <div className="filter-bar">
                  <div className="filter-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />
                  </div>
                  <div className="filter-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} title="Filter orders by status">
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Order Number</label>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={orderNumberFilter}
                      onChange={(e) => setOrderNumberFilter(e.target.value)}
                    />
                  </div>
                  <button
                    className="filter-clear"
                    onClick={() => {
                      setDateFilter({ startDate: "", endDate: "" })
                      setStatusFilter("all")
                      setOrderNumberFilter("")
                    }}
                  >
                    Clear Filters
                  </button>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingCart />
                    <p>No orders found</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      ref={(el) => {
                        if (el) orderRefs.current[order._id] = el
                      }}
                      className="order-card"
                    >
                      <div className="order-card-header">
                        <div>
                          <div className="order-number">Order #{order.orderNumber}</div>
                          <div className="order-date">{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                        <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                      </div>

                      <div className="order-card-body">
                        <div className="order-info-grid">
                          <div className="order-info-item">
                            <label>Customer</label>
                            <span>
                              {order.user?.firstName} {order.user?.lastName}
                            </span>
                          </div>
                          <div className="order-info-item">
                            <label>Email</label>
                            <span>{order.user?.email}</span>
                          </div>
                          <div className="order-info-item">
                            <label>Phone</label>
                            <span>{order.shippingAddress?.phone}</span>
                          </div>
                          <div className="order-info-item">
                            <label>Address</label>
                            <span>
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}
                            </span>
                          </div>
                          <div className="order-info-item">
                            <label>Payment Method</label>
                            <span style={{ textTransform: "capitalize" }}>{order.paymentMethod}</span>
                          </div>
                          <div className="order-info-item">
                            <label>Total Amount</label>
                            <span style={{ fontWeight: 700, color: "var(--success)" }}>
                              AED {order.totalAmount?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="order-card-footer">
                        <div className="flex items-center gap-3">
                          <label style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Update Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="form-select"
                            style={{ width: "auto" }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="order-actions">
                          <button onClick={() => setPreviewingInvoice(order)} className="btn btn-primary btn-sm">
                            <Eye size={18} />
                            {/* <span>Preview</span> */}
                          </button>
                          <button onClick={() => handlePrintInvoice(order)} className="btn btn-primary btn-sm">
                            <Printer size={18} />
                            {/* <span>Print</span> */}
                          </button>
                          <button onClick={() => handleDeleteOrder(order._id)} className="btn badge-danger  btn-sm">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Team Members</h3>
                <button onClick={() => setShowTeamMemberForm(true)} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add Team Member</span>
                </button>
              </div>
              <div className="card-body">
                {teamMembers.length === 0 ? (
                  <div className="empty-state">
                    <User size={48} />
                    <p>No team members yet</p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {teamMembers.map((member) => (
                      <div key={member.id} className="team-card">
                        <img
                          src={member.image || "/placeholder.svg?height=80&width=80"}
                          alt={member.name}
                          className="team-avatar"
                        />
                        <div className="team-name">{member.name?.en || member.name}</div>
                        <div className="team-role">{member.position?.en || member.role || member.position}</div>
                        <div className="team-actions">
                          <button onClick={() => setEditingTeamMember(member)} className="btn-icon badge-edit" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="btn-icon badge-danger"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddProductForm && (
        <AddProductForm onSubmit={handleCreateProduct} onCancel={() => setShowAddProductForm(false)} />
      )}

      {editingProduct && (
        <AddProductForm
          product={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct._id, data)}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {showAddAdminForm && (
        <AddAdminForm onSubmit={handleCreateAdminUser} onCancel={() => setShowAddAdminForm(false)} />
      )}

      {editingAdmin && (
        <AddAdminForm
          admin={editingAdmin}
          onSubmit={(data) => handleUpdateAdminUser(editingAdmin.id, data)}
          onCancel={() => setEditingAdmin(null)}
        />
      )}

      {showTeamMemberForm && (
        <TeamMemberForm onSubmit={handleCreateTeamMember} onCancel={() => setShowTeamMemberForm(false)} />
      )}

      {editingTeamMember && (
        <TeamMemberForm
          member={editingTeamMember}
          onSubmit={(data) => handleUpdateTeamMember(editingTeamMember.id, data)}
          onCancel={() => setEditingTeamMember(null)}
        />
      )}

      {previewingInvoice && <InvoicePreview order={previewingInvoice} onClose={() => setPreviewingInvoice(null)} />}

      {printingInvoice && <PrintableInvoice order={printingInvoice} onClose={() => setPrintingInvoice(null)} />}
    </div>
  )
}

