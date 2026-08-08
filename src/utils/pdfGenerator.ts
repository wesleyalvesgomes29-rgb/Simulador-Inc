import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { McmvSimulationResult, ParkUnit, IntermediariaItem, Empreendimento } from '../types';
import { formatBRL } from './formatters';

interface GeneratePdfParams {
  nomeCliente: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  empreendimento: Empreendimento;
  selectedUnit: ParkUnit | null;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  numParcelasEntrada: number;
  usarIntermediarias: boolean;
  intermediarias: IntermediariaItem[];
  simulationResult: McmvSimulationResult;
}

export async function generateProposalPdf(params: GeneratePdfParams): Promise<void> {
  const {
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
  } = params;

  // Calculate Entry Total
  const valorEntradaTotal = Math.max(0, valorImovel - financiamentoCaixa - subsidioCaixa - fgts);
  const somaIntermediarias = usarIntermediarias
    ? intermediarias.reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;
  const saldoFinalAParcelar = Math.max(0, valorEntradaTotal - sinalAVista - somaIntermediarias);

  // Dynamic limits from chosen Empreendimento
  const limitObra = empreendimento.qtdParcelasObra ?? 30;
  const limitPosObra = empreendimento.qtdParcelasPosObra ?? 78;

  // Split Obra / Pós Obra
  const qtdObra = Math.min(numParcelasEntrada, limitObra);
  const qtdPosObra = Math.max(0, Math.min(limitPosObra, numParcelasEntrada - limitObra));

  const saldoApenasComSinal = Math.max(0, valorEntradaTotal - sinalAVista);
  const ratioObra = (numParcelasEntrada === 108 && empreendimento.id === 'park-jardim-do-sol')
    ? 0.52194
    : numParcelasEntrada > 0 ? (qtdObra / numParcelasEntrada) : 0;

  const ratioPosObra = (numParcelasEntrada === 108 && empreendimento.id === 'park-jardim-do-sol')
    ? 0.47806
    : numParcelasEntrada > 0 ? (qtdPosObra / numParcelasEntrada) : 0;

  const somaInterObra = usarIntermediarias
    ? intermediarias.filter(i => i.mes <= limitObra || i.fase === 'obra').reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;
  const somaInterPosObra = usarIntermediarias
    ? intermediarias.filter(i => i.mes > limitObra || i.fase === 'pos_obra').reduce((acc, curr) => acc + (curr.valor || 0), 0)
    : 0;

  const saldoBaseObra = saldoApenasComSinal * ratioObra;
  const saldoBasePosObra = saldoApenasComSinal * ratioPosObra;

  const valorParcelaObra = qtdObra > 0 ? Math.max(0, saldoBaseObra - somaInterObra) / qtdObra : 0;
  const valorParcelaPosObra = qtdPosObra > 0 ? Math.max(0, saldoBasePosObra - somaInterPosObra) / qtdPosObra : 0;
  const valorParcelaUnica = numParcelasEntrada > 0 ? Math.max(0, saldoFinalAParcelar) / numParcelasEntrada : 0;

  // Create temporary offscreen container for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.padding = '32px';
  container.style.backgroundColor = '#020617'; // Slate 950
  container.style.color = '#f8fafc';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  container.innerHTML = `
    <div style="border: 2px solid #0d9488; border-radius: 16px; padding: 24px; background-color: #0f172a;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #10b981; margin: 0; text-transform: uppercase;">INC EMPREENDIMENTOS</h1>
          <p style="font-size: 14px; font-weight: 700; color: #94a3b8; margin: 4px 0 0 0;">PROPOSTA COMERCIAL • ${empreendimento.nomeEmpreendimento.toUpperCase()}</p>
        </div>
        <div style="text-align: right;">
          <span style="background-color: #059669; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; display: inline-block;">
            PROPOSTA COMERCIAL
          </span>
          <p style="font-size: 11px; color: #64748b; margin: 6px 0 0 0;">Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <!-- Customer Info -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 12px; font-weight: 800; color: #14b8a6; text-transform: uppercase; margin: 0 0 10px 0;">DADOS DO CLIENTE</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div><strong>Cliente:</strong> ${nomeCliente || 'Não informado'}</div>
          <div><strong>WhatsApp:</strong> ${whatsapp || 'Não informado'}</div>
          ${email ? `<div><strong>E-mail:</strong> ${email}</div>` : ''}
          ${cpf ? `<div><strong>CPF:</strong> ${cpf}</div>` : ''}
          <div><strong>Renda Bruta:</strong> ${formatBRL(simulationResult.income)}</div>
          <div><strong>Perfil:</strong> ${simulationResult.perfilLabel}</div>
        </div>
      </div>

      <!-- Property Details (NO AVALIAÇÃO CAIXA) -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 12px; font-weight: 800; color: #14b8a6; text-transform: uppercase; margin: 0 0 10px 0;">IMÓVEL SELECIONADO</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div><strong>Empreendimento:</strong> ${empreendimento.nomeEmpreendimento}</div>
          <div><strong>Localização:</strong> ${empreendimento.localizacao}</div>
          <div><strong>Unidade:</strong> ${selectedUnit ? selectedUnit.unidade : 'Geral'}</div>
          <div><strong>Tipologia:</strong> ${selectedUnit ? selectedUnit.tipologia : 'Padrão'}</div>
          <div><strong>Área Privativa:</strong> ${selectedUnit ? `${selectedUnit.areaM2} m²` : 'Padrão'}</div>
          <div><strong>Vaga de Garagem:</strong> ${selectedUnit ? selectedUnit.vagas : 'DESCOBERTA'}</div>
          <div style="grid-column: span 2; background-color: #0f172a; padding: 10px; border-radius: 8px; margin-top: 6px;">
            <strong style="color: #34d399; font-size: 16px;">VALOR DE VENDA DO IMÓVEL: ${formatBRL(valorImovel)}</strong>
          </div>
        </div>
      </div>

      <!-- Financing & Subsidies Breakdown -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 12px; font-weight: 800; color: #14b8a6; text-transform: uppercase; margin: 0 0 10px 0;">COMPOSIÇÃO DE FINANCIAMENTO CAIXA / SUBSÍDIO</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span>Financiamento estimado CAIXA:</span>
          <strong>${formatBRL(financiamentoCaixa)}</strong>
        </div>
        ${simulationResult.parcela > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span>Parcela estimada CAIXA:</span>
          <strong style="color: #38bdf8;">${formatBRL(simulationResult.parcela)}</strong>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span>Subsídio MCMV (${simulationResult.faixa}):</span>
          <strong style="color: #34d399;">${formatBRL(subsidioCaixa)}</strong>
        </div>
        ${fgts > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span>Uso de Saldo FGTS:</span>
          <strong>${formatBRL(fgts)}</strong>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #334155; font-size: 15px; font-weight: 900; color: #10b981;">
          <span>TOTAL A SER PAGO À CONSTRUTORA (INC):</span>
          <span>${formatBRL(valorEntradaTotal)}</span>
        </div>
      </div>

      <!-- INC Entry Flow Breakdown -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 12px; font-weight: 800; color: #14b8a6; text-transform: uppercase; margin: 0 0 10px 0;">FLUXO DE PAGAMENTO DA ENTRADA COM A INC</h3>
        
        ${sinalAVista > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; background-color: #0f172a; padding: 8px 12px; border-radius: 6px;">
          <span>Sinal / Entrada Inicial:</span>
          <strong style="color: #fbbf24;">${formatBRL(sinalAVista)}</strong>
        </div>
        ` : ''}

        ${qtdPosObra > 0 ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div style="background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #059669;">
            <div style="font-size: 11px; font-weight: 800; color: #34d399;">PARCELAS DURANTE A OBRA (${qtdObra}x)</div>
            <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 4px;">${formatBRL(valorParcelaObra)}</div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Correção pelo INCC</div>
          </div>
          <div style="background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #0d9488;">
            <div style="font-size: 11px; font-weight: 800; color: #2dd4bf;">PARCELAS PÓS-OBRA (${qtdPosObra}x)</div>
            <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 4px;">${formatBRL(valorParcelaPosObra)}</div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">IPCA + 1,99% a.a.</div>
          </div>
        </div>
        ` : `
        <div style="background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #059669; margin-bottom: 12px;">
          <div style="font-size: 11px; font-weight: 800; color: #34d399;">PARCELAS DURANTE A OBRA (${numParcelasEntrada}x)</div>
          <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 4px;">${formatBRL(valorParcelaUnica)}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Correção pelo INCC</div>
        </div>
        `}

        ${usarIntermediarias && intermediarias.length > 0 ? `
        <div style="margin-top: 10px; background-color: #0f172a; padding: 10px; border-radius: 8px;">
          <div style="font-size: 11px; font-weight: 800; color: #2dd4bf; margin-bottom: 6px;">INTERMEDIÁRIAS / BALÕES ANUAIS (${intermediarias.length}x)</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px;">
            ${intermediarias.map(item => `
              <div>• ${item.rotulo}: <strong>${formatBRL(item.valor)}</strong></div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Legal / Observations -->
      <div style="font-size: 10px; color: #94a3b8; line-height: 1.4; border-top: 1px solid #1e293b; padding-top: 12px;">
        <p style="margin: 0 0 4px 0;"><strong>Condições Importantes:</strong> Documentação (Registro + ITBI) R$ 6.800,00 parcelado em 36x de R$ 188,89 + Tarifa R$ 1.000,00.</p>
        <p style="margin: 0 0 4px 0;">Obrigatória apresentação de fiador com CPF regular e renda comprovada.</p>
        <p style="margin: 0;">Esta é apenas uma simulação comercial sem valor de contrato formal. Preços e condições sujeitos a alteração sem aviso prévio.</p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#020617',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
    
    const clientSanitized = (nomeCliente || 'cliente').replace(/[^a-zA-Z0-9]/g, '_');
    const empSanitized = (empreendimento.nomeEmpreendimento || 'empreendimento').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Simulacao_${empSanitized}_${clientSanitized}.pdf`);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
  } finally {
    document.body.removeChild(container);
  }
}
