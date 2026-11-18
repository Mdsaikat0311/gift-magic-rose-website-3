import { FormEvent, useRef, useState } from 'react';
import { Minus, Plus, ShieldCheck } from 'lucide-react';
import {
  GIFT_PACKAGES,
  formatBDT,
} from '../data/products';
import { trackMetaEvent } from '../lib/metaPixel';
import { submitWooOrder } from '../lib/woocommerceClient';
import { ProductImage } from './ProductImage';
import type { ConfirmedOrder } from './ThankYouPage';

interface OrderSectionProps {
  onOrderConfirmed: (order: ConfirmedOrder) => void;
}

export function OrderSection({ onOrderConfirmed }: OrderSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const checkoutTrackedRef = useRef(false);

  const selectedPkg = GIFT_PACKAGES[0];
  const subtotal = selectedPkg.price * quantity;
  const total = subtotal;

  function markInitiateCheckout() {
    if (checkoutTrackedRef.current) return;
    checkoutTrackedRef.current = true;
    void trackMetaEvent({
      eventName: 'InitiateCheckout',
      value: total,
      currency: 'BDT',
      contentName: selectedPkg.name,
      contentIds: [selectedPkg.id],
      numItems: quantity,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');

    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim().replace(/[\s-]/g, '');
    const trimmedAddress = address.trim();

    if (!trimmedName) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    if (!/^(\+?88)?01[3-9]\d{8}$/.test(trimmedPhone)) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (trimmedAddress.length < 8) {
      setErrorMessage('অনুগ্রহ করে ডেলিভারির সম্পূর্ণ ঠিকানা (বাসা, রোড, এলাকা/জেলা) লিখুন।');
      return;
    }

    setIsSubmitting(true);
    let finalOrderCode = `GM-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const result = await submitWooOrder({
        customerName: trimmedName,
        phone: trimmedPhone,
        address: trimmedAddress,
        deliveryZone,
        quantity,
        packageName: selectedPkg.name,
        unitPrice: selectedPkg.price,
      });
      finalOrderCode = result.orderCode;
    } finally {
      setIsSubmitting(false);
    }

    const orderPayload: ConfirmedOrder = {
      orderCode: finalOrderCode,
      customerName: trimmedName,
      phone: trimmedPhone,
      address: trimmedAddress,
      deliveryZone,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      quantity,
      subtotal,
      total,
    };

    setCustomerName('');
    setPhone('');
    setAddress('');
    setQuantity(1);
    setErrorMessage('');
    onOrderConfirmed(orderPayload);
  }

  return (
    <section id="order-form" className="py-10 pb-16 sm:py-14 sm:pb-20">
      <div className="mx-auto max-w-[780px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-[#DFD8C8] bg-[#FAFBEF] shadow-md">
          {/* Vibrant Rose Header Bar */}
          <div className="bg-[#F0185B] px-5 py-4 text-center text-white">
            <h2 className="font-display text-lg font-bold sm:text-2xl">
              অর্ডার করতে নিচের ফর্মটি পূরণ করুন
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8">
            {/* Your Products Section (Soft Mint Selected Product Row) */}
            <div>
              <h3 className="font-display text-sm font-bold text-[#241319] sm:text-base">
                Your Products
              </h3>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#9FD5AD] bg-[#D8F2DD] p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#D81B53] bg-white"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#D81B53]" />
                  </span>
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white bg-white">
                    <ProductImage
                      src={selectedPkg.image}
                      alt={selectedPkg.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1B3121]">
                      {selectedPkg.name}
                    </p>
                    <p className="text-xs font-medium text-[#2F5338] tabular-nums">
                      ৳{formatBDT(selectedPkg.price)} × {formatBDT(quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 rounded-lg border border-[#A5D6B2] bg-white p-0.5">
                    <button
                      type="button"
                      aria-label="পরিমাণ কমান"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#1B3121] hover:bg-[#EAF7EC] cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[20px] text-center text-xs font-bold text-[#1B3121] tabular-nums">
                      {formatBDT(quantity)}
                    </span>
                    <button
                      type="button"
                      aria-label="পরিমাণ বাড়ান"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#1B3121] hover:bg-[#EAF7EC] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-[#1B3121] tabular-nums">
                    ৳{formatBDT(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="mt-6 space-y-4">
              <h3 className="font-display text-base font-bold text-[#241319]">
                Billing details
              </h3>

              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-1.5 block text-xs font-bold text-[#352028] sm:text-sm"
                >
                  আপনার নাম <span className="text-[#D81B53]">*</span>
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onFocus={markInitiateCheckout}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="নাম"
                  className="w-full rounded-lg border border-[#D8D8CC] bg-white px-3.5 py-2.5 text-sm text-[#241319] placeholder:text-[#9E9599] focus:border-[#F0185B] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-address"
                  className="mb-1.5 block text-xs font-bold text-[#352028] sm:text-sm"
                >
                  আপনার এড্রেস <span className="text-[#D81B53]">*</span>
                </label>
                <input
                  id="customer-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা নম্বর, রোড, এলাকা, থানা ও জেলার নাম"
                  className="w-full rounded-lg border border-[#D8D8CC] bg-white px-3.5 py-2.5 text-sm text-[#241319] placeholder:text-[#9E9599] focus:border-[#F0185B] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-1.5 block text-xs font-bold text-[#352028] sm:text-sm"
                >
                  মোবাইল নাম্বার <span className="text-[#D81B53]">*</span>
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={phone}
                  onFocus={markInitiateCheckout}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-lg border border-[#D8D8CC] bg-white px-3.5 py-2.5 text-sm text-[#241319] tabular-nums placeholder:text-[#9E9599] focus:border-[#F0185B] focus:outline-none"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-bold text-[#352028] sm:text-sm">
                  ডেলিভারি এলাকা
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone('inside')}
                    className={`min-h-[42px] rounded-lg border px-3 py-2 text-xs font-bold transition-colors cursor-pointer sm:text-sm ${
                      deliveryZone === 'inside'
                        ? 'border-[#00897B] bg-[#00897B]/10 text-[#00695C]'
                        : 'border-[#D8D8CC] bg-white text-[#4A3A40]'
                    }`}
                  >
                    ঢাকার ভেতরে (ফ্রি)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryZone('outside')}
                    className={`min-h-[42px] rounded-lg border px-3 py-2 text-xs font-bold transition-colors cursor-pointer sm:text-sm ${
                      deliveryZone === 'outside'
                        ? 'border-[#00897B] bg-[#00897B]/10 text-[#00695C]'
                        : 'border-[#D8D8CC] bg-white text-[#4A3A40]'
                    }`}
                  >
                    ঢাকার বাইরে (ফ্রি)
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Strip */}
            <div className="mt-6">
              <h3 className="font-display text-sm font-bold text-[#241319] sm:text-base">
                Shipping
              </h3>
              <div className="mt-2 rounded-lg border border-[#DFDFD2] bg-white/75 px-3.5 py-2.5 text-xs font-semibold text-[#3C4B40] sm:text-sm">
                সারাদেশে ডেলিভারি চার্জ ফ্রি (৳০) · বাবুল প্যাকেজিং ফ্রি
              </div>
            </div>

            {/* Your Order Table */}
            <div className="mt-6">
              <h3 className="font-display text-base font-bold text-[#241319]">
                Your order
              </h3>
              <div className="mt-2 divide-y divide-[#E6E5D8] border-y border-[#E6E5D8] text-sm text-[#2D1820]">
                <div className="flex justify-between py-2.5 font-bold">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
                <div className="flex items-center justify-between gap-2 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded border border-[#E6E5D8] bg-white">
                      <ProductImage
                        src={selectedPkg.image}
                        alt={selectedPkg.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>
                      {selectedPkg.name} × {formatBDT(quantity)}
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">
                    ৳{formatBDT(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">
                    ৳{formatBDT(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 text-base font-bold text-[#241319]">
                  <span>Total</span>
                  <span className="tabular-nums">৳{formatBDT(total)}</span>
                </div>
              </div>
            </div>

            {/* Cash On Delivery Teal Box */}
            <div className="mt-5 rounded-xl border border-[#DFDFD2] bg-[#F2F4EA] p-4">
              <p className="text-xs font-bold text-[#241319] sm:text-sm">
                Cash on delivery
              </p>
              <div className="mt-2 rounded-lg bg-[#00897B] px-4 py-2.5 text-xs font-semibold text-white sm:text-sm">
                সারাদেশে ডেলিভারি চার্জ ফ্রি · হাতে পেয়ে দেখে টাকা পরিশোধ করুন
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-[#F87171] bg-[#FEF2F2] px-3.5 py-2.5 text-xs font-semibold text-[#B91C1C]"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#F0185B] px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#D4114E] disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0185B] cursor-pointer"
              >
                {isSubmitting
                  ? 'অর্ডার কনফার্ম হচ্ছে...'
                  : `Place Order · ৳${formatBDT(total)}`}
              </button>

              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-[#54474B]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#00897B]" />
                <span>অর্ডার কনফার্ম করলে সরাসরি আমাদের স্টোরে জমা হবে</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
