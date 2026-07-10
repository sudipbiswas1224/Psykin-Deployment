import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, ShieldAlert, XCircle, ArrowRight } from 'lucide-react';
import { dismissCrisis } from '../store/slices/crisisSlice';

const SOSModal = () => {
  const { isCrisisDetected, fallbackSuggestions } = useSelector((state) => state.crisis);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToSos = () => {
    dispatch(dismissCrisis());
    navigate('/sos');
  };

  const handleDismiss = () => {
    dispatch(dismissCrisis());
  };

  const hotlines = [
    { name: 'Tele-MANAS (Govt)', number: '14416', desc: 'Free 24/7 National Tele-Mental Health Helpline' },
    { name: 'KIRAN Helpline', number: '1800-599-0019', desc: 'Free 24/7 Mental Health Support by Govt of India' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 Empathetic Counselling Support' }
  ];

  return (
    <AnimatePresence>
      {isCrisisDetected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative z-10 w-full max-w-lg mx-4 rounded-3xl border border-red-500/30 bg-slate-900 p-6 md:p-8 text-slate-100 shadow-2xl shadow-red-900/10"
          >
            {/* Top Red Glow Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-linear-to-r from-transparent via-red-500 to-transparent blur-xs" />

            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 2 } }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-5"
              >
                <ShieldAlert size={36} />
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                We are here for you
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-sm">
                Our AI companion detected some heavy distress. You are not alone, and there is immediate help available. Please reach out.
              </p>
            </div>

            {/* Helpline Numbers */}
            <div className="mt-8 space-y-3">
              {hotlines.map((hotline, idx) => (
                <motion.div
                  key={hotline.number}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-slate-800/50 p-4 border border-slate-700/30 hover:border-red-500/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{hotline.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{hotline.desc}</p>
                  </div>
                  <a
                    href={`tel:${hotline.number}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white shadow-xs transition-transform active:scale-95 hover:bg-red-500 shrink-0"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-8 space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleNavigateToSos}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-500"
              >
                Go to Self-Care & SOS Directory
                <ArrowRight size={16} />
              </motion.button>

              <button
                onClick={handleDismiss}
                className="w-full rounded-2xl border border-slate-700 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                I feel safe and want to continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SOSModal;
