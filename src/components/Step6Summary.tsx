import React, { useState } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Edit3, 
  MessageSquare, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Wallet, 
  Home, 
  Info,
  Copy,
  Check,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { McmvSimulationResult, ParkUnit, IntermediariaItem } from '../types';
import { formatBRL, openWhatsApp, buildWhatsAppText, copyToClipboard } from '../utils/formatters';
import { generateCrmText, ClientLead } from '../utils/clientStorage';
import { INC_PROJECT_INFO } from '../data/jardimDoSolData';

interface Step6SummaryProps {
  nomeCliente: string;
  whatsapp?: string;
  email?: string;
  cpf?: string;
  simulationResult: McmvSimulationResult;
  selectedUnit: ParkUnit | null;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  numParcelasEntrada: number;
  usarIntermediarias: boolean;
  intermediarias: IntermediariaItem[];
  onBack: () => void;
  onEditStep: (step: 'dados_cliente' | 'escolha_imovel' | 'valores_cliente' | 'fluxo_inc') => void;
  onNewSimulation: () => void;
}

export const Step6Summary: React.FC<Step6SummaryProps> = ({
  nomeCliente,
  whatsapp = '',
  email = '',
  cpf = '',
  simulationResult,
  selectedUnit,
  valorImovel,
  financiamentoCaixa,
  subsidioCaixa,
  fgts,
  sinalAVista,
  numParcelasEntrada,
  usarIntermediarias,
  intermediarias,
  onBack,
  onEditStep,
  onNewSimulation,
}) => {
  const { income, temDependente, isCotista, parcela } = simulationResult;
  const [copied, setCopied] = useState<boolean>(false);

  // Entrada Total calculation before Sinal
  const entradaTotalCalculada = Math.max(
    0,
    valorImovel - financiamentoCaixa - subsidioCaixa - fgts
  );

  // Intermediarias sum
  const somaInterObra = usarIntermediarias
    ? intermediarias.filter(i => (i.mes <= 30 || i.fase === 'obra')).reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const somaInterPosObra = usarIntermediarias
    ? intermediarias.filter(i => (i.mes > 30 || i.fase === 'pos_obra')).reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const somaIntermediarias = somaInterObra + somaInterPosObra;

  // Remaining Entry balance after Sinal and Intermediarias
  const saldoApenasComSinal = Math.max(0, entradaTotalCalculada - sinalAVista);
  const saldoFinalAParcelar = Math.max(0, entradaTotalCalculada - sinalAVista - somaIntermediarias);

  // Split calculations for 108x (30 Obra + 78 Pós-Obra)
  const qtdObra = Math.min(numParcelasEntrada, 30);
  const qtdPosObra = Math.max(0, numParcelasEntrada - 30);

  const ratioObra = numParcelasEntrada === 108
    ? 0.52194
    : numParcelasEntrada > 0 ? (qtdObra / numParcelasEntrada) : 0;

  const ratioPosObra = numParcelasEntrada === 108
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

  const handleShareWhatsApp = () => {
    const message = buildWhatsAppText({
      nomeCliente,
      valorImovel,
      financiamentoCaixa,
      subsidio: subsidioCaixa,
      fgts,
      sinalAVista,
      entradaTotal: entradaTotalCalculada,
      numParcelasEntrada,
      parcelaObra: { qtd: qtdObra, valor: valorParcelaObra },
      parcelaPosObra: { qtd: qtdPosObra, valor: valorParcelaPosObra },
      valorParcelaEntrada: valorParcelaObra > 0 ? valorParcelaObra : valorParcelaUnica,
      intermediarias: usarIntermediarias
        ? intermediarias.map((i) => ({ rotulo: i.rotulo, valor: i.valor, data: i.data }))
        : [],
      incluirDocumentacao: true,
    });
    openWhatsApp(message);
  };

  const handleCopyCrmData = async () => {
    const leadObj: ClientLead = {
      id: 'current',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      nome: nomeCliente,
      whatsapp,
      email,
      cpf,
      renda: income,
      temDependente,
      isCotista,
      selectedUnit,
      valorImovel,
      financiamentoCaixa,
      subsidioCaixa,
      fgts,
      sinalAVista,
      numParcelasEntrada,
      usarIntermediarias,
      valorEntradaInc: entradaTotalCalculada,
      status: 'Proposta Gerada'
    };

    const text = generateCrmText(leadObj);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 -mx-5 -mt-5 md:-mx-7 md:-mt-7 p-5 mb-6 text-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-950/80">
                PROPOSTA DE COMPRA INC
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-slate-950">
              PARK JARDIM DO SOL
            </h1>
            <p className="text-xs font-bold text-slate-900/90 mt-1">
              Simulador Oficial de Propostas • INC Empreendimentos
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* 1. SEÇÃO CLIENTE */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 mb-5 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-400" />
              CLIENTE {nomeCliente ? `• ${nomeCliente}` : ''}
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('dados_cliente')}
              className="text-[11px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {(whatsapp || email || cpf) && (
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 border-b border-slate-800/60 pb-2.5">
              {whatsapp && (
                <span className="flex items-center gap-1 font-bold text-teal-300">
                  <Phone className="w-3.5 h-3.5 text-teal-400" /> {whatsapp}
                </span>
              )}
              {cpf && (
                <span className="flex items-center gap-1 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> CPF: {cpf}
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1 text-slate-400 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {email}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Renda</span>
              <span className="text-xs font-black text-white">{formatBRL(income)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Perfil</span>
              <span className="text-xs font-black text-teal-400">
                {isCotista ? 'Cotista' : 'Não Cotista'}
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Dependente</span>
              <span className="text-xs font-black text-white">
                {temDependente ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO PARK JARDIM DO SOL */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-400" />
              DETALHES DO IMÓVEL & FINANCIAMENTO CAIXA
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('escolha_imovel')}
              className="text-[11px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {selectedUnit && (
            <div className="mb-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Unidade {selectedUnit.unidade}</span>
                <span className="text-slate-400">
                  {selectedUnit.tipologia} • {selectedUnit.areaM2} m² • Vaga {selectedUnit.vagas}
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                Valor de Venda: {formatBRL(selectedUnit.valorVenda || valorImovel)}
              </span>
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Valor do Imóvel:</span>
              <span className="font-extrabold text-white">{formatBRL(valorImovel)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Financiamento CAIXA:</span>
              <span className="font-bold text-emerald-400">{formatBRL(financiamentoCaixa)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Subsídio MCMV:</span>
              <span className="font-bold text-teal-300">
                {subsidioCaixa > 0 ? formatBRL(subsidioCaixa) : 'R$ 0,00'}
              </span>
            </div>
            {fgts > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">FGTS Utilizado:</span>
                <span className="font-bold text-amber-300">{formatBRL(fgts)}</span>
              </div>
            )}
            {sinalAVista > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Sinal à Vista (Dinheiro):</span>
                <span className="font-bold text-emerald-300">{formatBRL(sinalAVista)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. SEÇÃO FLUXO INC ({numParcelasEntrada}X) */}
        <div className="bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-950 rounded-2xl p-4 border border-emerald-500/30 mb-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              VALOR PAGO À INC ({numParcelasEntrada}X)
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('fluxo_inc')}
              className="text-[11px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {/* Mathematical Breakdown Card */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 mb-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Valor Total Pró-Soluto à INC:</span>
              <span className="text-white font-extrabold">{formatBRL(entradaTotalCalculada)}</span>
            </div>

            {sinalAVista > 0 && (
              <div className="flex justify-between items-center text-amber-300">
                <span>(-) Sinal / Entrada Inicial:</span>
                <span className="font-bold">{formatBRL(sinalAVista)}</span>
              </div>
            )}

            {somaIntermediarias > 0 && (
              <div className="flex justify-between items-center text-teal-300">
                <span>(-) Soma das Intermediárias ({intermediarias.length}x):</span>
                <span className="font-bold">{formatBRL(somaIntermediarias)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-black">
              <span className="text-emerald-400 uppercase">(=) Saldo a Parcelar em Mensais:</span>
              <span className="text-emerald-400 text-base">{formatBRL(saldoFinalAParcelar)}</span>
            </div>
          </div>

          {/* Obra & Pós-Obra Installment Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                DURANTE A OBRA ({qtdObra}x)
              </span>
              <span className="text-lg font-black text-white block my-0.5">
                {formatBRL(valorParcelaObra)}
              </span>
              <span className="text-[10px] text-slate-400">Reajuste: INCC</span>
            </div>

            {qtdPosObra > 0 && (
              <div className="bg-slate-900 p-3 rounded-xl border border-teal-500/30">
                <span className="text-[10px] font-bold text-teal-400 uppercase block">
                  PÓS-OBRA ({qtdPosObra}x)
                </span>
                <span className="text-lg font-black text-white block my-0.5">
                  {formatBRL(valorParcelaPosObra)}
                </span>
                <span className="text-[10px] text-slate-400">Reajuste: IPCA + 1,99% a.a.</span>
              </div>
            )}
          </div>

          {/* Intermediarias list if enabled */}
          {usarIntermediarias && intermediarias.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-300 block mb-2">
                INTERMEDIÁRIAS ANUAIS CONFIGURADAS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {intermediarias.map((inter) => (
                  <div
                    key={inter.id}
                    className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-400 font-medium">{inter.rotulo}:</span>
                    <span className="font-extrabold text-teal-300">{formatBRL(inter.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. DOCUMENTAÇÃO ITBI / REGISTRO */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 mb-5 text-xs space-y-2">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              DOCUMENTAÇÃO (REGISTRO + ITBI)
            </span>
            <span className="text-emerald-400 font-bold">R$ 6.800,00</span>
          </h3>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Parcelamento Documentação:</span>
            <span className="font-bold text-white">36x de R$ 188,89</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 pt-1">
            <span>Tarifa Bancária CAIXA:</span>
            <span className="font-bold text-white">R$ 1.000,00</span>
          </div>
        </div>

        {/* 5. SEÇÃO PÓS-OBRA & OBSERVAÇÕES OFICIAIS */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 mb-6 text-xs space-y-2">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-amber-400" />
            CONDIÇÕES OFICIAIS INC & AVISOS LEGAIS
          </h3>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center mb-2">
            <span className="text-slate-400 font-medium">Parcela Estimada CAIXA:</span>
            <span className="font-black text-white text-sm">{formatBRL(parcela)} / mês</span>
          </div>

          <div className="text-slate-400 space-y-1 text-[11px] leading-relaxed">
            <p>• <strong>Fiador:</strong> Obrigatório fiador com CPF regular e renda comprovada.</p>
            <p>• <strong>Correção durante a obra:</strong> Reajuste mensal pelo INCC.</p>
            <p>• <strong>Pós-obra (Após as chaves):</strong> Correção pelo IPCA + 1,99% a.a.</p>
            <p>• <strong>Aviso CAIXA:</strong> Simulação aproximada, sujeita à análise e aprovação da CAIXA.</p>
          </div>
        </div>

        {/* ACTION BUTTONS: WHATSAPP & COPY CRM */}
        <div className="space-y-3 mb-4">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span>ENVIAR PELO WHATSAPP</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCrmData}
            className={`w-full font-bold text-sm py-3 px-5 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                : 'bg-slate-800 hover:bg-slate-750 text-teal-300 border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>DADOS COPIADOS PARA O CRM!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-teal-400" />
                <span>COPIAR DADOS PARA O CRM</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Navigation Row */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={onNewSimulation}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nova Simulação</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
