import { Download } from 'lucide-react';

interface InvoicePreviewProps {
  order: any;
  onClose: () => void;
  onDownload: () => void;
}

export function InvoicePreview({ order, onClose, onDownload }: InvoicePreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateItemTotal = (item: any) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const subtotal = order.items.reduce((sum: number, item: any) => {
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-scrollable invoice-preview" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title ">Invoice Preview</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Invoice Header */}
            <div className="text-center">
              <div className="inv-logo gap-2">
                <div><img src="/assets/icon.png" alt="Afiya Zone Logo" /></div>
                <h4>AFIYA ZONE</h4>
              </div>

              <small className="inv">Natural Health & Wellness</small>
              <hr className="my-4" />
            </div>

            {/* Order Info */}
            <div className="inv-order-details">
              <div className="col-md-6 mb-3">
                <h3 className="h5 inv mb-3">Order Details</h3>
                <p className="mb-1"><strong>Order #:</strong> {order.orderNumber}</p>
                <p className="mb-1"><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                <p className="mb-0">
                  <strong>Status:</strong>
                  <span className="badge bg-primary ms-2 text-uppercase">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="col-md-6 mb-3">
                <h3 className="h5 inv mb-3">Customer</h3>
                <p className="mb-1">{order.user?.firstName} {order.user?.lastName}</p>
                <p className="mb-0">{order.user?.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-5">
              <h3 className="h5 inv mb-3">Shipping Address</h3>
              <div className="bg-light-subtle rounded p-3">
                <p className="mb-1">{order.shippingAddress.fullName}</p>
                <p className="mb-1">{order.shippingAddress.address}</p>
                <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p className="mb-1">{order.shippingAddress.country}</p>
                <p className="mb-0">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-5">
              <h3 className="h5 inv mb-3">Order Items</h3>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <div className="inv">{item.name?.en || 'Product'}</div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">AED {item.price.toFixed(2)}</td>
                        <td className="text-end ">AED {calculateItemTotal(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-5">
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="inv">Subtotal:</span>
                  <span className="inv">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="inv">Shipping:</span>
                  <span className="inv">AED {order.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="inv">Tax:</span>
                  <span className="inv">AED {order.tax.toFixed(2)}</span>
                </div>
                <div className="border-top my-2 pt-2">
                  <div className="d-flex justify-content-between">
                    <span className="h5 fw-bold mb-0">Total:</span>
                    <span className="h5 fw-bold mb-0">AED {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-5">
              <h3 className="h5 inv mb-3">Payment Method</h3>
              <p className="mb-0">{order.paymentMethod}</p>
            </div>

            {/* Footer */}
            <div className="text-center  border-top pt-4">
              <small className="mb-1">Thank you for your business!</small>
              <small className="mb-0">If you have any questions, please contact us at support@afiyazone.com</small>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer inv-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <Download size={16} />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}