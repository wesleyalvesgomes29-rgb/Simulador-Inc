export type PerfilType = 
  | 'cotista_com_dep'
  | 'cotista_sem_dep'
  | 'nao_cotista_com_dep'
  | 'nao_cotista_sem_dep';

export interface McmvBracket {
  id: string;
  minRenda: number;
  maxRenda: number;
  faixa: 'Faixa 1' | 'Faixa 2' | 'Faixa 3' | 'Classe Média';
  isCotista: boolean;
  temDependente: boolean;
  financiamentoMax: number;
  subsidioMax: number;
  parcelaEstimada: number;
  taxaJurosAnual: number; // % p.a.
  obs?: string;
}

export interface McmvSimulationResult {
  income: number;
  temDependente: boolean;
  isCotista: boolean;
  perfilLabel: string;
  financiamento: number;
  subsidio: number;
  parcela: number;
  taxaJuros: number;
  faixa: string;
  bracketMatched: McmvBracket | null;
  isExactMatch?: boolean;
  enquadramentoNotice?: string;
}

export interface ParkUnit {
  id: string;
  unidade: string; // e.g. "0101"
  tipologia: string; // e.g. "02 Quartos GARDEN"
  areaM2: number; // e.g. 56.09
  vagas: string; // e.g. "DESCOBERTA" | "COBERTA"
  valorM2: number; // e.g. 5168.48
  avaliacaoCaixa: number; // e.g. 248900 (Internal CAIXA valuation - do not display to client)
  valorVenda: number; // e.g. 289900 (Official price for sale and all calculations)
  torre?: string;
  valorTabela?: number;
  valorFinal: number; // Always equals valorVenda
  status: 'Disponível' | 'Reservado' | 'Vendido';
}

export interface IntermediariaItem {
  id: string;
  mes: number; // e.g. 12, 24, 36, 48, 60, 72...
  data?: string; // e.g. '12/20/2026'
  rotulo: string; // e.g. "Intermediária 01 (12/2026)"
  valor: number;
  fase?: 'obra' | 'pos_obra';
}

export interface IncFlowConfig {
  unit: ParkUnit | null;
  customUnitName: string;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  
  // INC Entry financing
  numParcelasEntrada: number; // Max 108 (30 obra + 78 pós-obra)
  usarIntermediarias: boolean;
  intermediarias: IntermediariaItem[];
  incluirDocumentacao?: boolean;
}

export type AppStep = 
  | 'dados_cliente'
  | 'resultado_mcmv'
  | 'escolha_imovel'
  | 'valores_cliente'
  | 'fluxo_inc'
  | 'resumo_final';
