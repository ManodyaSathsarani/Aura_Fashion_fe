import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, Truck, CheckCircle, FileText } from 'lucide-react';
import type{ Order } from '../../types/types';
import { formatCurrency } from '../../utils/formatters';
import { useAuthStore } from '../../store/authStore';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: Order;
  onUpdate?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate }) => {
  const { user } = useAuthStore();
  const isSellerOrAdmin = user?.roles?.includes('seller') || user?.roles?.includes('admin');
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatCurrency(order.total)}</span>
              </div>
            </div>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="flex items-center text-green-600 mt-2 font-medium">
                <Truck className="h-4 w-4 mr-1" />
                <span className="text-xs">Receive item in 3 days</span>
              </div>
            )}
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </span>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Items ({order.products.length})</h4>
          <div className="space-y-3">
            {order.products.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={item.product?.image || 'https://via.placeholder.com/50'}
                  alt={item.product?.name || 'Unknown'}
                  className="h-12 w-12 object-cover rounded"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {item.product?.name || 'Deleted Product'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × Rs. {item.product?.price ? item.product.price.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            ))}
            
            {order.products.length > 3 && (
              <p className="text-sm text-gray-500">
                + {order.products.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-4 mt-4 flex justify-between items-center">
          <div>
            {isSellerOrAdmin && (
              <select 
                value={order.status}
                onChange={async (e) => {
                  try {
                    await orderService.updateOrderStatus(order._id, e.target.value as any);
                    toast.success('Order status updated!');
                    if (onUpdate) onUpdate();
                    else window.location.reload();
                  } catch (err) {
                    toast.error('Failed to update status');
                  }
                }}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-medium shadow-sm cursor-pointer hover:bg-gray-100 transition"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">In Transit (Shipped)</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to permanently delete this order?")) {
                  try {
                    await orderService.deleteOrder(order._id);
                    toast.success("Order deleted successfully!");
                    if (onUpdate) onUpdate();
                    else window.location.reload();
                  } catch (err) {
                    toast.error("Failed to delete order");
                  }
                }
              }}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              Delete
            </button>
            <Link
              to={`/orders/${order._id}`}
              className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition flex items-center gap-2 font-medium"
            >
              <FileText className="h-4 w-4" />
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;