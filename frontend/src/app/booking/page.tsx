'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { getTour, getHotel, getCar, createBooking, processPayment, Tour, Hotel, Car, BookingData } from '@/lib/api';

type ItemType = 'tour' | 'hotel' | 'car';
type BookingStep = 'details' | 'payment' | 'qr' | 'success';
type PaymentMethod = 'kbzpay' | 'wavepay' | 'bank_transfer';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

function generateTransactionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'SIM-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemType = (searchParams.get('type') || 'tour') as ItemType;
  const itemId = searchParams.get('id') || '';
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);
  const travelers = parseInt(searchParams.get('travelers') || '1', 10);
  const date = searchParams.get('date') || '';

  const [item, setItem] = useState<Tour | Hotel | Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<BookingStep>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kbzpay');
  const [bookingId, setBookingId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Fetch item details
  useEffect(() => {
    if (!itemId) {
      setError('No item selected for booking.');
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      setLoading(true);
      try {
        let response;
        if (itemType === 'tour') {
          response = await getTour(itemId);
        } else if (itemType === 'hotel') {
          response = await getHotel(itemId);
        } else if (itemType === 'car') {
          response = await getCar(itemId);
        }
        if (response) {
          setItem(response.data);
        } else {
          setError('Could not load item details.');
        }
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemType, itemId]);

  // Derive item display info
  const getItemName = (): string => {
    if (!item) return 'Loading...';
    if (itemType === 'tour') return (item as Tour).title;
    if (itemType === 'hotel') return (item as Hotel).name;
    return (item as Car).carType;
  };

  const getItemSubtitle = (): string => {
    if (!item) return '';
    if (itemType === 'tour') return `${(item as Tour).destination} • ${(item as Tour).duration} ${(item as Tour).durationUnit}`;
    if (itemType === 'hotel') return (item as Hotel).location;
    return `${(item as Car).capacity} seats`;
  };

  const getUnitPrice = (): number => {
    if (!item) return 0;
    if (itemType === 'tour') return (item as Tour).priceMMK;
    if (itemType === 'hotel') return (item as Hotel).pricePerNightMMK;
    const car = item as Car;
    return car.pricingWithDriver?.[0]?.priceMMK || 0;
  };

  const getTotal = (): number => {
    if (itemType === 'hotel') return getUnitPrice() * quantity;
    return getUnitPrice() * travelers;
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!customer.email.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    if (!customer.phone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }

    setStep('payment');
  };

  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setStep('qr');
  };

  const handleConfirmPayment = async () => {
    if (!item) return;

    const txId = generateTransactionId();
    setTransactionId(txId);

    const bookingPromise = (async () => {
      // Step 1: Create booking
      const bookingData: BookingData = {
        itemType,
        itemId,
        travelDate: date,
        quantity,
        travelers,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        specialRequests: customer.specialRequests,
        totalAmount: getTotal(),
        currency: 'MMK',
        paymentMethod,
        transactionId: txId,
      };

      const booking = await createBooking(bookingData);

      // Step 2: Process payment
      await processPayment(booking.data._id, {
        paymentMethod,
        transactionId: txId,
      });

      setBookingId(booking.data.bookingId);
      setStep('success');
    })();

    toast.promise(bookingPromise, {
      loading: 'Processing your booking...',
      success: 'Booking confirmed! 🎉',
      error: 'Something went wrong. Please try again.',
    });

    try {
      await bookingPromise;
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const getPaymentLabel = (method: PaymentMethod): string => {
    switch (method) {
      case 'kbzpay': return 'KBZPay';
      case 'wavepay': return 'WavePay';
      case 'bank_transfer': return 'Bank Transfer';
    }
  };

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────
  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl text-white font-semibold">Cannot Load Booking</h2>
          <p className="text-gray-400">{error || 'Item not found'}</p>
          <button
            onClick={() => router.push('/search')}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // ─── Success Step ───────────────────────────────────────
  if (step === 'success') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1e1e2e', color: '#fff', border: '1px solid #D4AF37' } }} />
        <div className="max-w-md w-full text-center space-y-6">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl text-white font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Booking Confirmed!
          </h1>
          <p className="text-gray-400">
            Your booking has been successfully placed. We&apos;ll send a confirmation to your email shortly.
          </p>

          {/* Booking summary card */}
          <div className="rounded-2xl border border-gold/20 bg-white/5 p-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Booking ID</span>
              <span className="text-[#D4AF37] font-mono font-bold">{bookingId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-white font-mono text-sm">{transactionId}</span>
            </div>
            <hr className="border-gold/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Item</span>
              <span className="text-white font-medium">{getItemName()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span className="text-white">{date || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{itemType === 'hotel' ? 'Nights' : 'Travelers'}</span>
              <span className="text-white">{itemType === 'hotel' ? quantity : travelers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment</span>
              <span className="text-white">{getPaymentLabel(paymentMethod)}</span>
            </div>
            <hr className="border-gold/10" />
            <div className="flex justify-between">
              <span className="text-gray-300 font-semibold">Total</span>
              <span className="text-[#D4AF37] font-bold text-lg">Ks {getTotal().toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // ─── Main Booking Flow ──────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-12 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e1e2e', color: '#fff', border: '1px solid #D4AF37' } }} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl text-white font-bold mb-2 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Complete Your Booking
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 my-8">
          {(['details', 'payment', 'qr'] as BookingStep[]).map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  (step as string) === s
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900'
                    : (step as string) === 'success' || (idx < ['details', 'payment', 'qr'].indexOf(step as string))
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-white/5 border border-gold/20 text-gray-500'
                }`}
              >
                {(step as string) === 'success' || (idx < ['details', 'payment', 'qr'].indexOf(step as string)) ? '✓' : idx + 1}
              </div>
              <span className="text-xs text-gray-500">
                {s === 'details' ? 'Details' : s === 'payment' ? 'Payment' : 'Confirm'}
              </span>
              {idx < 2 && <div className="w-8 h-px bg-gold/20" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Form steps */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Customer Details */}
            {step === 'details' && (
              <div className="rounded-2xl border border-gold/20 bg-white/5 p-6 space-y-5">
                <h2 className="text-xl text-white font-semibold">Customer Information</h2>
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Email *</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Phone Number *</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+95 9 XXXXXXXX"
                      className="w-full px-4 py-3 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Special Requests</label>
                    <textarea
                      value={customer.specialRequests}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any special requirements..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-300"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 'payment' && (
              <div className="rounded-2xl border border-gold/20 bg-white/5 p-6 space-y-5">
                <h2 className="text-xl text-white font-semibold">Select Payment Method</h2>
                <p className="text-gray-400 text-sm">Choose how you&apos;d like to pay</p>
                <div className="space-y-3">
                  {([
                    { method: 'kbzpay' as PaymentMethod, label: 'KBZPay', desc: 'Scan QR with KBZPay app', color: '#00A3E0' },
                    { method: 'wavepay' as PaymentMethod, label: 'WavePay', desc: 'Scan QR with WavePay app', color: '#00B4D8' },
                    { method: 'bank_transfer' as PaymentMethod, label: 'Bank Transfer', desc: 'Transfer to our bank account', color: '#7C3AED' },
                  ]).map((pm) => (
                    <button
                      key={pm.method}
                      type="button"
                      onClick={() => handleSelectPayment(pm.method)}
                      className="w-full p-4 rounded-xl border border-gold/20 bg-white/5 hover:border-gold/50 hover:bg-white/10 transition-all duration-200 text-left flex items-center gap-4 group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: `${pm.color}20`, border: `1px solid ${pm.color}40` }}
                      >
                        {pm.label.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">{pm.label}</p>
                        <p className="text-gray-500 text-xs">{pm.desc}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to details
                </button>
              </div>
            )}

            {/* Step 3: QR Code */}
            {step === 'qr' && (
              <div className="rounded-2xl border border-gold/20 bg-white/5 p-6 space-y-5 text-center">
                <h2 className="text-xl text-white font-semibold">Scan to Pay</h2>
                <p className="text-gray-400 text-sm">
                  Scan the QR code using your {getPaymentLabel(paymentMethod)} app
                </p>

                {/* Mock QR Code SVG */}
                <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-4 border-4 border-gray-200">
                  {/* Decorative QR-like pattern */}
                  <div className="w-full h-full grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          Math.random() > 0.45 ? 'bg-gray-900' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-gold/20">
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-[#D4AF37] text-2xl font-bold">Ks {getTotal().toLocaleString()}</p>
                </div>

                <p className="text-gray-500 text-xs">
                  {paymentMethod === 'bank_transfer'
                    ? 'Account: 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐫𝐚𝐯𝐞𝐥𝐬 & 𝐓𝐨𝐮𝐫𝐬 | Bank: KBZ | Account No: 123-456-789'
                    : `Open your ${getPaymentLabel(paymentMethod)} app and scan the QR code above`}
                </p>

                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-300"
                >
                  Confirm Payment
                </button>

                <button
                  onClick={() => setStep('payment')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Change payment method
                </button>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-gold/20 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg text-white font-semibold">Order Summary</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium">{getItemName()}</p>
                  <p className="text-gray-500 text-xs">{getItemSubtitle()}</p>
                </div>

                <hr className="border-gold/10" />

                {date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Travel Date</span>
                    <span className="text-white">{date}</span>
                  </div>
                )}

                {itemType === 'hotel' ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Nights</span>
                    <span className="text-white">{quantity}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Travelers</span>
                    <span className="text-white">{travelers}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unit Price</span>
                  <span className="text-white">Ks {getUnitPrice().toLocaleString()}</span>
                </div>

                <hr className="border-gold/10" />

                <div className="flex justify-between">
                  <span className="text-gray-300 font-semibold">Total</span>
                  <span className="text-[#D4AF37] font-bold text-xl">Ks {getTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-gray-500 text-xs text-center">
                  ✓ Secure payment • Free cancellation within 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
