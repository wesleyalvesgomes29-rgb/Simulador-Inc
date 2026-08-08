import { Empreendimento } from '../types';
import { INITIAL_PARK_UNITS, INC_PROJECT_INFO as JARDIM_DO_SOL_INFO } from './jardimDoSolData';
import { PARK_ESPANHA_UNITS, PARK_ESPANHA_INFO } from './parkEspanhaData';

export const JARDIM_DO_SOL_EMPREENDIMENTO: Empreendimento = {
  id: 'park-jardim-do-sol',
  nomeEmpreendimento: 'PARK JARDIM DO SOL',
  construtora: JARDIM_DO_SOL_INFO.construtora,
  localizacao: JARDIM_DO_SOL_INFO.localizacao,
  previsaoEntrega: JARDIM_DO_SOL_INFO.previsaoEntrega,
  avaliacaoCaixaInterna: JARDIM_DO_SOL_INFO.avaliacaoCaixaInterna,
  valorTabelaImovel: JARDIM_DO_SOL_INFO.valorTabelaImovel,
  maxParcelasEntrada: JARDIM_DO_SOL_INFO.maxParcelasEntrada,
  qtdParcelasObra: JARDIM_DO_SOL_INFO.qtdParcelasObra,
  qtdParcelasPosObra: JARDIM_DO_SOL_INFO.qtdParcelasPosObra,
  registroItbiTotal: JARDIM_DO_SOL_INFO.registroItbiTotal,
  registroItbiParcelas: JARDIM_DO_SOL_INFO.registroItbiParcelas,
  registroItbiValorParcela: JARDIM_DO_SOL_INFO.registroItbiValorParcela,
  tarifaBancaria: JARDIM_DO_SOL_INFO.tarifaBancaria,
  correcaoObra: JARDIM_DO_SOL_INFO.correcaoObra,
  correcaoPosObra: JARDIM_DO_SOL_INFO.correcaoPosObra,
  observacoes: JARDIM_DO_SOL_INFO.observacoes,
  units: INITIAL_PARK_UNITS,
};

export const PARK_ESPANHA_EMPREENDIMENTO: Empreendimento = {
  id: PARK_ESPANHA_INFO.id,
  nomeEmpreendimento: PARK_ESPANHA_INFO.nomeEmpreendimento,
  construtora: PARK_ESPANHA_INFO.construtora,
  localizacao: PARK_ESPANHA_INFO.localizacao,
  previsaoEntrega: PARK_ESPANHA_INFO.previsaoEntrega,
  avaliacaoCaixaInterna: PARK_ESPANHA_INFO.avaliacaoCaixaInterna,
  valorTabelaImovel: PARK_ESPANHA_INFO.valorTabelaImovel,
  maxParcelasEntrada: PARK_ESPANHA_INFO.maxParcelasEntrada,
  qtdParcelasObra: PARK_ESPANHA_INFO.qtdParcelasObra,
  qtdParcelasPosObra: PARK_ESPANHA_INFO.qtdParcelasPosObra,
  registroItbiTotal: PARK_ESPANHA_INFO.registroItbiTotal,
  registroItbiParcelas: PARK_ESPANHA_INFO.registroItbiParcelas,
  registroItbiValorParcela: PARK_ESPANHA_INFO.registroItbiValorParcela,
  tarifaBancaria: PARK_ESPANHA_INFO.tarifaBancaria,
  correcaoObra: PARK_ESPANHA_INFO.correcaoObra,
  correcaoPosObra: PARK_ESPANHA_INFO.correcaoPosObra,
  observacoes: PARK_ESPANHA_INFO.observacoes,
  units: PARK_ESPANHA_UNITS,
};

export const ALL_EMPREENDIMENTOS: Empreendimento[] = [
  JARDIM_DO_SOL_EMPREENDIMENTO,
  PARK_ESPANHA_EMPREENDIMENTO,
];

export function getEmpreendimentoById(id: string): Empreendimento {
  const found = ALL_EMPREENDIMENTOS.find(e => e.id === id);
  return found || JARDIM_DO_SOL_EMPREENDIMENTO;
}
