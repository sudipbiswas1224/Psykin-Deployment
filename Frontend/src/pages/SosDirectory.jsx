import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldAlert, Heart, RefreshCw, Eye, Touchpad, Volume2, Flower2, Apple, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const SosDirectory = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: ['']
  });

  const helplines = [
    {
      name: 'Tele-MANAS',
      number: '14416',
      desc: 'National Tele-Mental Health Programme of India. Free, confidential, 24/7 support.',
      availability: '24/7 | Free',
      tag: 'Govt-Backed'
    },
    {
      name: 'KIRAN Helpline',
      number: '1800-599-0019',
      desc: '24/7 Mental Health Rehabilitation Helpline by the Ministry of Social Justice and Empowerment.',
      availability: '24/7 | Free',
      tag: 'Govt-Backed'
    },
    {
      name: 'Vandrevala Foundation',
      number: '1860-2662-345',
      desc: 'Empathetic mental health counseling and crisis support via phone and chat.',
      availability: '24/7 | Free',
      tag: 'NGO'
    },
    {
      name: 'iCall (TISS)',
      number: '9152987821',
      desc: 'Mental health helpline run by Tata Institute of Social Sciences. Professional counselors.',
      availability: 'Mon-Sat, 8 AM - 10 PM',
      tag: 'Academic/NGO'
    },
    {
      name: 'AASRA Helpline',
      number: '91-9820466726',
      desc: 'A 24-hour suicide prevention helpline offering non-judgmental support for individuals in distress.',
      availability: '24/7 | Free',
      tag: 'Suicide Prevention'
    },
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      desc: 'International or local routing for suicide prevention, crisis intervention and support.',
      availability: '24/7 | Free',
      tag: 'International'
    }
  ];

  const groundingSteps = [
    {
      id: 'see',
      title: '5 Things you can SEE',
      count: 5,
      icon: Eye,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      instruction: 'Take a deep breath and look around you. Type 5 things that you see right now.'
    },
    {
      id: 'touch',
      title: '4 Things you can TOUCH',
      count: 4,
      icon: Touchpad,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      instruction: 'Pay attention to your body. What are 4 things you can physically touch or feel (e.g., your desk, hair, fabric)?'
    },
    {
      id: 'hear',
      title: '3 Things you can HEAR',
      count: 3,
      icon: Volume2,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      instruction: 'Close your eyes for a moment. Listen closely. What are 3 distinct sounds you can hear right now?'
    },
    {
      id: 'smell',
      title: '2 Things you can SMELL',
      count: 2,
      icon: Flower2,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      instruction: 'Breathe in deeply. What are 2 smells around you, or smells you can recall/visualize?'
    },
    {
      id: 'taste',
      title: '1 Thing you can TASTE',
      count: 1,
      icon: Apple,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      instruction: 'Focus on your mouth. What is 1 thing you can taste, or a taste you can imagine right now?'
    }
  ];

  const handleInputChange = (stepId, index, value) => {
    setGroundingInputs({
      ...groundingInputs,
      [stepId]: groundingInputs[stepId].map((val, i) => (i === index ? value : val))
    });
  };

  const handleNext = () => {
    if (activeStep < groundingSteps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleResetWizard = () => {
    setActiveStep(0);
    setGroundingInputs({
      see: ['', '', '', '', ''],
      touch: ['', '', '', ''],
      hear: ['', '', ''],
      smell: ['', ''],
      taste: ['']
    });
  };

  const currentStepData = groundingSteps[activeStep];

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      {/* SOS Title Banner */}
      <div className="rounded-3xl bg-linear-to-r from-red-500 to-rose-700 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-36 w-36 rounded-full bg-white opacity-15" />
        <div className="absolute bottom-0 right-10 -mb-10 h-28 w-28 rounded-full bg-white opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Emergency SOS Directory
            </h1>
            <p className="text-rose-100 max-w-xl text-sm md:text-base">
              If you or someone you know is going through a crisis or feeling unsafe, please connect with a professional instantly. Help is just a phone call away.
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
            <ShieldAlert size={28} />
          </div>
        </div>
      </div>

      {/* Main Grid: Grounding Wizard & Helpline Cards */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        
        {/* Grounding Technique Wizard (Spans 2 columns) */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800/80 p-6 md:p-8 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500/25" size={22} />
                5-4-3-2-1 Grounding Technique
              </h2>
              <p className="text-xs text-slate-400 mt-1">A self-paced exercise to calm your nervous system by anchoring yourself in the present.</p>
            </div>
            {activeStep > 0 && (
              <button 
                onClick={handleResetWizard}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            )}
          </div>

          <div className="relative min-h-[360px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeStep < groundingSteps.length ? (
                <motion.div
                  key={currentStepData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Banner */}
                  <div className={`flex items-center gap-4 rounded-2xl border p-4 ${currentStepData.color}`}>
                    <currentStepData.icon size={28} className="shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-white">{currentStepData.title}</h3>
                      <p className="text-xs text-slate-300 mt-0.5">{currentStepData.instruction}</p>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: currentStepData.count }).map((_, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={groundingInputs[currentStepData.id][idx] || ''}
                          onChange={(e) => handleInputChange(currentStepData.id, idx, e.target.value)}
                          placeholder="Type what you observe..."
                          className="w-full rounded-xl bg-slate-850 border border-slate-700/60 pl-8 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-slate-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Completion screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center py-8 space-y-6"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle size={44} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Well Done</h3>
                    <p className="text-slate-400 text-sm max-w-sm">
                      You have completed the grounding exercise. Focus on your breathing, feel the solid floor underneath you, and remember you are safe.
                    </p>
                  </div>
                  <button
                    onClick={handleResetWizard}
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors"
                  >
                    Start Exercise Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Controls */}
            {activeStep < groundingSteps.length && (
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  disabled={activeStep === 0}
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                {/* Progress Indicators */}
                <div className="flex items-center gap-1.5">
                  {groundingSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        i === activeStep ? 'w-4 bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 active:scale-95 transition-all"
                >
                  {activeStep === groundingSteps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Helpline Directory Grid (Sidebar on Desktop, wraps to bottom on mobile) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 px-1">Official Support Hotlines</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {helplines.map((helpline) => (
              <div
                key={helpline.number}
                className="rounded-2xl border border-slate-850 bg-slate-900 p-5 shadow-xs hover:border-slate-800 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{helpline.name}</h4>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md mt-1">
                      {helpline.tag}
                    </span>
                  </div>
                  <a
                    href={`tel:${helpline.number}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0 shadow-xs"
                  >
                    <Phone size={16} />
                  </a>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{helpline.desc}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-800/80 pt-2">
                  <span>{helpline.availability}</span>
                  <a href={`tel:${helpline.number}`} className="text-red-400 hover:underline">
                    {helpline.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SosDirectory;
