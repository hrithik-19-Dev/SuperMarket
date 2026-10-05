import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Check, ShieldCheck, Truck, CreditCard, MapPin } from 'lucide-react';
import { SupermarketProduct, ProductVariant, StoreHub } from '../data/supermarketData';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: SupermarketProduct | null;
  selectedHub: StoreHub;
  onClose: () => void;
  onAddToCart: (product: SupermarketProduct, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  selectedHub,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const savingsAmount = (activeVariant.mrp - activeVariant.price) * quantity;
  const savingsPercent = Math.round(
    ((activeVariant.mrp - activeVariant.price) / activeVariant.mrp) * 100
  );

  const handleConfirmAdd = () => {
    onAddToCart(product, activeVariant, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#F9F9F8] border border-[#E5E7EB] rounded-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="font-medium text-[#111827]">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">SKU: {product.sku}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111827] bg-[#F3F4F1] hover:bg-[#E5E7EB] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contiguous Purchase Module Layout (Gallery Left, Purchase Right) */}
        <div className="overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Gallery & Provenance (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E5E7EB]">
              <ResilientImage
                src={product.image}
                alt={product.name}
                title={product.name}
                subtitle={product.origin}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 flex items-center justify-between text-xs text-white">
                <span>Origin: {product.origin}</span>
                <span className="font-mono-tabular">
                  ★ {product.rating} ({product.reviewsCount} verified buyers)
                </span>
              </div>
            </div>

            {/* Unboxed Provenance & Nutritional Specs */}
            <div className="space-y-4 pt-2 border-t border-[#E5E7EB]">
              <div>
                <h4 className="text-xs font-semibold text-[#111827] mb-1">
                  01. Farm & Batch Provenance
                </h4>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {product.farmerOrBatchNote}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#111827] mb-1">
                  02. Quality & Nutritional Profile
                </h4>
                <p className="text-xs text-[#4B5563] font-mono-tabular">
                  {product.nutritionalHighlights}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#111827] mb-1">
                  03. Kitchen Storage Guidance
                </h4>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {product.storageAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Contiguous Purchase Module (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#0D6832] font-medium">
                <span>{product.availability}</span>
                <span aria-hidden="true">·</span>
                <span>Direct Smart Bazaar Supply</span>
              </div>
              <h2
                id="pdp-modal-title"
                className="font-display text-2xl font-bold text-[#111827] leading-snug"
              >
                {product.name}
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Below-MRP Breakdown */}
            <div className="py-4 border-y border-[#E5E7EB] space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono-tabular text-3xl font-bold text-[#111827]">
                  ₹{activeVariant.price * quantity}
                </span>
                <span className="font-mono-tabular text-sm text-[#6B7280] line-through">
                  MRP ₹{activeVariant.mrp * quantity}
                </span>
                <span className="text-xs font-semibold text-[#0D6832] font-mono-tabular">
                  Save ₹{savingsAmount} ({savingsPercent}% Off MRP)
                </span>
              </div>
              <p className="text-xs text-[#6B7280] font-mono-tabular">
                Unit Rate: {activeVariant.unitPriceLabel} · Inclusive of all taxes
              </p>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#111827]">
                Select Pack Size
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === activeVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#0D6832] bg-[#0D6832]/5 text-[#111827]'
                          : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">
                          {variant.label}
                        </p>
                        <p className="text-xs text-[#6B7280] font-mono-tabular">
                          {variant.unitPriceLabel}
                        </p>
                      </div>
                      <div className="text-right font-mono-tabular">
                        <p className="text-sm font-bold text-[#111827]">
                          ₹{variant.price}
                        </p>
                        <p className="text-xs text-[#6B7280] line-through">
                          ₹{variant.mrp}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary Add to Basket CTA */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center border border-[#D1D5DB] rounded-lg bg-[#F9F9F8]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-[#111827] hover:bg-[#E5E7EB] rounded-l-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold font-mono-tabular text-[#111827]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-[#111827] hover:bg-[#E5E7EB] rounded-r-lg transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#0D6832] hover:bg-[#094d24] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <span>Add to Basket · ₹{activeVariant.price * quantity}</span>
                )}
              </button>
            </div>

            {/* Delivery & Payment Trust Summary */}
            <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-xs text-[#4B5563]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0D6832] shrink-0" />
                <span>
                  Fulfilling from <strong className="text-[#111827]">{selectedHub.neighborhood}</strong> ({selectedHub.pincode})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0D6832] shrink-0" />
                <span>
                  {selectedHub.deliverySlot} · Free delivery on orders above ₹499
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0D6832] shrink-0" />
                <span>
                  Cash on Delivery (COD), UPI & JioPay accepted at doorstep
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D6832] shrink-0" />
                <span>
                  100% No-Questions-Asked Freshness Replacement at doorstep
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
