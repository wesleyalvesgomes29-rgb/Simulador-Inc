import React from 'react';
import { Building2, RotateCcw, Table, Users } from 'lucide-react';
import { AppStep } from '../types';

interface HeaderProps {
  currentStep: AppStep;
  onReset: () => void;
  onOpenTableModal?: () => void;
  onOpenClientsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onReset,
  onOpenClientsModal,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white leading-none block">
              SIMULADOR MCMV
            </span>
            <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">
              INC
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenClientsModal}
            className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 font-bold transition-colors cursor-pointer"
            title="Clientes"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clientes</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Nova Simulação"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Início</span>
          </button>
        </div>
      </div>
    </header>
  );
};
