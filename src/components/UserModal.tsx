import React from 'react';
import { X, Check, Sparkles, User, Award, Shield, Sliders, LogOut } from 'lucide-react';
import { UserPersona } from '../types';
import { INITIAL_PERSONAS } from '../data/personas';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserPersona | null;
  onSelectPersona: (persona: UserPersona | null) => void;
  onOpenQuiz: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectPersona,
  onOpenQuiz
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAF7F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-rose-900 text-white flex items-center justify-center font-serif font-bold text-base">
              {currentUser ? currentUser.avatar : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {currentUser ? currentUser.name : 'Welcome to GlowHeavn'}
              </h2>
              <p className="text-xs text-stone-500">
                {currentUser ? currentUser.email : 'Sign in or switch beauty profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Persona Info Card */}
        {currentUser && (
          <div className="p-5 border-b border-stone-100 bg-rose-50/40">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-950 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                Active Beauty Profile
              </span>
              <span className="bg-rose-100/80 text-rose-900 px-2 py-0.5 rounded-full font-mono">
                {currentUser.tier} · {currentUser.rewardPoints} pts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 mt-2">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70">
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Skin Type</span>
                <span className="font-semibold text-stone-900">{currentUser.skinType}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70">
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Undertone</span>
                <span className="font-semibold text-stone-900">{currentUser.undertone}</span>
              </div>
            </div>

            <div className="mt-2 p-2.5 bg-white rounded-xl border border-stone-200/70 text-xs">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">Target Concerns</span>
              <div className="flex flex-wrap gap-1">
                {currentUser.concerns.map((c) => (
                  <span key={c} className="text-stone-800 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQuiz();
              }}
              className="mt-3 w-full py-2 px-3 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Retake Skin Quiz / Adjust Preferences</span>
            </button>
          </div>
        )}

        {/* Switch Persona Section */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Select or Switch Profile
            </span>
            <p className="text-xs text-stone-500 mt-0.5">
              Notice how the homepage recommendations and match percentages dynamically adapt to each beauty profile!
            </p>
          </div>

          <div className="space-y-2.5">
            {INITIAL_PERSONAS.map((persona) => {
              const isActive = currentUser?.id === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => {
                    onSelectPersona(persona);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-rose-900 bg-rose-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs border border-stone-200">
                      {persona.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {persona.name}
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {persona.skinType}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        Prefers: {persona.aestheticPreference} · {persona.concerns[0]}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-rose-900 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-rose-800 hover:underline">
                      Switch
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guest Mode Switch */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => {
                onSelectPersona(null);
                onClose();
              }}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Browse as Guest (Standard Catalog)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
