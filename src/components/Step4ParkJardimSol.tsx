import React, { useState } from 'react';
import { ArrowRight, Building2, ChevronLeft, DollarSign, Home, Key, Plus, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { ParkUnit } from '../types';
import { INITIAL_PARK_UNITS, INC_PROJECT_INFO } from '../data/jardimDoSolData';
import { formatBRL, parseBRLInput } from '../utils/formatters';

interface Step4ParkJardimSolProps {
  selectedUnit: ParkUnit | null;
  setSelectedUnit: (unit: ParkUnit | null) => void;
  valorImovel: number;
  setValorImovel: (val: number) => void;
  financiamentoCaixa: number;
  setFinanciamentoCaixa: (val: number) => void;
  subsidioCaixa: number;
  setSubsidioCaixa: (val: number) => void;
  fgts: number;
  setFgts: (val: number) => void;
  sinalAVista: number;
  setSinalAVista: (val: number) => void;
  availableUnits?: ParkUnit[];
  onNext: () => void;
  onBack: () => void;
}

export const Step4ParkJardimSol: React.FC<Step4ParkJardimSolProps> = ({
  selectedUnit,
  setSelectedUnit,
  valorImovel,
  setValorImovel,
  financiamentoCaixa,
  setFinanciamentoCaixa,
  subsidioCaixa,
  setSubsidioCaixa,
  fgts,
  setFgts,
  sinalAVista,
  setSinalAVista,
  availableUnits = INITIAL_PARK_UNITS,
  onNext,
  onBack,
}) => {
  const [displayImovel, setDisplayImovel] = useState<string>(
    valorImovel > 0 ? formatBRL(valorImovel) : ''
  );
  const [displayFgts, setDisplayFgts] = useState<string>(
    fgts > 0 ? formatBRL(fgts) : ''
  );
  const [displayFinanc, setDisplayFinanc] = useState<string>(
    financiamentoCaixa > 0 ? formatBRL(financiamentoCaixa) : ''
  );
  const [displaySubsidio, setDisplaySubsidio] = useState<string>(
    subsidioCaixa > 0 ? formatBRL(subsidioCaixa) : ''
  );
  const [displaySinal, setDisplaySinal] = useState<string>(
    sinalAVista > 0 ? formatBRL(sinalAVista) : ''
  );

  const [isCustomUnit, setIsCustomUnit] = useState<boolean>(!selectedUnit);

  const handleUnitSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setSelectedUnit(null);
      setIsCustomUnit(true);
      return;
    }

    const found = availableUnits.find((u) => u.id === val);
    if (found) {
      setSelectedUnit(found);
      setIsCustomUnit(false);
      setValorImovel(found.valorFinal);
      setDisplayImovel(formatBRL(found.valorFinal));
    }
  };

  const handleImovelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorImovel(numeric);
    setDisplayImovel(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handleFgtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setFgts(numeric);
    setDisplayFgts(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handleFinancChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setFinanciamentoCaixa(numeric);
    setDisplayFinanc(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handleSubsidioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setSubsidioCaixa(numeric);
    setDisplaySubsidio(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handleSinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setSinalAVista(numeric);
    setDisplaySinal(numeric > 0 ? formatBRL(numeric) : '');
  };

  // Calculated Total Entry Value before Sinal
  const entradaTotalCalculada = Math.max(
    0,
    valorImovel - financiamentoCaixa - subsidioCaixa - fgts
  );

  // Saldo devedor a parcelar em ate 108x apos o sinal
  const saldoDevedorAData = Math.max(0, entradaTotalCalculada - sinalAVista);

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
              Etapa 3 de 5
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              PARK JARDIM DO SOL
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
          {/* 1. Seleção de Unidade */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-teal-400" />
                Selecione a Unidade / Tipologia
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                Tabela de Feirão INC
              </span>
            </label>

            <select
              value={selectedUnit ? selectedUnit.id : 'custom'}
              onChange={handleUnitSelect}
              className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-medium text-sm rounded-2xl px-4 py-3 outline-none transition-all cursor-pointer"
            >
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.torre} - {u.unidade} ({u.tipologia}) - {formatBRL(u.valorFinal)}
                </option>
              ))}
              <option value="custom">-- Digitar valor de imóvel personalizado --</option>
            </select>
          </div>

          {/* Selected Unit Badge */}
          {selectedUnit && (
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">{selectedUnit.torre} - {selectedUnit.unidade}</span>
                <span className="text-slate-400">{selectedUnit.tipologia} • {selectedUnit.areaM2}m²</span>
              </div>
              <div className="text-right">
                {selectedUnit.descontoFeirao && selectedUnit.descontoFeirao > 0 && (
                  <span className="text-[10px] text-emerald-400 line-through block">
                    {formatBRL(selectedUnit.valorTabela)}
                  </span>
                )}
                <span className="text-sm font-black text-emerald-400">
                  {formatBRL(selectedUnit.valorFinal)}
                </span>
              </div>
            </div>
          )}

          {/* 2. Valor do Imóvel */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Valor do Imóvel (R$)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={displayImovel}
              onChange={handleImovelChange}
              placeholder="R$ 0,00"
              className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-black text-xl rounded-2xl px-4 py-3 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Grid: Financiamento & Subsídio (Auto-preenchidos da etapa anterior) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Financiamento CAIXA
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={displayFinanc}
                onChange={handleFinancChange}
                placeholder="R$ 0,00"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-emerald-400 font-bold text-base rounded-xl px-3 py-2.5 outline-none shadow-inner"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Ref. Tabela MCMV</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Subsídio MCMV
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={displaySubsidio}
                onChange={handleSubsidioChange}
                placeholder="R$ 0,00"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-teal-300 font-bold text-base rounded-xl px-3 py-2.5 outline-none shadow-inner"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Ref. Tabela MCMV</span>
            </div>
          </div>

          {/* 3. Grid FGTS & Sinal à Vista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  FGTS Utilizado
                </span>
                <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={displayFgts}
                onChange={handleFgtsChange}
                placeholder="R$ 0,00"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-bold text-base rounded-xl px-3 py-2.5 outline-none shadow-inner"
              />
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Sinal à Vista
                </span>
                <span className="text-[10px] text-slate-400 font-normal">(Dinheiro)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={displaySinal}
                onChange={handleSinalChange}
                placeholder="R$ 0,00 (Ex: PDF 40.000)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-emerald-300 font-bold text-base rounded-xl px-3 py-2.5 outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Calculated Entry Box */}
          <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 p-4.5 rounded-2xl border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  VALOR TOTAL DA ENTRADA INC (PRÓ-SOLUTO)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Imóvel - Financiamento - Subsídio - FGTS
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-white block">
                  {formatBRL(entradaTotalCalculada)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                  SALDO DEVEDOR A PARCELAR COM INC
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Total Entrada - Sinal à Vista ({sinalAVista > 0 ? formatBRL(sinalAVista) : 'Sem Sinal'})
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 block">
                  {formatBRL(saldoDevedorAData)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>SIMULAR PARCELAMENTO EM ATÉ 108X</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
