import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { fetchLiveOrders, LiveOrderItem } from '../lib/woocommerceClient';
import { ProductImage } from './ProductImage';

interface RecentOrderToastProps {
  refreshSignal: number;
}

export function RecentOrderToast({ refreshSignal }: RecentOrderToastProps) {
  const [orders, setOrders] = useState<LiveOrderItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Poll WooCommerce orders (Express proxy or same-origin WordPress REST Bridge)
  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const nextOrders = await fetchLiveOrders();
      if (isMounted && nextOrders.length > 0) {
        setOrders(nextOrders);
        setActiveIndex(0);
        setIsVisible(true);
      }
    }

    loadOrders();
    const pollInterval = window.setInterval(loadOrders, 45_000);

    return () => {
      isMounted = false;
      window.clearInterval(pollInterval);
    };
  }, [refreshSignal]);

  // Cycle through each WooCommerce order one after another in a small tab
  useEffect(() => {
    if (orders.length === 0 || isDismissed) return;

    let hideTimer: number | undefined;
    let nextTimer: number | undefined;

    setIsVisible(true);

    if (orders.length > 1) {
      hideTimer = window.setTimeout(() => {
        setIsVisible(false);
        nextTimer = window.setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % orders.length);
        }, 650);
      }, 4800);
    }

    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      if (nextTimer) window.clearTimeout(nextTimer);
    };
  }, [activeIndex, orders, isDismissed]);

  if (isDismissed || orders.length === 0) {
    return null;
  }

  const currentOrder = orders[activeIndex % orders.length];
  if (!currentOrder) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-[350px] transition-all duration-300 ease-out sm:bottom-5 sm:left-5 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-[#F3B8CA] bg-white/95 p-3 shadow-lg backdrop-blur-md">
        {/* Product Thumbnail */}
        <div className="h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-[#F6D3DD] bg-[#FFF4F6]">
          <ProductImage
            src={currentOrder.image}
            alt={currentOrder.packageName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Orderer Name & Package Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#00897B]">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">সদ্য অর্ডার কনফার্ম করেছেন</span>
          </div>

          <p className="mt-0.5 truncate text-xs text-[#241319]">
            <span className="font-bold">{currentOrder.customerName}</span>
            {currentOrder.location && (
              <span className="font-normal text-[#6B4B56]">
                {' '}
                · {currentOrder.location}
              </span>
            )}
          </p>

          <p className="mt-0.5 truncate text-[11px] font-medium text-[#D81B53]">
            {currentOrder.packageName}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="নোটিফিকেশন বন্ধ করুন"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#8E6A76] transition-colors hover:bg-[#FFF0F4] hover:text-[#241319] cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
