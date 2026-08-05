import React from 'react';
import { ArrowRight, Building2, Calculator, ShieldCheck, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Step1InitialProps {
  nomeCliente: string;
  setNomeCliente: (val: string) => void;
  onStartSimulation: () => void;
}

export const Step1Initial: React.FC<Step1InitialProps> = ({
  nomeCliente,
  setNomeCliente,
  onStartSimulation,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6"
    >
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* INC Header Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Feirão Minha Casa, Minha Vida 2026</span>
        </div>

        {/* Development Header Visual */}
        <div className="flex items-center gap-3 mb-6 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Park Jardim do Sol
            </h2>
            <p className="text-xs text-emerald-400 font-medium">
              INC Empreendimentos • Uberlândia / MG
            </p>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-3">
            SIMULADOR MCMV
          </h1>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Simule o potencial de financiamento e monte o fluxo do seu imóvel.
          </p>
        </div>

        {/* Optional Client Name Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-400" />
            Nome do cliente <span className="text-slate-500 font-normal lowercase">(opcional)</span>
          </label>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Ex: João da Silva"
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-teal-400 text-white placeholder-slate-500 text-base rounded-2xl px-4 py-3.5 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Main CTA Button */}
        <button
          type="button"
          onClick={onStartSimulation}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <Calculator className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>NOVA SIMULAÇÃO</span>
          <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust Badges */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Atendimento rápido para corretores de imóveis</span>
        </div>
      </div>
    </motion.div>
  );
};
