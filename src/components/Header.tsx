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
    <header className="bg-[#111111] text-white border-b border-[#2A2A2A] sticky top-0 z-30 shadow-md">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF600B] flex items-center justify-center text-white shadow-lg shadow-[#FF600B]/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white leading-none block">
              SIMULADOR MCMV
            </span>
            <p className="text-xs text-[#FF600B] font-bold leading-tight mt-0.5">
              INC EMPREENDIMENTOS
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenClientsModal}
            className="flex items-center gap-1.5 text-xs text-[#FF600B] bg-[#FF600B]/10 hover:bg-[#FF600B]/20 px-2.5 py-1.5 rounded-lg border border-[#FF600B]/30 font-bold transition-colors cursor-pointer"
            title="Clientes"
          >
            <Users className="w-3.5 h-3.5 text-[#FF600B]" />
            <span>Clientes</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#B5B5B5] hover:text-white bg-[#161616] hover:bg-[#2A2A2A] px-2.5 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Nova Simulação"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF600B]" />
            <span className="hidden sm:inline">Início</span>
          </button>
        </div>
      </div>
    </header>
  );
};
