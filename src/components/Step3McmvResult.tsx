import React from 'react';
import { ArrowRight, ChevronLeft, ShieldAlert, Sparkles, Building2, CheckCircle2, Award, Percent, DollarSign, Wallet, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { McmvSimulationResult } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';

interface Step3McmvResultProps {
  simulationResult: McmvSimulationResult;
  nomeCliente?: string;
  onNext: () => void;
  onBack: () => void;
  onEditClientData: () => void;
}

export const Step3McmvResult: React.FC<Step3McmvResultProps> = ({
  simulationResult,
  nomeCliente,
  onNext,
  onBack,
  onEditClientData,
}) => {
  const {
    income,
    temDependente,
    isCotista,
    financiamento,
    subsidio,
    parcela,
    taxaJuros,
    faixa,
    bracketMatched,
    enquadramentoNotice,
  } = simulationResult;

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
              Etapa 2 de 6 • DADOS MCMV
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              RESULTADO ESTIMADO CAIXA
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

        {/* Client Profile Summary Card */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Perfil Analisado {nomeCliente ? `• ${nomeCliente}` : ''}
            </span>
            <button
              type="button"
              onClick={onEditClientData}
              className="text-[11px] font-bold text-teal-400 hover:underline"
            >
              Editar Dados
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Renda</span>
              <span className="text-xs font-extrabold text-white">
                {formatBRL(income)}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Perfil</span>
              <span className="text-xs font-extrabold text-teal-400">
                {isCotista ? 'Cotista' : 'Não cotista'}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Dependente</span>
              <span className="text-xs font-extrabold text-white">
                {temDependente ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>

        {/* Enquadramento Notice if non-exact income */}
        {enquadramentoNotice && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl mb-6 flex items-start gap-2 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-tight">{enquadramentoNotice}</p>
          </div>
        )}

        {/* Values Found in MCMV Table */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Potencial Encontrado na Tabela MCMV
            </h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {faixa}
            </span>
          </div>

          {/* Financiamento Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-4 rounded-2xl border border-emerald-800/40 flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs text-emerald-400/90 font-bold uppercase tracking-wider block">
                Financiamento CAIXA
              </span>
              <span className="text-2xl font-black text-white">
                {formatBRL(financiamento)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Subsídio Card */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block mb-1">
                Subsídio MCMV
              </span>
              <span className="text-lg font-black text-white">
                {subsidio > 0 ? formatBRL(subsidio) : 'R$ 0,00'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {subsidio > 0 ? 'Desconto do Governo' : 'Sem subsídio p/ faixa'}
              </span>
            </div>

            {/* Parcela Estimada */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                Parcela Estimada
              </span>
              <span className="text-lg font-black text-white">
                {formatBRL(parcela)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Tabela PRICE
              </span>
            </div>
          </div>

          {/* Taxa de juros */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-teal-400" />
              Taxa de Juros Anual
            </span>
            <span className="font-extrabold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              {formatPercent(taxaJuros)} a.a.
            </span>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800/90 flex items-start gap-2.5 mb-6 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong className="text-slate-300">Aviso legal:</strong> Simulação aproximada. Os valores estão sujeitos à análise e aprovação cadastral e de crédito da CAIXA Econômica Federal.
          </p>
        </div>

        {/* Continue to Park Jardim do Sol Button */}
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm md:text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Building2 className="w-5 h-5 text-slate-950" />
          <span>CONTINUAR PARA O EMPREENDIMENTO</span>
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </button>
      </div>
    </motion.div>
  );
};
