import { IncFlowConfig, ParkUnit, McmvSimulationResult } from '../types';

export interface ClientLead {
  id: string;
  dataCriacao: string; // ISO date string
  dataAtualizacao: string;
  nome: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  renda: number;
  temDependente: boolean;
  isCotista: boolean;
  
  // Simulation details
  selectedUnit?: ParkUnit | null;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  numParcelasEntrada: number;
  usarIntermediarias: boolean;
  valorEntradaInc: number; // Valor a pagar a INC
  
  status: 'Em Atendimento' | 'Proposta Gerada' | 'Enviado WhatsApp' | 'Negociação';
}

const STORAGE_KEY = 'feirao_inc_clientes_v1';

export function getSavedClients(): ClientLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler clientes do localStorage:', err);
    return [];
  }
}

export function saveClientLead(leadData: Omit<ClientLead, 'id' | 'dataCriacao' | 'dataAtualizacao'> & { id?: string }): ClientLead {
  const clients = getSavedClients();
  const now = new Date().toISOString();

  if (leadData.id) {
    // Update existing
    const index = clients.findIndex(c => c.id === leadData.id);
    if (index >= 0) {
      const updated: ClientLead = {
        ...clients[index],
        ...leadData,
        id: leadData.id,
        dataAtualizacao: now,
      };
      clients[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      return updated;
    }
  }

  // Create new
  const newLead: ClientLead = {
    ...leadData,
    id: leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataCriacao: now,
    dataAtualizacao: now,
  };

  clients.unshift(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  return newLead;
}

export function deleteClientLead(id: string): void {
  const clients = getSavedClients().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function generateCrmText(lead: ClientLead): string {
  const dataFmt = new Date(lead.dataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatBRLVal = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  let text = `=== FICHA DE ATENDIMENTO DE FEIRÃO - PARK JARDIM DO SOL ===\n`;
  text += `Data Atendimento: ${dataFmt}\n`;
  text += `Status: ${lead.status}\n\n`;
  text += `--- DADOS DO CLIENTE ---\n`;
  text += `Nome: ${lead.nome || 'Não informado'}\n`;
  text += `WhatsApp: ${lead.whatsapp || 'Não informado'}\n`;
  if (lead.email) text += `E-mail: ${lead.email}\n`;
  if (lead.cpf) text += `CPF: ${lead.cpf}\n`;
  text += `Renda Mensal: ${formatBRLVal(lead.renda)}\n`;
  text += `Dependente: ${lead.temDependente ? 'Sim' : 'Não'}\n`;
  text += `Cotista FGTS (>36m): ${lead.isCotista ? 'Sim' : 'Não'}\n\n`;

  text += `--- DADOS DA UNIDADE & SIMULAÇÃO ---\n`;
  if (lead.selectedUnit) {
    text += `Unidade: ${lead.selectedUnit.unidade} (${lead.selectedUnit.tipologia})\n`;
  } else {
    text += `Unidade: Personalizada\n`;
  }
  text += `Valor do Imóvel: ${formatBRLVal(lead.valorImovel)}\n`;
  text += `Financiamento CAIXA: ${formatBRLVal(lead.financiamentoCaixa)}\n`;
  text += `Subsídio MCMV: ${formatBRLVal(lead.subsidioCaixa)}\n`;
  text += `FGTS do Cliente: ${formatBRLVal(lead.fgts)}\n`;
  text += `VALOR A PAGAR À INC: ${formatBRLVal(lead.valorEntradaInc)}\n`;
  if (lead.sinalAVista > 0) {
    text += `Sinal à Vista: ${formatBRLVal(lead.sinalAVista)}\n`;
  }
  text += `Parcelamento Entrada INC: ${lead.numParcelasEntrada}x\n`;

  return text;
}

export function exportClientsToCsv(clients: ClientLead[]): void {
  if (!clients.length) return;

  const headers = [
    'Data Atendimento',
    'Nome',
    'WhatsApp',
    'E-mail',
    'CPF',
    'Renda',
    'Dependente',
    'Cotista',
    'Unidade',
    'Valor Imóvel',
    'Financiamento CAIXA',
    'Subsídio MCMV',
    'FGTS',
    'Valor Pago à INC',
    'Sinal à Vista',
    'Status'
  ];

  const rows = clients.map(c => [
    new Date(c.dataCriacao).toLocaleDateString('pt-BR'),
    `"${(c.nome || '').replace(/"/g, '""')}"`,
    `"${(c.whatsapp || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.cpf || '').replace(/"/g, '""')}"`,
    c.renda,
    c.temDependente ? 'Sim' : 'Nao',
    c.isCotista ? 'Sim' : 'Nao',
    c.selectedUnit ? `"${c.selectedUnit.torre} - ${c.selectedUnit.unidade}"` : 'Outro',
    c.valorImovel,
    c.financiamentoCaixa,
    c.subsidioCaixa,
    c.fgts,
    c.valorEntradaInc,
    c.sinalAVista,
    `"${c.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `clientes_feirao_jardim_do_sol_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
