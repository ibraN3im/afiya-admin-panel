import { useEffect } from "react"
import { X } from "lucide-react"

interface PrintableInvoiceProps {
  order: any
  onClose: () => void
}

export function PrintableInvoice({ order, onClose }: PrintableInvoiceProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateItemTotal = (item: any) => {
    return (item.price * item.quantity).toFixed(2)
  }

  const subtotal = order.items.reduce((sum: number, item: any) => {
    return sum + item.price * item.quantity
  }, 0)

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrint()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="printable-invoice">
      <div
        className="print-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px 20px",
          background: "var(--card-bg)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <button type="button" className="btn btn-light" onClick={onClose}>
          <X size={16} />
          <span>Close</span>
        </button>
        <button type="button" className="btn btn-primary" onClick={handlePrint}>
          Print Invoice
        </button>
      </div>

      <div
        className="invoice-content"
        style={{
          background: "var(--card-bg)",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Invoice Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src="https://scontent.fdxb1-1.fna.fbcdn.net/v/t39.30808-1/597829220_25326756927005449_7484898340885741205_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=6nqeCIXObGgQ7kNvwHS90ED&_nc_oc=Admmt5t36eCZ5J0Gaf2wc025U5ssCU6VdUyfrY1oG8mmTiUu8_h_6Y4Qk-MfEq6z4rc&_nc_zt=24&_nc_ht=scontent.fdxb1-1.fna&_nc_gid=Ku2MYO-kGnSaDxhjtboIyQ&oh=00_Afl9d6JlAYKzS62EUwg446kCAhBaQu5t8Uh6xfxhADmzIw&oe=6949C6AC"
            alt="Afiya Zone Logo"
            style={{ width: "80px", height: "80px", borderRadius: "12px", marginBottom: "15px" }}
          />
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "5px", color: "var(--text-primary)" }}>
            AFIYA ZONE
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Natural Health & Wellness</p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "20px 0" }} />

        {/* Order Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Order Details</h3>
            <p style={{ fontSize: "13px", marginBottom: "4px" }}>
              <strong>Order #:</strong> {order.orderNumber}
            </p>
            <p style={{ fontSize: "13px", marginBottom: "4px" }}>
              <strong>Date:</strong> {formatDate(order.createdAt)}
            </p>
            <p style={{ fontSize: "13px", marginBottom: "0" }}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: "var(--success)",
                  color: "#fff",
                  fontSize: "11px",
                  textTransform: "uppercase",
                }}
              >
                {order.status}
              </span>
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Customer</h3>
            <p style={{ fontSize: "13px", marginBottom: "4px" }}>
              {order.user?.firstName} {order.user?.lastName}
            </p>
            <p style={{ fontSize: "13px", marginBottom: "0" }}>{order.user?.email}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Shipping Address</h3>
          <div
            style={{
              background: "var(--content-bg)",
              padding: "15px",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <p style={{ marginBottom: "4px" }}>
              {order.shippingAddress?.fullName || `${order.user?.firstName} ${order.user?.lastName}`}
            </p>
            <p style={{ marginBottom: "4px" }}>{order.shippingAddress?.street || order.shippingAddress?.address}</p>
            <p style={{ marginBottom: "4px" }}>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </p>
            <p style={{ marginBottom: "0" }}>Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Order Items</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{item.product?.name?.en || item.name?.en || "Product"}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>AED {item.price.toFixed(2)}</td>
                  <td style={{ textAlign: "right", fontWeight: 500 }}>AED {calculateItemTotal(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Subtotal:</span>
            <span style={{ fontWeight: 500 }}>AED {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Shipping:</span>
            <span style={{ fontWeight: 500 }}>AED {(order.shipping || 0).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>Tax:</span>
            <span style={{ fontWeight: 500 }}>AED {(order.tax || 0).toFixed(2)}</span>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>Total:</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--success)" }}>
              AED {(order.totalAmount || order.total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Payment Method</h3>
          <p style={{ fontSize: "13px", textTransform: "capitalize" }}>{order.paymentMethod}</p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "20px",
          }}
        >
          <p style={{ marginBottom: "4px" }}>Thank you for your business!</p>
          <p style={{ fontSize: "12px" }}>If you have any questions, please contact us at support@afiyazone.com</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice, .printable-invoice * {
            visibility: visible;
          }
          .printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print-header {
            display: none !important;
          }
          .invoice-content {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
