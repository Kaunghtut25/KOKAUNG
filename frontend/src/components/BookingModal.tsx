"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

type PaymentMethod = "kbzpay" | "wavepay" | "bank" | null;
type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "tour" | "hotel" | "car" | "insurance" | "visa";
  itemId: string;
  itemName: string;
  priceMMK?: number;
  priceUSD?: number;
  itemSubtitle?: string;
  unitPrice?: number;
  currency?: "MMK" | "USD";
  unitLabel?: string;
  maxQuantity?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemName,
  priceMMK,
  priceUSD,
}: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>(1);
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset all state on open/mount
  const resetState = useCallback(() => {
    setStep(1);
    setTravelDate("");
    setTravelers(1);
    setSpecialRequests("");
    setPaymentMethod(null);
    setTransactionId("");
    setBookingId("");
    setLoading(false);
    setSuccess(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalMMK = (priceMMK || 0) * travelers;
  const today = new Date().toISOString().split("T")[0];

  const handleTravelersChange = (delta: number) => {
    setTravelers((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const generateTransactionId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "SIM-";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleProceedToPayment = () => {
    if (!travelDate) {
      toast.error("Please select a travel date.");
      return;
    }
    if (travelDate < today) {
      toast.error("Travel date cannot be in the past.");
      return;
    }
    setStep(3);
  };

  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "bank") {
      handleConfirmBankTransfer();
    } else {
      setStep(4);
    }
  };

  const handleConfirmBankTransfer = async () => {
    const tid = generateTransactionId();
    setTransactionId(tid);
    setLoading(true);
    try {
      const bookingRes = await api.post("/bookings", {
        itemType,
        itemId,
        itemName,
        totalPrice: totalMMK,
        currency: "MMK",
        travelDate,
        travelers,
        specialRequests,
      });
      const bId = bookingRes.data?.booking?._id || bookingRes.data?._id || `BK-${Date.now()}`;
      setBookingId(bId);

      await api.post(`/bookings/${bId}/pay`, {
        paymentMethod: "bank",
        paymentMetadata: { transactionId: tid },
      });

      setSuccess(true);
      setStep(5);
      toast.success("Booking confirmed via Bank Transfer!");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Booking failed."
          : "Booking failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod || paymentMethod === "bank") return;
    const tid = generateTransactionId();
    setTransactionId(tid);
    setLoading(true);
    try {
      const bookingRes = await api.post("/bookings", {
        itemType,
        itemId,
        itemName,
        totalPrice: totalMMK,
        currency: "MMK",
        travelDate,
        travelers,
        specialRequests,
      });
      const bId = bookingRes.data?.booking?._id || bookingRes.data?._id || `BK-${Date.now()}`;
      setBookingId(bId);

      await api.post(`/bookings/${bId}/pay`, {
        paymentMethod,
        paymentMetadata: { transactionId: tid },
      });

      setSuccess(true);
      setStep(5);
      toast.success("Payment confirmed! Booking successful.");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Payment failed."
          : "Payment failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const itemTypeLabel =
    itemType === "tour" ? "Tour" : itemType === "hotel" ? "Hotel" : "Car Rental";

  // --- Render Step Indicators ---
  const stepLabels = ["Details", "Review", "Payment", "QR Code", "Done"];
  const currentStepIndex = step - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-card relative w-full max-w-lg max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step progress */}
        {!success && step <= 4 && (
          <div className="flex items-center gap-2 mb-6">
            {stepLabels.slice(0, 4).map((label, i) => (
              <React.Fragment key={label}>
                <div
                  className={`flex items-center gap-1.5 text-xs sm:text-sm ${
                    i <= currentStepIndex ? "text-[#D4AF37]" : "text-white/30"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold border ${
                      i <= currentStepIndex
                        ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A1628]"
                        : "border-white/20 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      i < currentStepIndex ? "bg-[#D4AF37]" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* --- STEP 1: Booking Details --- */}
        {step === 1 && (
          <div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
                Book {itemTypeLabel}
              </span>
            </h2>
            <p className="text-white/60 text-sm mb-6">{itemName}</p>

            <div className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={today}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                             focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                             transition-colors duration-200 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTravelersChange(-1)}
                    disabled={travelers <= 1}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white
                               hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed
                               transition-colors flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={travelers}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v)) setTravelers(Math.max(1, Math.min(20, v)));
                    }}
                    className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center
                               focus:outline-none focus:border-[#D4AF37] [appearance:textfield]
                               [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleTravelersChange(1)}
                    disabled={travelers >= 20}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white
                               hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed
                               transition-colors flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Special Requests{" "}
                  <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  placeholder="Any special requirements or preferences..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30
                             focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                             transition-colors duration-200 resize-none"
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                           hover:from-[#C4A037] hover:to-[#E59620]
                           transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: Price Summary --- */}
        {step === 2 && (
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
                Review Booking
              </span>
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-white/70 text-sm">
                <span>Item</span>
                <span>{itemName}</span>
              </div>
              <div className="flex justify-between text-white/70 text-sm">
                <span>Date</span>
                <span>{travelDate || "—"}</span>
              </div>
              <div className="flex justify-between text-white/70 text-sm">
                <span>Travelers</span>
                <span>{travelers}</span>
              </div>
              <div className="flex justify-between text-white/70 text-sm">
                <span>Unit Price (MMK)</span>
                <span>{(priceMMK || 0).toLocaleString()} Ks</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#D4AF37]">{totalMMK.toLocaleString()} Ks</span>
              </div>
              <div className="text-white/40 text-xs text-right">
                ≈ ${((priceUSD || 0) * travelers).toLocaleString()} USD
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl font-medium text-white/70 border border-white/10
                           hover:bg-white/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                           hover:from-[#C4A037] hover:to-[#E59620]
                           transition-all duration-200"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: Payment Method Selection --- */}
        {step === 3 && (
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
                Select Payment Method
              </span>
            </h2>

            <div className="space-y-3 mb-6">
              {/* KBZPay */}
              <button
                onClick={() => handleSelectPayment("kbzpay")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10
                           bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/30
                           transition-all duration-200 text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0066FF]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#0066FF] text-xl font-bold">K</span>
                </div>
                <div>
                  <p className="text-white font-semibold">KBZPay</p>
                  <p className="text-white/50 text-sm">Scan QR with KBZPay app</p>
                </div>
                <svg
                  className="ml-auto w-5 h-5 text-white/30 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* WavePay */}
              <button
                onClick={() => handleSelectPayment("wavepay")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10
                           bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/30
                           transition-all duration-200 text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00A99D]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#00A99D] text-2xl">~</span>
                </div>
                <div>
                  <p className="text-white font-semibold">WavePay</p>
                  <p className="text-white/50 text-sm">Scan QR with WavePay app</p>
                </div>
                <svg
                  className="ml-auto w-5 h-5 text-white/30 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => handleSelectPayment("bank")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10
                           bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/30
                           transition-all duration-200 text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-[#D4AF37]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Bank Transfer</p>
                  <p className="text-white/50 text-sm">Manual bank transfer</p>
                </div>
                <svg
                  className="ml-auto w-5 h-5 text-white/30 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-medium text-white/70 border border-white/10
                         hover:bg-white/5 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {/* --- STEP 4: QR Code Display --- */}
        {step === 4 && paymentMethod && paymentMethod !== "bank" && (
          <div className="text-center">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
                Scan QR Code
              </span>
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Open your {paymentMethod === "kbzpay" ? "KBZPay" : "WavePay"} app and scan
            </p>

            {/* Mock QR Placeholder */}
            <div className="mx-auto w-56 h-56 border-2 border-[#D4AF37] rounded-2xl flex flex-col items-center justify-center bg-white/5 mb-4">
              <div className="grid grid-cols-7 grid-rows-7 gap-1.5 p-4">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm ${
                      Math.random() > 0.45 ? "bg-white" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#D4AF37] font-bold text-sm mt-1">
                {paymentMethod === "kbzpay" ? "KBZPay QR" : "WavePay QR"}
              </p>
            </div>

            <p className="text-white/40 text-xs font-mono mb-6">
              Amount: {totalMMK.toLocaleString()} Ks
            </p>

            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                         hover:from-[#C4A037] hover:to-[#E59620]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 mb-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Payment"
              )}
            </button>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl font-medium text-white/70 border border-white/10
                         hover:bg-white/5 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {/* --- STEP 5: Success --- */}
        {step === 5 && success && (
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-green-400">Booking Confirmed!</span>
            </h3>
            <p className="text-white/60 mb-4">Your booking has been successfully placed.</p>

            <div className="glass-card !bg-white/10 p-4 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Booking ID</span>
                <span className="text-[#D4AF37] font-mono font-semibold">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Transaction ID</span>
                <span className="text-white/70 font-mono text-xs">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Item</span>
                <span className="text-white">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Total</span>
                <span className="text-[#D4AF37] font-semibold">{totalMMK.toLocaleString()} Ks</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                         hover:from-[#C4A037] hover:to-[#E59620]
                         transition-all duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
