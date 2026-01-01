import { X, Printer } from "lucide-react"

interface InvoicePreviewProps {
  order: any
  onClose: () => void
}

export function InvoicePreview({ order, onClose }: InvoicePreviewProps) {
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

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal" style={{ maxWidth: "800px", maxHeight: "90vh" }}>
        <div className="modal-header">
          <h3 className="modal-title">Invoice Preview</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="invoice-logo">
              <img
                src="https://scontent.fdxb1-1.fna.fbcdn.net/v/t39.30808-1/597829220_25326756927005449_7484898340885741205_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=6nqeCIXObGgQ7kNvwHS90ED&_nc_oc=Admmt5t36eCZ5J0Gaf2wc025U5ssCU6VdUyfrY1oG8mmTiUu8_h_6Y4Qk-MfEq6z4rc&_nc_zt=24&_nc_ht=scontent.fdxb1-1.fna&_nc_gid=Ku2MYO-kGnSaDxhjtboIyQ&oh=00_Afl9d6JlAYKzS62EUwg446kCAhBaQu5t8Uh6xfxhADmzIw&oe=6949C6AC"
                alt="Afiya Zone Logo"
              />
              <div>
                <h3>AFIYA ZONE</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Natural Health & Wellness</p>
              </div>
            </div>
            <div className="invoice-details">
              <div className="invoice-number">Invoice #{order.orderNumber}</div>
              <div className="invoice-date">{formatDate(order.createdAt)}</div>
              <span className={`badge badge-${order.status === "delivered" ? "success" : "warning"}`}>
                {order.status}
              </span>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "20px 0" }} />

          {/* Customer & Shipping */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px", color: "var(--text-primary)" }}>
                Customer
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {order.user?.firstName} {order.user?.lastName}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>{order.user?.email}</p>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px", color: "var(--text-primary)" }}>
                Shipping Address
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {order.shippingAddress?.fullName || `${order.user?.firstName} ${order.user?.lastName}`}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="table-container" style={{ marginBottom: "20px" }}>
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
              background: "var(--content-bg)",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Subtotal</span>
              <span style={{ fontWeight: 500, fontSize: "13px" }}>AED {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Shipping</span>
              <span style={{ fontWeight: 500, fontSize: "13px" }}>AED {(order.shipping || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Tax</span>
              <span style={{ fontWeight: 500, fontSize: "13px" }}>AED {(order.tax || 0).toFixed(2)}</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--success)" }}>
                AED {(order.totalAmount || order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Payment Method</h4>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, textTransform: "capitalize" }}>
              {order.paymentMethod}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Thank you for your business!
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
              If you have any questions, please contact us at support@afiyazone.com
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn badge-danger">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
