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
import { McmvSimulationResult, ParkUnit, IntermediariaItem, Empreendimento } from '../types';
import { formatBRL, openWhatsApp, buildWhatsAppText, copyToClipboard } from '../utils/formatters';
import { generateCrmText, ClientLead } from '../utils/clientStorage';
import { generateProposalPdf } from '../utils/pdfGenerator';
import { FileDown } from 'lucide-react';

interface Step6SummaryProps {
  nomeCliente: string;
  whatsapp?: string;
  email?: string;
  cpf?: string;
  empreendimento: Empreendimento;
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
  empreendimento,
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Entrada Total calculation with 23% cap for Park Jardim do Sol
  const isJardimDoSol = empreendimento.id === 'park-jardim-do-sol';
  const isEspanha = empreendimento.id === 'park-espanha';
  const saldoRealOperacao = Math.max(0, valorImovel - financiamentoCaixa - subsidioCaixa - fgts);
  const proSolutoMax = valorImovel * 0.23;
  const entradaTotalCalculada = isJardimDoSol
    ? Math.min(saldoRealOperacao, proSolutoMax)
    : saldoRealOperacao;

  // Dynamic limits from chosen Empreendimento
  const limitObra = empreendimento.qtdParcelasObra ?? 30;
  const limitPosObra = empreendimento.qtdParcelasPosObra ?? 78;
  const maxTotal = empreendimento.maxParcelasEntrada || (limitObra + limitPosObra);

  // Intermediarias sum
  const somaInterObra = usarIntermediarias
    ? intermediarias.filter(i => (i.mes <= limitObra || i.fase === 'obra')).reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const somaInterPosObra = usarIntermediarias
    ? intermediarias.filter(i => (i.mes > limitObra || i.fase === 'pos_obra')).reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const somaIntermediarias = somaInterObra + somaInterPosObra;

  // Remaining Entry balance after Sinal and Intermediarias
  const saldoApenasComSinal = Math.max(0, entradaTotalCalculada - sinalAVista);
  const saldoFinalAParcelar = Math.max(0, entradaTotalCalculada - sinalAVista - somaIntermediarias);

  // Split calculations based on empreendimento configuration
  const qtdObra = Math.min(numParcelasEntrada, limitObra);
  const qtdPosObra = Math.max(0, Math.min(limitPosObra, numParcelasEntrada - limitObra));

  const valorParcelaUnica = numParcelasEntrada > 0
    ? Math.max(0, saldoFinalAParcelar) / numParcelasEntrada
    : 0;

  let valorParcelaObra = 0;
  let valorParcelaPosObra = 0;

  if (numParcelasEntrada > 0) {
    if (isJardimDoSol || isEspanha) {
      // Balanced monthly installments for Park Jardim do Sol and Park Espanha
      valorParcelaObra = qtdObra > 0 ? valorParcelaUnica : 0;
      valorParcelaPosObra = qtdPosObra > 0 ? valorParcelaUnica : 0;
    } else {
      // Standard proportional split for other developments
      const ratioObra = qtdObra / numParcelasEntrada;
      const ratioPosObra = qtdPosObra / numParcelasEntrada;
      const saldoBaseObra = saldoApenasComSinal * ratioObra;
      const saldoBasePosObra = saldoApenasComSinal * ratioPosObra;

      valorParcelaObra = qtdObra > 0
        ? Math.max(0, saldoBaseObra - somaInterObra) / qtdObra
        : 0;

      valorParcelaPosObra = qtdPosObra > 0
        ? Math.max(0, saldoBasePosObra - somaInterPosObra) / qtdPosObra
        : 0;
    }
  }

  const handleShareWhatsApp = () => {
    const message = buildWhatsAppText({
      nomeEmpreendimento: empreendimento.nomeEmpreendimento,
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

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateProposalPdf({
        nomeCliente,
        whatsapp,
        email,
        cpf,
        empreendimento,
        selectedUnit,
        valorImovel,
        financiamentoCaixa,
        subsidioCaixa,
        fgts,
        sinalAVista,
        numParcelasEntrada,
        usarIntermediarias,
        intermediarias,
        simulationResult,
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="bg-[#FF600B] -mx-5 -mt-5 md:-mx-7 md:-mt-7 p-5 mb-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                PROPOSTA DE COMPRA INC
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-white">
              {empreendimento.nomeEmpreendimento.toUpperCase()}
            </h1>
            <p className="text-xs font-bold text-white/80 mt-1">
              Simulador Oficial de Propostas • INC Empreendimentos
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#FF600B] flex items-center justify-center shadow-lg flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* 1. SEÇÃO CLIENTE */}
        <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#2A2A2A] mb-5 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A2A2A]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FF600B]" />
              CLIENTE {nomeCliente ? `• ${nomeCliente}` : ''}
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('dados_cliente')}
              className="text-[11px] font-bold text-[#FF600B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {(whatsapp || email || cpf) && (
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 border-b border-[#2A2A2A] pb-2.5">
              {whatsapp && (
                <span className="flex items-center gap-1 font-bold text-[#FF600B]">
                  <Phone className="w-3.5 h-3.5 text-[#FF600B]" /> {whatsapp}
                </span>
              )}
              {cpf && (
                <span className="flex items-center gap-1 text-[#B5B5B5]">
                  <FileText className="w-3.5 h-3.5 text-[#B5B5B5]" /> CPF: {cpf}
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1 text-[#B5B5B5] truncate">
                  <Mail className="w-3.5 h-3.5 text-[#B5B5B5]" /> {email}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#B5B5B5] font-medium block">Renda</span>
              <span className="text-xs font-black text-white">{formatBRL(income)}</span>
            </div>
            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#B5B5B5] font-medium block">Perfil</span>
              <span className="text-xs font-black text-[#FF600B]">
                {isCotista ? 'Cotista' : 'Não Cotista'}
              </span>
            </div>
            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#B5B5B5] font-medium block">Dependente</span>
              <span className="text-xs font-black text-white">
                {temDependente ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO PARK JARDIM DO SOL */}
        <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#2A2A2A] mb-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A2A2A]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-4 h-4 text-[#FF600B]" />
              DETALHES DO IMÓVEL & FINANCIAMENTO CAIXA
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('escolha_imovel')}
              className="text-[11px] font-bold text-[#FF600B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {selectedUnit && (
            <div className="mb-3 bg-[#111111] p-3 rounded-xl border border-[#2A2A2A] text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Unidade {selectedUnit.unidade}</span>
                <span className="text-[#B5B5B5]">
                  {selectedUnit.tipologia} • {selectedUnit.areaM2} m² • Vaga {selectedUnit.vagas}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#FF600B] bg-[#FF600B]/10 px-2.5 py-1 rounded-lg border border-[#FF600B]/20">
                Valor de Venda: {formatBRL(selectedUnit.valorVenda || valorImovel)}
              </span>
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#111111]">
              <span className="text-[#B5B5B5]">Valor do Imóvel:</span>
              <span className="font-extrabold text-white">{formatBRL(valorImovel)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#111111]">
              <span className="text-[#B5B5B5]">Financiamento CAIXA:</span>
              <span className="font-bold text-[#FF600B]">{formatBRL(financiamentoCaixa)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#111111]">
              <span className="text-[#B5B5B5]">Subsídio MCMV:</span>
              <span className="font-bold text-[#FF600B]">
                {subsidioCaixa > 0 ? formatBRL(subsidioCaixa) : 'R$ 0,00'}
              </span>
            </div>
            {fgts > 0 && (
              <div className="flex justify-between py-1.5 border-b border-[#111111]">
                <span className="text-[#B5B5B5]">FGTS Utilizado:</span>
                <span className="font-bold text-[#FF600B]">{formatBRL(fgts)}</span>
              </div>
            )}
            {sinalAVista > 0 && (
              <div className="flex justify-between py-1.5 border-b border-[#111111]">
                <span className="text-[#B5B5B5]">Sinal à Vista (Dinheiro):</span>
                <span className="font-bold text-[#FF600B]">{formatBRL(sinalAVista)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. SEÇÃO FLUXO INC ({numParcelasEntrada}X) */}
        <div className="bg-gradient-to-br from-[#FF600B]/15 via-[#111111] to-[#0A0A0A] rounded-2xl p-4 border border-[#FF600B]/30 mb-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A2A2A]">
            <h3 className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#FF600B]" />
              VALOR PAGO À INC ({numParcelasEntrada}X)
            </h3>
            <button
              type="button"
              onClick={() => onEditStep('fluxo_inc')}
              className="text-[11px] font-bold text-[#FF600B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          </div>

          {/* Mathematical Breakdown Card */}
          <div className="bg-[#0A0A0A] p-3.5 rounded-xl border border-[#2A2A2A] mb-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Valor Total Pró-Soluto à INC:</span>
              <span className="text-white font-extrabold">{formatBRL(entradaTotalCalculada)}</span>
            </div>

            {sinalAVista > 0 && (
              <div className="flex justify-between items-center text-[#FF600B]">
                <span>(-) Sinal / Entrada Inicial:</span>
                <span className="font-bold">{formatBRL(sinalAVista)}</span>
              </div>
            )}

            {somaIntermediarias > 0 && (
              <div className="flex justify-between items-center text-[#FF600B]">
                <span>(-) Soma das Intermediárias ({intermediarias.length}x):</span>
                <span className="font-bold">{formatBRL(somaIntermediarias)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-[#2A2A2A] font-black">
              <span className="text-[#FF600B] uppercase">(=) Saldo a Parcelar em Mensais:</span>
              <span className="text-[#FF600B] text-base">{formatBRL(saldoFinalAParcelar)}</span>
            </div>
          </div>

          {/* Obra & Pós-Obra Installment Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#FF600B]/30">
              <span className="text-[10px] font-bold text-[#FF600B] uppercase block">
                DURANTE A OBRA ({qtdObra}x)
              </span>
              <span className="text-lg font-black text-white block my-0.5">
                {formatBRL(valorParcelaObra)}
              </span>
              <span className="text-[10px] text-[#B5B5B5]">Reajuste: INCC</span>
            </div>

            {qtdPosObra > 0 && (
              <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#2A2A2A]">
                <span className="text-[10px] font-bold text-[#B5B5B5] uppercase block">
                  PÓS-OBRA ({qtdPosObra}x)
                </span>
                <span className="text-lg font-black text-white block my-0.5">
                  {formatBRL(valorParcelaPosObra)}
                </span>
                <span className="text-[10px] text-[#B5B5B5]">Reajuste: IPCA + 1,99% a.a.</span>
              </div>
            )}
          </div>

          {/* Intermediarias list if enabled */}
          {usarIntermediarias && intermediarias.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <span className="text-[11px] font-bold text-slate-300 block mb-2">
                INTERMEDIÁRIAS ANUAIS CONFIGURADAS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {intermediarias.map((inter) => (
                  <div
                    key={inter.id}
                    className="bg-[#0A0A0A] p-2.5 rounded-xl border border-[#2A2A2A] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#B5B5B5] font-medium">{inter.rotulo}:</span>
                    <span className="font-extrabold text-[#FF600B]">{formatBRL(inter.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. DOCUMENTAÇÃO ITBI / REGISTRO */}
        <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#2A2A2A] mb-5 text-xs space-y-2">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF600B]" />
              DOCUMENTAÇÃO (REGISTRO + ITBI)
            </span>
            <span className="text-[#FF600B] font-bold">R$ 6.800,00</span>
          </h3>
          <div className="bg-[#111111] p-3 rounded-xl border border-[#2A2A2A] flex justify-between items-center">
            <span className="text-[#B5B5B5]">Parcelamento Documentação:</span>
            <span className="font-bold text-white">36x de R$ 188,89</span>
          </div>
          <div className="flex justify-between items-center text-[#B5B5B5] pt-1">
            <span>Tarifa Bancária CAIXA:</span>
            <span className="font-bold text-white">R$ 1.000,00</span>
          </div>
        </div>

        {/* 5. SEÇÃO PÓS-OBRA & OBSERVAÇÕES OFICIAIS */}
        <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-[#2A2A2A] mb-6 text-xs space-y-2">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-[#FF600B]" />
            CONDIÇÕES OFICIAIS INC & AVISOS LEGAIS
          </h3>

          <div className="bg-[#111111] p-3 rounded-xl border border-[#2A2A2A] flex justify-between items-center mb-2">
            <span className="text-[#B5B5B5] font-medium">Parcela Estimada CAIXA:</span>
            <span className="font-black text-white text-sm">{formatBRL(parcela)} / mês</span>
          </div>

          <div className="text-[#B5B5B5] space-y-1 text-[11px] leading-relaxed">
            <p>• <strong>Fiador:</strong> Obrigatório fiador com CPF regular e renda comprovada.</p>
            <p>• <strong>Correção durante a obra:</strong> Reajuste mensal pelo INCC.</p>
            <p>• <strong>Pós-obra (Após as chaves):</strong> Correção pelo IPCA + 1,99% a.a.</p>
            <p>• <strong>Aviso CAIXA:</strong> Simulação aproximada, sujeita à análise e aprovação da CAIXA.</p>
          </div>
        </div>

        {/* ACTION BUTTONS: PDF, WHATSAPP & COPY CRM */}
        <div className="space-y-2.5 mb-4">
          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className="w-full bg-[#FF600B] hover:bg-[#D94D00] text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/20 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-5 h-5 text-white" />
            <span>{isGeneratingPdf ? 'GERANDO PDF...' : 'GERAR PDF DA SIMULAÇÃO'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full bg-[#111111] hover:bg-[#2A2A2A] text-[#FF600B] border border-[#FF600B]/50 font-black text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-[#FF600B] fill-[#FF600B]" />
            <span>ENVIAR PELO WHATSAPP</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCrmData}
            className={`w-full font-bold text-xs py-3 px-5 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'bg-[#FF600B] text-white border-[#FF600B] font-extrabold'
                : 'bg-[#111111] hover:bg-[#2A2A2A] text-[#B5B5B5] border-[#2A2A2A]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>DADOS COPIADOS PARA O CRM!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#FF600B]" />
                <span>COPIAR DADOS PARA O CRM</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Navigation Row */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A2A2A]">
          <button
            type="button"
            onClick={onBack}
            className="py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#B5B5B5] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={onNewSimulation}
            className="py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FF600B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nova Simulação</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
