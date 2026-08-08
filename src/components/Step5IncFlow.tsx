import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  DollarSign, 
  Info, 
  Plus, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2,
  Calculator,
  MinusCircle,
  PlusCircle,
  Equal
} from 'lucide-react';
import { motion } from 'motion/react';
import { IntermediariaItem, Empreendimento } from '../types';
import { INC_PROJECT_INFO } from '../data/jardimDoSolData';
import { formatBRL, parseBRLInput } from '../utils/formatters';

interface Step5IncFlowProps {
  empreendimento: Empreendimento;
  valorEntradaTotal: number;
  sinalAVista: number;
  setSinalAVista: (val: number) => void;
  numParcelasEntrada: number;
  setNumParcelasEntrada: (val: number) => void;
  usarIntermediarias: boolean;
  setUsarIntermediarias: (val: boolean) => void;
  intermediarias: IntermediariaItem[];
  setIntermediarias: React.Dispatch<React.SetStateAction<IntermediariaItem[]>>;
  onNext: () => void;
  onBack: () => void;
}

export const Step5IncFlow: React.FC<Step5IncFlowProps> = ({
  empreendimento,
  valorEntradaTotal,
  sinalAVista,
  setSinalAVista,
  numParcelasEntrada,
  setNumParcelasEntrada,
  usarIntermediarias,
  setUsarIntermediarias,
  intermediarias,
  setIntermediarias,
  onNext,
  onBack,
}) => {
  // Mode State: 'padrao' (PDF Reference) vs 'personalizado'
  const [modoFluxo, setModoFluxo] = useState<'padrao' | 'personalizado'>('padrao');

  // Input string display state for Sinal to allow smooth typing
  const [displaySinalInput, setDisplaySinalInput] = useState<string>(
    sinalAVista > 0 ? formatBRL(sinalAVista) : ''
  );

  // Dynamic limits from chosen Empreendimento
  const limitObra = empreendimento.qtdParcelasObra ?? 30;
  const limitPosObra = empreendimento.qtdParcelasPosObra ?? 78;
  const maxTotal = empreendimento.maxParcelasEntrada || (limitObra + limitPosObra);

  // Preset installment options based on empreendimento maxTotal and limitObra
  const baseOptions = [12, limitObra, 24, 36, 48, 60, 72, 84, 96, 108, maxTotal];
  const PARCELA_OPTIONS = Array.from(new Set(baseOptions.filter(n => n <= maxTotal))).sort((a, b) => a - b);

  // Load Official PDF Reference Presets
  const handleUsarFluxoPadrao = () => {
    setModoFluxo('padrao');
    const isEspanha = empreendimento.id === 'park-espanha';

    if (isEspanha) {
      setSinalAVista(0);
      setDisplaySinalInput(formatBRL(0));
      setNumParcelasEntrada(maxTotal);
      setUsarIntermediarias(true);

      const espanhaIntermediarias: IntermediariaItem[] = [
        { id: 'int-1', mes: 12, rotulo: '12º mês (Obra)', valor: 2000, fase: 'obra' },
        { id: 'int-2', mes: 24, rotulo: '24º mês (Pós-Obra)', valor: 2000, fase: 'pos_obra' },
        { id: 'int-3', mes: 36, rotulo: '36º mês (Pós-Obra)', valor: 2000, fase: 'pos_obra' },
        { id: 'int-4', mes: 48, rotulo: '48º mês (Pós-Obra)', valor: 2000, fase: 'pos_obra' },
      ];
      setIntermediarias(espanhaIntermediarias);
    } else {
      setSinalAVista(40000);
      setDisplaySinalInput(formatBRL(40000));
      setNumParcelasEntrada(maxTotal);
      setUsarIntermediarias(true);

      const pdfIntermediarias: IntermediariaItem[] = [
        { id: 'int-2026', mes: 12, data: '12/20/2026', rotulo: '12º mês (12/2026)', valor: 2000, fase: 'obra' },
        { id: 'int-2027', mes: 24, data: '12/20/2027', rotulo: '24º mês (12/2027)', valor: 2000, fase: 'obra' },
        { id: 'int-2028', mes: 36, data: '12/20/2028', rotulo: '36º mês (12/2028)', valor: 2000, fase: 'obra' },
        { id: 'int-2029', mes: 48, data: '12/20/2029', rotulo: '48º mês (12/2029)', valor: 2000, fase: 'obra' },
        { id: 'int-2030', mes: 60, data: '12/20/2030', rotulo: '60º mês (12/2030)', valor: 2000, fase: 'pos_obra' },
        { id: 'int-2031', mes: 72, data: '12/20/2031', rotulo: '72º mês (12/2031)', valor: 2000, fase: 'pos_obra' },
      ];
      setIntermediarias(pdfIntermediarias);
    }
  };

  const handlePersonalizarFluxo = () => {
    setModoFluxo('personalizado');
  };

  const handleSinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setSinalAVista(numeric);
    setDisplaySinalInput(numeric > 0 ? formatBRL(numeric) : '');
    setModoFluxo('personalizado');
  };

  // Intermediate Payments Sum
  const somaIntermediarias = usarIntermediarias
    ? intermediarias.reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  // Split Intermediarias between Obra (mes <= limitObra) and Pós-Obra (mes > limitObra)
  const somaInterObra = usarIntermediarias
    ? intermediarias.filter(i => i.mes <= limitObra || i.fase === 'obra').reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const somaInterPosObra = usarIntermediarias
    ? intermediarias.filter(i => i.mes > limitObra || i.fase === 'pos_obra').reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  // MATHEMATICAL VALIDATION
  const saldoApenasComSinal = Math.max(0, valorEntradaTotal - sinalAVista);
  const saldoFinalAParcelar = Math.max(0, valorEntradaTotal - sinalAVista - somaIntermediarias);

  // Split calculations based on empreendimento configuration
  const qtdObra = Math.min(numParcelasEntrada, limitObra);
  const qtdPosObra = Math.max(0, Math.min(limitPosObra, numParcelasEntrada - limitObra));

  // Split proportions
  const ratioObra = (numParcelasEntrada === 108 && empreendimento.id === 'park-jardim-do-sol')
    ? 0.52194
    : numParcelasEntrada > 0 ? (qtdObra / numParcelasEntrada) : 0;

  const ratioPosObra = (numParcelasEntrada === 108 && empreendimento.id === 'park-jardim-do-sol')
    ? 0.47806
    : numParcelasEntrada > 0 ? (qtdPosObra / numParcelasEntrada) : 0;

  const saldoBaseObra = saldoApenasComSinal * ratioObra;
  const saldoBasePosObra = saldoApenasComSinal * ratioPosObra;

  const valorParcelaObra = qtdObra > 0
    ? Math.max(0, saldoBaseObra - somaInterObra) / qtdObra
    : 0;

  const valorParcelaPosObra = qtdPosObra > 0
    ? Math.max(0, saldoBasePosObra - somaInterPosObra) / qtdPosObra
    : 0;

  const valorParcelaUnica = numParcelasEntrada > 0
    ? Math.max(0, saldoFinalAParcelar) / numParcelasEntrada
    : 0;

  // Intermediária Handlers
  const handleUpdateIntermediaria = (id: string, field: 'mes' | 'valor' | 'rotulo', value: any) => {
    setModoFluxo('personalizado');
    setIntermediarias((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'mes') {
            const mesNum = Number(value) || 12;
            updated.mes = mesNum;
            updated.rotulo = `${mesNum}º mês`;
            updated.fase = mesNum > limitObra ? 'pos_obra' : 'obra';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddIntermediaria = () => {
    setModoFluxo('personalizado');
    setUsarIntermediarias(true);

    const nextCount = intermediarias.length + 1;
    const nextMes = nextCount * 12;
    const isPos = nextMes > limitObra;

    const newItem: IntermediariaItem = {
      id: `int-custom-${Date.now()}`,
      mes: nextMes,
      rotulo: `${nextMes}º mês`,
      valor: 2000,
      fase: isPos ? 'pos_obra' : 'obra',
    };
    setIntermediarias((prev) => [...prev, newItem]);
  };

  const handleRemoveIntermediaria = (id: string) => {
    setModoFluxo('personalizado');
    setIntermediarias((prev) => prev.filter((item) => item.id !== id));
  };

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
              Etapa 5 de 6 • FLUXO INC
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              SIMULADOR DE FLUXO INC
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

        {/* 1. SELEÇÃO DE MODO: FLUXO PADRÃO DO PDF vs PERSONALIZAR FLUXO */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={handleUsarFluxoPadrao}
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modoFluxo === 'padrao'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span>USAR FLUXO PADRÃO (PDF)</span>
          </button>

          <button
            type="button"
            onClick={handlePersonalizarFluxo}
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modoFluxo === 'personalizado'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950/40 ring-1 ring-teal-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 flex-shrink-0" />
            <span>PERSONALIZAR FLUXO</span>
          </button>
        </div>

        {/* Status Badge */}
        {modoFluxo === 'padrao' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl mb-6 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Fluxo Padrão do PDF INC ativo:</strong> Sinal R$ 40k + 108 Parcelas + 6 Intermediárias Anuais.
            </span>
          </div>
        ) : (
          <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl mb-6 flex items-center gap-2 text-xs text-teal-300">
            <Sliders className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              <strong>Modo Personalizado Ativo:</strong> Ajuste o sinal, prazos e intermediárias conforme a necessidade do seu cliente.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2. VALIDAÇÃO MATEMÁTICA DO SALDO A PARCELAR */}
          <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-teal-400" />
              CÁLCULO DO SALDO A PARCELAR COM A INC
            </h3>

            <div className="space-y-2 text-xs">
              {/* Valor Total da Entrada (Pró-Soluto) */}
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Valor Total que precisa ser pago à INC:
                </span>
                <span className="text-white text-sm font-black">
                  {formatBRL(valorEntradaTotal)}
                </span>
              </div>

              {/* Input for Sinal à vista */}
              <div className="flex items-center justify-between py-1 border-t border-slate-900/80">
                <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                  <MinusCircle className="w-3.5 h-3.5 text-amber-400" />
                  (-) Sinal / Entrada Inicial (Dinheiro):
                </span>
                <div className="w-36">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displaySinalInput}
                    onChange={handleSinalChange}
                    placeholder="R$ 0,00"
                    className="w-full bg-slate-900 border border-amber-500/40 text-amber-300 font-extrabold text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-400 text-right shadow-inner"
                  />
                </div>
              </div>

              {/* Subtotal after Sinal */}
              {usarIntermediarias && somaIntermediarias > 0 && (
                <div className="flex items-center justify-between py-1 text-slate-400 border-t border-slate-900/80">
                  <span className="flex items-center gap-1.5 font-bold">
                    <MinusCircle className="w-3.5 h-3.5 text-teal-400" />
                    (-) Soma das Intermediárias ({intermediarias.length}x):
                  </span>
                  <span className="font-bold text-teal-300">
                    {formatBRL(somaIntermediarias)}
                  </span>
                </div>
              )}

              {/* EQUAL: Saldo Final a Parcelar */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Equal className="w-4 h-4 text-emerald-400" />
                  (=) SALDO A PARCELAR EM MENSAIS:
                </span>
                <span className="text-xl font-black text-emerald-400">
                  {formatBRL(saldoFinalAParcelar)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. PARCELAMENTO MENSAL (ATÉ {maxTotal}X) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                Quantidade de Parcelas da Entrada (Até {maxTotal}x)
              </label>
              <div className="flex items-center gap-1.5 bg-slate-950 border border-emerald-500/40 px-2 py-1 rounded-xl">
                <input
                  type="number"
                  min="1"
                  max={maxTotal}
                  value={numParcelasEntrada || ''}
                  onChange={(e) => {
                    const val = Math.min(maxTotal, Math.max(1, Number(e.target.value) || 1));
                    setNumParcelasEntrada(val);
                    setModoFluxo('personalizado');
                  }}
                  className="w-14 bg-transparent text-right font-black text-emerald-400 text-sm outline-none"
                />
                <span className="text-xs font-extrabold text-slate-400">x</span>
              </div>
            </div>

            {/* Quick Button Selector */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {PARCELA_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setNumParcelasEntrada(opt);
                    setModoFluxo('personalizado');
                  }}
                  className={`py-2 px-1.5 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    numParcelasEntrada === opt
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {opt}x
                </button>
              ))}
            </div>

            {/* Range Slider for Granular Adjustment */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <input
                type="range"
                min="12"
                max={maxTotal}
                step="1"
                value={numParcelasEntrada}
                onChange={(e) => {
                  setNumParcelasEntrada(Number(e.target.value));
                  setModoFluxo('personalizado');
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                <span>12x</span>
                <span>{limitObra}x (Obra)</span>
                <span>{maxTotal}x (Máximo)</span>
              </div>
            </div>
          </div>

          {/* 4. SEÇÃO DE INTERMEDIÁRIAS REPETÍVEIS DA INC */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Intermediárias / Balões Anuais
                </span>
                <span className="text-[11px] text-slate-400">
                  Reforços configuráveis na Obra e Pós-Obra
                </span>
              </div>

              {/* Toggle Intermediarias */}
              <button
                type="button"
                onClick={() => {
                  const next = !usarIntermediarias;
                  setUsarIntermediarias(next);
                  setModoFluxo('personalizado');
                  if (next && intermediarias.length === 0) {
                    handleAddIntermediaria();
                  }
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  usarIntermediarias ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    usarIntermediarias ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* List of Configured Intermediarias */}
            {usarIntermediarias && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                {intermediarias.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5"
                  >
                    {/* Period Selector */}
                    <div className="w-1/2">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">
                        Período / Mês
                      </label>
                      <select
                        value={item.mes}
                        onChange={(e) =>
                          handleUpdateIntermediaria(item.id, 'mes', Number(e.target.value))
                        }
                        className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-lg px-2 py-1.5 outline-none focus:border-teal-400"
                      >
                        {[12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108].filter(m => m <= maxTotal).map(
                          (m) => (
                            <option key={m} value={m}>
                              {m}º Mês {m <= limitObra ? '(Obra)' : '(Pós-Obra)'}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Value Input */}
                    <div className="w-1/2">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">
                        Valor (R$)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.valor > 0 ? formatBRL(item.valor) : ''}
                          onChange={(e) => {
                            const val = parseBRLInput(e.target.value);
                            handleUpdateIntermediaria(item.id, 'valor', val);
                          }}
                          placeholder="R$ 0,00"
                          className="w-full bg-slate-950 border border-slate-700 text-teal-300 font-bold text-xs rounded-lg px-2 py-1.5 outline-none focus:border-teal-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveIntermediaria(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remover intermediária"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ADD INTERMEDIARIA BUTTON (+ ADICIONAR INTERMEDIÁRIA) */}
                <button
                  type="button"
                  onClick={handleAddIntermediaria}
                  className="w-full py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-dashed border-teal-500/50 text-teal-300 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>+ ADICIONAR INTERMEDIÁRIA</span>
                </button>

                {/* Total Intermediarias Summary */}
                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-800 text-slate-300">
                  <span>Soma das Intermediárias:</span>
                  <span className="text-teal-300 font-black text-sm">
                    {formatBRL(somaIntermediarias)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 5. VISUAL SEPARATION: PARCELAS DURANTE A OBRA x PARCELAS PÓS-OBRA */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-5 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                RESULTADO DO PARCELAMENTO MENSAL
              </span>
              <span className="text-xs font-black text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded-md">
                Total {numParcelasEntrada} Parcelas
              </span>
            </div>

            {qtdPosObra > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Obra Installments */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/40">
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    PARCELAS DURANTE A OBRA ({qtdObra}x)
                  </span>
                  <span className="text-2xl font-black text-white block my-1">
                    {formatBRL(valorParcelaObra)}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 font-semibold block">
                    📌 Correção: INCC
                  </span>
                </div>

                {/* Pós-Obra Installments */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-teal-500/40">
                  <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider block">
                    PARCELAS PÓS-OBRA ({qtdPosObra}x)
                  </span>
                  <span className="text-2xl font-black text-white block my-1">
                    {formatBRL(valorParcelaPosObra)}
                  </span>
                  <span className="text-[10px] text-teal-300/80 font-semibold block">
                    📌 Correção: IPCA + 1,99% a.a.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/40">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  PARCELAS DURANTE A OBRA ({numParcelasEntrada}x)
                </span>
                <span className="text-3xl font-black text-white block my-1">
                  {formatBRL(valorParcelaUnica)}
                </span>
                <span className="text-[10px] text-emerald-300/80 font-semibold block">
                  📌 Correção: INCC
                </span>
              </div>
            )}
          </div>

          {/* 6. CORREÇÕES E REGRAS DO PDF (TRANSPARENTE AO CORRETOR) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Info className="w-4 h-4 text-teal-400" />
              Regras de Reajuste e Condições do Empreendimento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Durante a Obra:</span>
                <span className="text-xs font-black text-emerald-400">Correção pelo INCC</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Pós-Obra (Chaves):</span>
                <span className="text-xs font-black text-teal-400">IPCA + 1,99% ao ano</span>
              </div>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <p>• <strong>Documentação (Registro + ITBI):</strong> R$ 6.800,00 parcelado em até 36x de R$ 188,89 + Tarifa R$ 1.000,00.</p>
              <p>• <strong>Fiador:</strong> Obrigatoriedade de fiador com CPF regular e renda comprovada.</p>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>VER PROPOSTA GERADA</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
