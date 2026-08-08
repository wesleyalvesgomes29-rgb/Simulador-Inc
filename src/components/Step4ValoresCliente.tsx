import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, DollarSign, Wallet, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatBRL, parseBRLInput } from '../utils/formatters';

import { Empreendimento } from '../types';

interface Step4ValoresClienteProps {
  empreendimento?: Empreendimento;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  setFgts: (val: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4ValoresCliente: React.FC<Step4ValoresClienteProps> = ({
  empreendimento,
  valorImovel,
  financiamentoCaixa,
  subsidioCaixa,
  fgts,
  setFgts,
  onNext,
  onBack,
}) => {
  const [displayFgts, setDisplayFgts] = useState<string>(
    fgts > 0 ? formatBRL(fgts) : ''
  );

  const handleFgtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setFgts(numeric);
    setDisplayFgts(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handlePresetFgts = (val: number) => {
    setFgts(val);
    setDisplayFgts(formatBRL(val));
  };

  // Valor a pagar à INC (Entrada Total Pró-Soluto) = Imóvel - Financiamento - Subsídio - FGTS
  const valorAPagarInc = Math.max(0, valorImovel - financiamentoCaixa - subsidioCaixa - fgts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-xl">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Etapa 4 de 6 • VALORES DO CLIENTE
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              VALORES DA OPERAÇÃO
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Summary Grid of Imóvel, Financiamento & Subsídio */}
          <div className="space-y-3">
            {/* Valor do Imóvel */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Valor do Imóvel
                </span>
                <span className="text-xl font-black text-white">
                  {formatBRL(valorImovel)}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                {empreendimento?.nomeEmpreendimento || 'Empreendimento INC'}
              </span>
            </div>

            {/* Financiamento & Subsídio */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  Financiamento CAIXA
                </span>
                <span className="text-lg font-black text-white">
                  {formatBRL(financiamentoCaixa)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Aprovado Tabela MCMV
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block mb-1">
                  Subsídio MCMV
                </span>
                <span className="text-lg font-black text-white">
                  {subsidioCaixa > 0 ? formatBRL(subsidioCaixa) : 'R$ 0,00'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Desconto do Governo
                </span>
              </div>
            </div>
          </div>

          {/* FGTS Input Field */}
          <div className="bg-slate-950/90 p-4.5 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                FGTS do Cliente
              </span>
              <span className="text-[11px] text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={displayFgts}
              onChange={handleFgtsChange}
              placeholder="R$ 0,00"
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-black text-xl rounded-2xl px-4 py-3 outline-none transition-all shadow-inner"
            />

            {/* Quick Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Atalhos rápidos de FGTS:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 3000, 7500, 15000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetFgts(preset)}
                    className={`text-xs py-1.5 px-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      fgts === preset
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {preset === 0 ? 'Sem FGTS' : formatBRL(preset).replace(',00', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Highlighted Result Box: VALOR A PAGAR À INC */}
          <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 p-5 rounded-2xl border-2 border-emerald-400 shadow-2xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                VALOR A PAGAR À INC (ENTRADA PRÓ-SOLUTO)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                Resultado Oficial
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-black text-white tracking-tight">
                {formatBRL(valorAPagarInc)}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-medium pt-1 border-t border-slate-800/80">
              Valor do Imóvel ({formatBRL(valorImovel)}) − CAIXA ({formatBRL(financiamentoCaixa)}) − Subsídio ({formatBRL(subsidioCaixa)}) − FGTS ({formatBRL(fgts)})
            </p>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>CONTINUAR PARA O FLUXO INC</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
