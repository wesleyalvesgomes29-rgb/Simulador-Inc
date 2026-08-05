import React, { useState } from 'react';
import { ArrowRight, DollarSign, Users, Briefcase, ChevronLeft, User, Phone, Mail, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { formatBRL, parseBRLInput, formatPhoneMask, formatCpfMask } from '../utils/formatters';

interface Step2ClientDataProps {
  nomeCliente: string;
  setNomeCliente: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  cpf: string;
  setCpf: (val: string) => void;
  income: number;
  setIncome: (val: number) => void;
  temDependente: boolean;
  setTemDependente: (val: boolean) => void;
  isCotista: boolean;
  setIsCotista: (val: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const Step2ClientData: React.FC<Step2ClientDataProps> = ({
  nomeCliente,
  setNomeCliente,
  whatsapp,
  setWhatsapp,
  email,
  setEmail,
  cpf,
  setCpf,
  income,
  setIncome,
  temDependente,
  setTemDependente,
  isCotista,
  setIsCotista,
  onNext,
  onBack,
}) => {
  const [displayIncome, setDisplayIncome] = useState<string>(
    income > 0 ? formatBRL(income) : ''
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numericVal = parseBRLInput(rawVal);
    setIncome(numericVal);
    setDisplayIncome(numericVal > 0 ? formatBRL(numericVal) : '');
    if (numericVal >= 1400) {
      setErrorMsg('');
    }
  };

  const handlePresetIncome = (val: number) => {
    setIncome(val);
    setDisplayIncome(formatBRL(val));
    setErrorMsg('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhoneMask(e.target.value);
    setWhatsapp(masked);
    if (errorMsg) setErrorMsg('');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCpfMask(e.target.value);
    setCpf(masked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeCliente.trim()) {
      setErrorMsg('Por favor, informe o Nome do cliente.');
      return;
    }

    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um WhatsApp/Telefone válido com DDD.');
      return;
    }

    if (income < 1400) {
      setErrorMsg('Informe uma renda mínima válida a partir de R$ 1.400,00.');
      return;
    }

    setErrorMsg('');
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
              Etapa 1 de 6 • FEIRÃO MCMV
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              DADOS DO CLIENTE
            </h2>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Nome e WhatsApp (Obrigatórios) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Nome do Cliente */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-400" />
                  Nome do Cliente
                </span>
                <span className="text-[10px] text-teal-400 font-extrabold uppercase">
                  Obrigatório
                </span>
              </label>
              <input
                type="text"
                required
                value={nomeCliente}
                onChange={(e) => {
                  setNomeCliente(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ex: João Silva"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-bold text-sm rounded-2xl px-4 py-3 outline-none transition-all shadow-inner"
              />
            </div>

            {/* 2. WhatsApp / Telefone */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-teal-400" />
                  WhatsApp / Celular
                </span>
                <span className="text-[10px] text-teal-400 font-extrabold uppercase">
                  Obrigatório
                </span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={handlePhoneChange}
                placeholder="(34) 99999-9999"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-bold text-sm rounded-2xl px-4 py-3 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* E-mail e CPF (Opcionais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3. E-mail */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  E-mail
                </span>
                <span className="text-[10px] text-slate-500 font-normal lowercase">
                  (opcional)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-medium text-sm rounded-2xl px-4 py-2.5 outline-none transition-all shadow-inner"
              />
            </div>

            {/* 4. CPF */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  CPF do Cliente
                </span>
                <span className="text-[10px] text-slate-500 font-normal lowercase">
                  (opcional)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-medium text-sm rounded-2xl px-4 py-2.5 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-1 pt-3">
            <span className="text-[11px] font-black text-teal-400 uppercase tracking-wider block mb-3">
              DADOS PARA SIMULAÇÃO MCMV
            </span>
          </div>

          {/* 5. Renda Mensal */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Renda Mensal Bruta
              </span>
              <span className="text-[11px] text-slate-400 font-normal lowercase">
                (Ex: R$ 3.200,00)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={displayIncome}
                onChange={handleIncomeChange}
                placeholder="R$ 0,00"
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white font-black text-2xl rounded-2xl px-4 py-3.5 outline-none transition-all shadow-inner"
              />
            </div>

            {/* Quick Presets for Fair Broker Speed */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Atalhos de renda rápida (Feirão):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[2200, 2800, 3500, 4800].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetIncome(preset)}
                    className={`text-xs py-1.5 px-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      income === preset
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {formatBRL(preset).replace(',00', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Possui dependente? */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" />
              Possui dependente?
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Filho, cônjuge ou parente comprovado como dependente financeiro.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemDependente(true)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  temDependente
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                SIM
              </button>
              <button
                type="button"
                onClick={() => setTemDependente(false)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !temDependente
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                NÃO
              </button>
            </div>
          </div>

          {/* 7. Possui mais de 36 meses de contribuição ao FGTS? */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-teal-400" />
                Mais de 36 meses no FGTS?
              </label>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold uppercase">
                {isCotista ? 'COTISTA' : 'NÃO COTISTA'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Possui ao menos 3 anos de trabalho com carteira assinada (soma de todos os empregos)?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCotista(true)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCotista
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-950/40 ring-2 ring-teal-400/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span>SIM</span>
                <span className="text-[10px] opacity-80">(COTISTA)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCotista(false)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isCotista
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-950/40 ring-2 ring-teal-400/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span>NÃO</span>
                <span className="text-[10px] opacity-80">(NÃO COTISTA)</span>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>CONSULTAR TABELA MCMV</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
