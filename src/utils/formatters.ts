/**
 * Formats a number to Brazilian Real string (e.g., R$ 3.200,00)
 */
export function formatBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats percentage number (e.g., 4.25 -> "4,25%")
 */
export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00%';
  }
  return `${value.toFixed(2).replace('.', ',')}%`;
}

/**
 * Parses a BRL string or user input string into a number
 */
export function parseBRLInput(input: string): number {
  if (!input) return 0;
  // Remove non-digits
  const cleanNumber = input.replace(/\D/g, '');
  if (!cleanNumber) return 0;
  return parseFloat(cleanNumber) / 100;
}

/**
 * Format string while user is typing in currency input
 */
export function formatBRLInputFromNumber(amount: number): string {
  if (amount === 0) return 'R$ 0,00';
  return formatBRL(amount);
}

/**
 * Generates formatted text for WhatsApp share
 */
export interface WhatsAppMessageData {
  nomeEmpreendimento?: string;
  nomeCliente?: string;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidio: number;
  fgts: number;
  sinalAVista?: number;
  entradaTotal: number;
  numParcelasEntrada: number;
  parcelaObra?: { qtd: number; valor: number };
  parcelaPosObra?: { qtd: number; valor: number };
  valorParcelaEntrada: number;
  intermediarias: { rotulo: string; valor: number; data?: string }[];
  posObraInfo?: string;
  incluirDocumentacao?: boolean;
}

export function buildWhatsAppText(data: WhatsAppMessageData): string {
  const saudacao = data.nomeCliente && data.nomeCliente.trim() !== ''
    ? `Olá, *${data.nomeCliente.trim()}*!`
    : 'Olá!';

  let message = `${saudacao} Confira a proposta oficial do *${data.nomeEmpreendimento ? data.nomeEmpreendimento.toUpperCase() : 'PARK JARDIM DO SOL'}* (INC Empreendimentos):\n\n`;
  message += `🏠 *Valor do Imóvel:* ${formatBRL(data.valorImovel)}\n`;
  message += `🏦 *Financiamento CAIXA:* ${formatBRL(data.financiamentoCaixa)}\n`;
  if (data.subsidio > 0) {
    message += `🎁 *Subsídio MCMV:* ${formatBRL(data.subsidio)}\n`;
  }
  if (data.fgts > 0) {
    message += `💰 *FGTS Utilizado:* ${formatBRL(data.fgts)}\n`;
  }
  if (data.sinalAVista && data.sinalAVista > 0) {
    message += `💵 *Sinal à Vista:* ${formatBRL(data.sinalAVista)}\n`;
  }

  message += `\n*FLUXO DE PARCELAMENTO INC (Até ${data.numParcelasEntrada}x):*\n`;
  message += `• *Total Entrada Pró-Soluto:* ${formatBRL(data.entradaTotal)}\n`;

  if (data.parcelaObra && data.parcelaPosObra && data.parcelaPosObra.qtd > 0) {
    message += `• *Durante a Obra (${data.parcelaObra.qtd}x):* ${formatBRL(data.parcelaObra.valor)} / mês (Reajuste INCC)\n`;
    message += `• *Pós-Obra (${data.parcelaPosObra.qtd}x):* ${formatBRL(data.parcelaPosObra.valor)} / mês (IPCA + 1,99% a.a.)\n`;
  } else {
    message += `• *Parcela Mensal INC:* ${data.numParcelasEntrada}x de ${formatBRL(data.valorParcelaEntrada)}\n`;
  }

  if (data.intermediarias && data.intermediarias.length > 0) {
    message += `\n*INTERMEDIÁRIAS ANUAIS:*\n`;
    data.intermediarias.forEach((inter) => {
      message += `• ${inter.rotulo}: ${formatBRL(inter.valor)}\n`;
    });
  }

  if (data.incluirDocumentacao) {
    message += `\n📄 *DOCUMENTAÇÃO (Registro + ITBI):* R$ 6.800,00 em até 36x de R$ 188,89 + Tarifa R$ 1.000,00\n`;
  }

  message += `\n📌 *REAJUSTES OFICIAIS:* INCC durante a obra | IPCA + 1,99% a.a. pós-obra.\n`;
  message += `🔒 *REQUISITO:* Fiador obrigatório com CPF regular e renda comprovada.\n`;
  message += `\n⚠️ *Aviso:* Proposta sujeita a alteração sem aviso prévio e aprovação de crédito CAIXA.`;

  return message;
}

export function openWhatsApp(message: string) {
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Phone / WhatsApp Mask: (34) 99999-9999
 */
export function formatPhoneMask(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * CPF Mask: 000.000.000-00
 */
export function formatCpfMask(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Copy text to clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Erro ao copiar para área de transferência:', err);
    return false;
  }
}

