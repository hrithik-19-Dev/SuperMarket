import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { SupermarketProduct, ProductVariant, StoreHub } from '../data/supermarketData';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  product: SupermarketProduct;
  variant: ProductVariant;
  quantity: number;
}

export interface ConfirmedOrder {
  orderId: string;
  timestamp: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  paymentMethod: 'COD' | 'UPI' | 'Card';
  deliverySlot: string;
  storeHub: StoreHub;
  items: CartItem[];
  subtotal: number;
  mrpTotal: number;
  totalSavings: number;
  deliveryFee: number;
  grandTotal: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedHub: StoreHub;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onOrderConfirmed: (order: ConfirmedOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  selectedHub,
  onUpdateQuantity,
  onRemoveItem,
  onOrderConfirmed,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('Aarav Mehta');
  const [phone, setPhone] = useState('+91 98204 51290');
  const [address, setAddress] = useState('Flat 1402, Sea Breeze Towers, Worli');
  const [pincode, setPincode] = useState(selectedHub.pincode);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card'>('COD');
  const [deliverySlot, setDeliverySlot] = useState(selectedHub.deliverySlot);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const mrpTotal = cart.reduce(
    (sum, item) => sum + item.variant.mrp * item.quantity,
    0
  );
  const totalSavings = mrpTotal - subtotal;
  const freeDeliveryThreshold = 499;
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : 39;
  const grandTotal = subtotal + deliveryFee;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setFormError('Please complete all delivery verification fields.');
      return;
    }
    setFormError('');

    const randomOrderNum = Math.floor(1040 + Math.random() * 8900);
    const newOrder: ConfirmedOrder = {
      orderId: `RSB-${randomOrderNum}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      paymentMethod,
      deliverySlot,
      storeHub: selectedHub,
      items: [...cart],
      subtotal,
      mrpTotal,
      totalSavings,
      deliveryFee,
      grandTotal,
    };

    onOrderConfirmed(newOrder);
    setStep('cart');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Basket and Checkout"
    >
      <div className="relative w-full max-w-lg bg-[#F9F9F8] h-full flex flex-col shadow-2xl border-l border-[#E5E7EB]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 className="font-display text-lg font-bold text-[#111827]">
              {step === 'cart' ? 'Smart Bazaar Basket' : 'Doorstep Delivery & Verification'}
            </h2>
            <p className="text-xs text-[#4B5563]">
              Fulfilling from {selectedHub.neighborhood} · {selectedHub.pincode}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F1] rounded-lg transition-colors cursor-pointer"
            aria-label="Close basket drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {cart.length > 0 && (
          <div className="px-6 py-2.5 bg-[#EFEFE9] border-b border-[#E5E7EB] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#111827]">
              <Truck className="w-4 h-4 text-[#0D6832] shrink-0" />
              {amountForFreeDelivery === 0 ? (
                <span>
                  <strong className="text-[#0D6832]">Free Express Delivery</strong> unlocked on this order
                </span>
              ) : (
                <span>
                  Add <strong className="font-mono-tabular">₹{amountForFreeDelivery}</strong> more for Free Delivery (Threshold ₹499)
                </span>
              )}
            </div>
            <span className="font-mono-tabular text-[#0D6832] font-semibold">
              Saving ₹{totalSavings}
            </span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#EFEFE9] flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#0D6832]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827] mb-1">
                Your Smart Bazaar basket is empty
              </h3>
              <p className="text-sm text-[#4B5563] max-w-xs mb-6">
                Explore farm-direct Konkan mangoes, 24-month aged Himalayan basmati, or fresh sourdough loaves below MRP.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#0D6832] hover:bg-[#094d24] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Browse Daily Harvest
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#E5E7EB]"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F3F4F1] shrink-0 border border-[#E5E7EB]">
                    <ResilientImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-[#6B7280]">{item.product.brand}</p>
                        <h4 className="text-sm font-semibold text-[#111827] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-[#4B5563] mt-0.5">
                          {item.variant.label}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.variant.id)}
                        className="text-[#9CA3AF] hover:text-[#B91C1C] p-1 transition-colors cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F3F4F6]">
                      <div className="flex items-center border border-[#D1D5DB] rounded-md bg-[#F9F9F8]">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variant.id, -1)
                          }
                          className="p-1.5 text-[#111827] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold font-mono-tabular">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variant.id, 1)
                          }
                          className="p-1.5 text-[#111827] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right font-mono-tabular">
                        <span className="text-xs text-[#6B7280] line-through mr-2">
                          ₹{item.variant.mrp * item.quantity}
                        </span>
                        <span className="text-sm font-bold text-[#111827]">
                          ₹{item.variant.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-verification-form" onSubmit={handlePlaceOrder} className="space-y-5">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-4">
                <h3 className="text-xs font-semibold text-[#111827]">
                  01. Customer & Doorstep Address Verification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#0D6832]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-1">
                      Mobile Number (For OTP / Delivery Alert)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] font-mono-tabular focus:outline-none focus:border-[#0D6832]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#4B5563] mb-1">
                    Complete Street & Apartment Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#0D6832]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-1">
                      Postal PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] font-mono-tabular focus:outline-none focus:border-[#0D6832]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#4B5563] mb-1">
                      Preferred Delivery Slot
                    </label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#0D6832]"
                    >
                      <option value="Today, 45 Mins Express">Today, 45 Mins Express</option>
                      <option value="Today, 5:00 PM – 7:00 PM">Today, 5:00 PM – 7:00 PM</option>
                      <option value="Tomorrow, 7:00 AM – 9:00 AM">Tomorrow, 7:00 AM – 9:00 AM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <h3 className="text-xs font-semibold text-[#111827]">
                  02. Payment Method (Pay on Delivery Supported)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      id: 'COD',
                      title: 'Cash / UPI on Delivery (COD)',
                      desc: 'Pay via cash or scan any UPI QR code at your doorstep upon inspection.',
                    },
                    {
                      id: 'UPI',
                      title: 'Instant JioPay / UPI Auto-Verify',
                      desc: 'Zero-fee instant confirmation with SmartCoin loyalty credit.',
                    },
                    {
                      id: 'Card',
                      title: 'Credit / Debit Card / Sodexo Meal Pass',
                      desc: 'All major RuPay, Visa, Mastercard, and Pluxee meal cards accepted.',
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === option.id
                          ? 'border-[#0D6832] bg-[#0D6832]/5'
                          : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id as 'COD' | 'UPI' | 'Card')}
                        className="mt-0.5 accent-[#0D6832]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">
                          {option.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer Bill Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E5E7EB] space-y-4 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#4B5563]">
                <span>Total MRP ({cart.reduce((n, i) => n + i.quantity, 0)} items)</span>
                <span className="font-mono-tabular">₹{mrpTotal}</span>
              </div>
              <div className="flex justify-between text-[#0D6832] font-medium">
                <span>Smart Bazaar Below-MRP Discount</span>
                <span className="font-mono-tabular">-₹{totalSavings}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Cold-Chain Express Delivery Fee</span>
                <span className="font-mono-tabular">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-[#E5E7EB]">
                <span>Total Payable</span>
                <span className="font-mono-tabular">₹{grandTotal}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#0D6832] hover:bg-[#094d24] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <span>Proceed to Address & COD Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 text-xs font-semibold text-[#111827] bg-[#F3F4F1] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Back to Basket
                </button>
                <button
                  type="submit"
                  form="checkout-verification-form"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#0D6832] hover:bg-[#094d24] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order · ₹{grandTotal}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
