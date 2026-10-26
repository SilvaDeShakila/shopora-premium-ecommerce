import React, { useState } from 'react';
import { CartItem, OrderModel } from '../types';
import { X, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, Receipt } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onClose: () => void;
  onOrderSuccess: (order: OrderModel) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  onClose,
  onOrderSuccess,
}) => {
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, IL 62704');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderModel | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!phone.trim() || phone.length < 7) {
      errs.phone = 'Valid phone number is required';
    }
    if (!address.trim() || address.length < 5) {
      errs.address = 'Complete delivery address is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `SHP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const order: OrderModel = {
        orderId,
        orderDate: new Date().toISOString(),
        items: [...cartItems],
        totalAmount: total,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
      };

      setIsSubmitting(false);
      setCompletedOrder(order);
      onOrderSuccess(order);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Order Confirmed!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Thank you for testing the Shopora internship application demo.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left mb-6 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Order Reference</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {completedOrder.orderId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Customer</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {completedOrder.customerName}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Delivery Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {completedOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Paid (Demo)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${completedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              Return to Store
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Simulated Checkout
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assignment Demo Banner */}
            <div className="p-4 mx-6 mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong className="font-semibold">Assignment Verification Demo:</strong> This form validates your shipping info and creates a recorded demo order. Real credit cards are never requested.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.name
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.phone
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, State, Postal Code"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.address
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2 resize-none`}
                />
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
              </div>

              {/* Order total recap */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Total payable</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Confirm Order (${total.toFixed(2)})</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
