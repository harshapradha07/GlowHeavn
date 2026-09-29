import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SkinType, UserPersona } from '../types';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserPersona | null;
  onSaveProfile: (updatedPersona: UserPersona) => void;
}

const SKIN_TYPES: SkinType[] = ['Dry', 'Oily', 'Sensitive', 'Combination', 'Normal'];

const CONCERN_OPTIONS = [
  'Dullness & Glow',
  'Hydration',
  'Acne & Blemishes',
  'Fine Lines',
  'Pores & Texture',
  'Redness & Irritation',
  'Uneven Tone',
  'Sun Protection'
];

const AESTHETIC_OPTIONS = [
  'Glass Skin & Dewy',
  'Velvet Glam & Bold',
  'French Minimalist',
  'Clean Clinical'
];

export const SkinQuizModal: React.FC<SkinQuizModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentUser?.name || 'Harsha');
  const [skinType, setSkinType] = useState<SkinType>(currentUser?.skinType || 'Combination');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    currentUser?.concerns || ['Dullness & Glow', 'Hydration']
  );
  const [aesthetic, setAesthetic] = useState(currentUser?.aestheticPreference || 'Glass Skin & Dewy');

  if (!isOpen) return null;

  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      if (selectedConcerns.length > 1) {
        setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
      }
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleSave = () => {
    const updated: UserPersona = {
      id: currentUser?.id || 'custom-user',
      name: name.trim() || 'Beauty Connoisseur',
      email: currentUser?.email || 'user@glowheavn.com',
      avatar: name.trim().slice(0, 2).toUpperCase() || 'GH',
      skinType,
      undertone: currentUser?.undertone || 'Warm Golden',
      concerns: selectedConcerns,
      aestheticPreference: aesthetic,
      rewardPoints: currentUser?.rewardPoints || 1000,
      tier: currentUser?.tier || 'Rose Gold Muse'
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAF7F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-800" />
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Personalize Your Beauty Profile
              </h2>
              <p className="text-xs text-stone-500">
                GlowHeavn re-ranks all formulas based on your exact dermal needs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Harsha"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white"
            />
          </div>

          {/* Skin Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. What is your skin type?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSkinType(type)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                    skinType === type
                      ? 'border-rose-900 bg-rose-50/70 text-rose-950 ring-2 ring-rose-900/10'
                      : 'border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{type}</span>
                  {skinType === type && <Check className="w-3.5 h-3.5 text-rose-900" />}
                </button>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Target Skin Concerns (Select all that apply)
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {selectedConcerns.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CONCERN_OPTIONS.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-rose-900 bg-rose-900 text-white font-semibold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <span>{concern}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desired Finish / Aesthetic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              3. What beauty aesthetic do you love most?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AESTHETIC_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAesthetic(opt)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                    aesthetic === opt
                      ? 'border-rose-900 bg-rose-50/70 text-rose-950 ring-2 ring-rose-900/10'
                      : 'border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{opt}</span>
                  {aesthetic === opt && <Check className="w-3.5 h-3.5 text-rose-900" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Update Personal Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
