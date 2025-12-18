import { useState, useEffect, useRef } from 'react';
import { Bell, Package } from 'lucide-react';
import { notificationsAPI } from '../api';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  status?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  onNotificationClick?: (orderId: string) => void;
}

export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0 && notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!latestNotification.isRead) {
        // Play notification sound
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(e => console.log('Sound play failed:', e));
        } catch (e) {
          console.log('Sound play failed:', e);
        }
      }
    }
  }, [unreadCount, notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsData, countData] = await Promise.all([
        notificationsAPI.getAll(),
        notificationsAPI.getUnreadCount(),
      ]);

      setNotifications(notificationsData.notifications || []);
      setUnreadCount(countData.count || 0);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationsAPI.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to order
    if (notification.orderId && onNotificationClick) {
      onNotificationClick(notification.orderId);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="position-relative notes" ref={dropdownRef}>
      <button
        className="d-flex align-items-center gap-2 position-relative"
        onClick={() => setOpen(!open)}
        type="button"
        style={{
          borderRadius: '50px',
          padding: '8px 12px',
          border: 'none',
          color: 'green',
          transition: 'all 0.3s ease',
          position: 'relative',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2b0000';
          e.currentTarget.style.color = 'white';
          // e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          // e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.color = 'green';
        }}
      >
        <Bell size={20} className={loading ? 'animate__animated animate__pulse' : ''} />
        {loading && (
          <span className="position-relative p-1 bg-primary border border-light rounded-circle">
          </span>
        )}
        {unreadCount > 0 && (
          <span
            className="badge rounded-pill d-flex align-items-center justify-content-center"
            style={{
              position: 'absolute',
              top: '-12px',
              right: '0px',
              background: '#28a745',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              padding: '4px',
              minWidth: '22px',
              height: '22px',
              boxShadow: '0 2px 4px rgba(127, 125, 125, 0.83)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="position-absolute start-0 top-100 mt-2 bg-white border notification-dropdown shadow-lg"
          style={{
            width: '380px',
            maxHeight: '550px',
            zIndex: 1051,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            marginTop: '8px',
            right: '0',
            top: '100%'
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between p-3 border-bottom bg-primary text-white"
            style={{
              background: '#009063',
              minHeight: '50px'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Bell size={18} color="white" />
              <h6 className="mb-0 " style={{ fontSize: '0.95rem', color: 'white' }}>Notifications</h6>
              {unreadCount > 0 && (
                <span className="badge bg-light text-primary rounded-pill" style={{ fontSize: '0.7rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="form-select form-select-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="orders">Orders</option>
              </select>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-light text-primary"
                  onClick={handleMarkAllRead}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    padding: '2px 8px',
                    border: 'none'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {loading ? (
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div className="spinner-border text-primary mb-2" role="status" style={{ width: '2rem', height: '2rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted small mb-0 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
                <Bell size={40} className="mb-2 opacity-25" />
                <p className="mb-0 color-white" style={{ fontSize: '0.9rem' }}>No notifications</p>
                <p className="small mb-0 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="list-group list-group-flush border rounded-lg shadow-sm">
                {notifications
                  .filter(notification => {
                    if (filter === 'unread') return !notification.isRead;
                    if (filter === 'orders') return notification.type.includes('order');
                    return true;
                  })
                  .map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action p-0 ${!notification.isRead ? 'bg-green-50' : 'bg-white'
                        }`}
                      onClick={() => handleNotificationClick(notification)}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderLeft: !notification.isRead ? '4px solid #28a745' : '4px solid transparent',
                        borderBottom: index < notifications.length - 1 ? '1px solid #e9ecef' : 'none',
                        position: 'relative',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = !notification.isRead ? '#f8fff9' : '#f8f9fa';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="p-3" style={{ padding: '1rem' }}>
                        <div className="d-flex align-items-start gap-3">
                          {/* Content */}
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <p
                                  className={`mb-0 ${!notification.isRead ? 'fw-bold text-green-800' : 'text-secondary'}`}
                                  style={{ fontSize: '0.9rem', lineHeight: '1.4' }}
                                >
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span className="badge bg-success rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                    New
                                  </span>
                                )}
                              </div>
                              {!notification.isRead && (
                                <span
                                  className="badge bg-success rounded-circle flex-shrink-0"
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    padding: '0',
                                    minWidth: '10px'
                                  }}
                                  title="New notification"
                                ></span>
                              )}
                            </div>
                            <p
                              className="text-muted mb-2"
                              style={{
                                fontSize: '0.85rem',
                                lineHeight: '1.6',
                                marginBottom: '0.75rem'
                              }}
                            >
                              {notification.message}
                            </p>
                            {notification.orderNumber && (
                              <div className="mb-2">
                                <span
                                  className="badge bg-success text-white"
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    padding: '5px 12px',
                                    borderRadius: '6px'
                                  }}
                                >
                                  <Package size={12} className="me-1" />
                                  Order #{notification.orderNumber}
                                </span>
                              </div>
                            )}
                            <p
                              className="text-muted mb-0"
                              style={{
                                fontSize: '0.75rem',
                                marginTop: '4px'
                              }}
                            >
                              {new Date(notification.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

