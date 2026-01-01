import { useState, useEffect, useRef } from "react"
import { Bell, Package } from "lucide-react"
import { notificationsAPI } from "../api"
import { toast } from "sonner"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  orderId?: string
  orderNumber?: string
  status?: string
  isRead: boolean
  createdAt: string
}

interface NotificationBellProps {
  onNotificationClick?: (orderId: string) => void
}

export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "orders">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(() => {
      loadNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    if (unreadCount > 0 && notifications.length > 0) {
      const latestNotification = notifications[0]
      if (!latestNotification.isRead) {
        try {
          const audio = new Audio("music/notes.wav")
          audio.play().catch((e) => console.log("Sound play failed:", e))
        } catch (e) {
          console.log("Sound play failed:", e)
        }
      }
    }
  }, [unreadCount, notifications])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const [notificationsData, countData] = await Promise.all([
        notificationsAPI.getAll(),
        notificationsAPI.getUnreadCount(),
      ])

      setNotifications(notificationsData.notifications || [])
      setUnreadCount(countData.count || 0)
    } catch (error: any) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationsAPI.markAsRead(notification.id)
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error("Failed to mark notification as read:", error)
      }
    }

    if (notification.orderId && onNotificationClick) {
      onNotificationClick(notification.orderId)
      setOpen(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="header-btn" style={{ position: "relative" }}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} new</span>}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  fontSize: "12px",
                  background: "var(--content-bg)",
                }}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="orders">Orders</option>
              </select>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "11px",
                    background: "var(--info)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <div className="loading-spinner" style={{ width: "30px", height: "30px", margin: "0 auto 10px" }}></div>
                <p style={{ fontSize: "13px" }}>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <Bell size={32} style={{ marginBottom: "10px", opacity: 0.3 }} />
                <p style={{ fontSize: "13px" }}>No notifications</p>
              </div>
            ) : (
              notifications
                .filter((notification) => {
                  if (filter === "unread") return !notification.isRead
                  if (filter === "orders") return notification.type.includes("order")
                  return true
                })
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="notification-item"
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      borderLeft: !notification.isRead ? "3px solid var(--success)" : "3px solid transparent",
                      background: !notification.isRead ? "rgba(80, 205, 137, 0.05)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: notification.isRead ? 400 : 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--success)",
                          }}
                        ></span>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      {notification.message}
                    </p>
                    {notification.orderNumber && (
                      <span className="badge badge-success" style={{ marginBottom: "6px" }}>
                        <Package size={10} style={{ marginRight: "4px" }} />
                        Order #{notification.orderNumber}
                      </span>
                    )}
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
