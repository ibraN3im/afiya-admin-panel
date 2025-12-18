import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PrintableInvoiceProps {
  order: any;
  onClose: () => void;
}

export function PrintableInvoice({ order, onClose }: PrintableInvoiceProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateItemTotal = (item: any) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const subtotal = order.items.reduce((sum: number, item: any) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  // Auto-focus and prepare for printing when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrint();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="printable-invoice">
      <div className="print-header d-flex justify-content-between align-items-center mb-4">
        <button
          type="button"
          className="btn btn-secondary d-print-none"
          onClick={onClose}
        >
          <X size={16} />
          <span className="ms-1">Close</span>
        </button>
        <button
          type="button"
          className="btn btn-primary d-print-none"
          onClick={handlePrint}
        >
          Print Invoice
        </button>
      </div>

      <div className="invoice-content">
        {/* Invoice Header */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <img
              src="/assets/icon.png"
              alt="Afiya Zone Logo"
              className="img-fluid"
              style={{ maxHeight: '80px' }}
            />
          </div>
          <h1 className="h2 fw-bold mb-2">AFIYA ZONE</h1>
          <p className="text-muted">Natural Health & Wellness</p>
          <hr className="my-4" />
        </div>

        {/* Order Info */}
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <h3 className="h5 fw-medium mb-3">Order Details</h3>
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
            <h3 className="h5 fw-medium mb-3">Customer</h3>
            <p className="mb-1">{order.user?.firstName} {order.user?.lastName}</p>
            <p className="mb-0">{order.user?.email}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-5">
          <h3 className="h5 fw-medium mb-3">Shipping Address</h3>
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
          <h3 className="h5 fw-medium mb-3">Order Items</h3>
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
                      <div className="fw-medium">{item.name?.en || 'Product'}</div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">AED {item.price.toFixed(2)}</td>
                    <td className="text-end fw-medium">AED {calculateItemTotal(item)}</td>
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
              <span className="text-muted">Subtotal:</span>
              <span className="fw-medium">AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping:</span>
              <span className="fw-medium">AED {order.shipping.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tax:</span>
              <span className="fw-medium">AED {order.tax.toFixed(2)}</span>
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
          <h3 className="h5 fw-medium mb-3">Payment Method</h3>
          <p className="mb-0">{order.paymentMethod}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-muted border-top pt-4">
          <p className="mb-1">Thank you for your business!</p>
          <p className="mb-0">If you have any questions, please contact us at support@afiyazone.com</p>
        </div>
      </div>

      {/* Print-specific styles */}
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
            width: 50%;
            padding: 20px;
          }
          .d-print-none {
            display: none !important;
          }
        }
        
        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 10px 20px;
          background: white;
          border-bottom: 1px solid #dee2e6;
          z-index: 1000;
        }
        
        .invoice-content {
          margin-top: 60px;
        }
      `}</style>
    </div>
  );
}