import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types/types';
import Spinner from '../components/ui/Spinner';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const data = await orderService.getOrderById(id);
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
        <Link to="/orders" className="text-orange-600 hover:underline mt-4 inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Actions (Hidden when printing) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link to="/orders" className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Orders
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm"
        >
          <Printer className="mr-2 h-5 w-5" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Container */}
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center">
              <ShoppingBag className="mr-3 h-8 w-8 text-orange-600" />
              INVOICE
            </h1>
            <p className="text-gray-500 mt-2 font-medium">E-Shop Retail Store</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</p>
            <p className="text-lg font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-gray-500 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
              <MapPin className="mr-2 h-4 w-4" /> Billed To
            </h3>
            <p className="font-bold text-gray-900">{order.address?.fullName || order.user?.name || 'Customer'}</p>
            <p className="text-gray-600">{order.address?.phone || ''}</p>
            <p className="text-gray-600 mt-2">
              {order.address?.street}<br />
              {order.address?.city}, {order.address?.postalCode}
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
              <Truck className="mr-2 h-4 w-4" /> Order Status
            </h3>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-orange-100 text-orange-800 capitalize">
              {order.status}
            </span>
            <p className="text-gray-500 text-sm mt-4">
              Payment Method: <span className="font-bold text-gray-700">Cash on Delivery</span>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Item Description</th>
                <th className="py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Qty</th>
                <th className="py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Unit Price</th>
                <th className="py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.products.map((item, index) => (
                <tr key={index}>
                  <td className="py-4">
                    <p className="font-bold text-gray-900">{item.product?.name || 'Deleted Product'}</p>
                  </td>
                  <td className="py-4 text-center text-gray-700 font-medium">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-700">Rs. {item.product?.price?.toFixed(2) || '0.00'}</td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    Rs. {((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t-2 border-gray-200 pt-6">
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="flex justify-between text-xl font-black text-orange-600 pt-3 border-t border-gray-100">
              <span>Total Amount</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-400 font-medium">
          <p>Thank you for shopping with E-Shop!</p>
          <p>If you have any questions concerning this invoice, please contact our Help Center.</p>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
