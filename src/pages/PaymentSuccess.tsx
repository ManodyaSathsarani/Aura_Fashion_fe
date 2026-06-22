import React from 'react';
import { CheckCircle, ArrowRight, ShoppingBag, FileText } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Confetti recycle={false} numberOfPieces={400} />
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been placed successfully via Cash on Delivery (COD).
        </p>

        {orderId && (
          <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 border border-blue-100/50 flex justify-between items-center text-sm">
            <span className="text-blue-500 font-bold tracking-wide uppercase text-xs">Order Ref</span>
            <span className="font-mono font-bold text-blue-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-blue-100">
              #{orderId.slice(-8).toUpperCase()}
            </span>
          </div>
        )}

        <p className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8">
          * Please prepare cash payment upon package arrival.
        </p>

        <div className="space-y-3">
          {orderId && (
            <Link 
              to={`/orders/${orderId}`}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
              <FileText size={20} /> View Invoice
            </Link>
          )}

          <Link 
            to="/orders" 
            className="w-full bg-gray-950 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg"
          >
            <ShoppingBag size={20} /> View My Orders
          </Link>
          
          <Link 
            to="/" 
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;