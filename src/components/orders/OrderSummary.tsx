import React from 'react';
import { Package, Truck, User, CheckCircle } from 'lucide-react';
import type { Order } from '../../types/types';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + shipping;

  const getStatusSteps = () => {
    // 🌟 FIXED: Formatted step IDs to accurately map clean model enum status values
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: Package },
      { id: 'paid', label: 'Payment Confirmed', icon: CheckCircle },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: User },
    ];
    
    const currentStatusIndex = steps.findIndex(s => s.id === order.status);
    
    return steps.map((step, index) => {
      const isCompleted = order.status === 'delivered' 
        ? true 
        : currentStatusIndex >= index;

      const isCurrent = step.id === order.status;
      
      return (
        <div key={step.id} className="flex flex-col items-center">
          <div className={`
            h-12 w-12 rounded-full flex items-center justify-center mb-2
            ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
            ${isCurrent ? 'ring-4 ring-green-200' : ''}
          `}>
            <step.icon className="h-6 w-6" />
          </div>
          <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
            {step.label}
          </span>
        </div>
      );
    });
  };

  const getStatusProgressWidth = () => {
    const statuses = ['pending', 'paid', 'shipped', 'delivered'];
    const idx = statuses.indexOf(order.status);
    if (idx === -1) return '25%';
    if (idx >= 2) return '100%'; 
    return `${(idx + 1) * 33.33}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

      {/* Order Status Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {getStatusSteps()}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: getStatusProgressWidth() }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-mono font-medium text-blue-600">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-700">Cash on Delivery (COD)</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === 'delivered' || order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status === 'paid' ? 'Paid & Confirmed' : order.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                {shipping === 0 ? 'FREE' : `LKR ${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">LKR {total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">*Pay cash upon package arrival</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Order Items</h3>
        <div className="space-y-4">
          {order.products.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center">
                <img
                  src={(item.product as any).image || (item.product as any).images?.[0] || 'https://via.placeholder.com/60'}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded shadow-sm bg-gray-50"
                />
                <div className="ml-4">
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">LKR {(item.product.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-gray-400">
                  LKR {item.product.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;