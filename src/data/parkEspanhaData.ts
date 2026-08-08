import { ParkUnit } from '../types';

/**
 * DADOS OFICIAIS DO EMPREENDIMENTO PARK ESPANHA (INC EMPREENDIMENTOS)
 * Tabela Oficial: AGOSTO 2026 - TODAS AS TORRES
 * 
 * REGRA CRÍTICA:
 * A coluna de "VALOR DE AVALIAÇÃO" foi COMPLETAMENTE REMOVIDA / IGNORADA.
 * Não é armazenada, exibida ou utilizada em nenhum cálculo, tela ou PDF.
 * Apenas o VALOR DE VENDA é utilizado como preço oficial comercial.
 */

export const PARK_ESPANHA_UNITS: ParkUnit[] = [
  // TORRE A
  { id: 'pe-a-0604', unidade: 'Torre A - 0604', tipologia: '2Q S t. MEIO (6º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1004', unidade: 'Torre A - 1004', tipologia: '2Q S t. MEIO (10º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1006', unidade: 'Torre A - 1006', tipologia: '2Q S t. MEIO (10º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1103', unidade: 'Torre A - 1103', tipologia: '2Q S t. MEIO (11º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1105', unidade: 'Torre A - 1105', tipologia: '2Q S t. MEIO (11º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1203', unidade: 'Torre A - 1203', tipologia: '2Q S t. MEIO (12º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },
  { id: 'pe-a-1403', unidade: 'Torre A - 1403', tipologia: '2Q S t. MEIO (14º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'A' },

  // TORRE B
  { id: 'pe-b-0301', unidade: 'Torre B - 0301', tipologia: '2Q S t. PONTA - PCD (3º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5473.06, avaliacaoCaixa: 0, valorVenda: 249900.00, valorFinal: 249900.00, status: 'Disponível', torre: 'B' },
  { id: 'pe-b-1102', unidade: 'Torre B - 1102', tipologia: '2Q S t. PONTA (11º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5860.01, avaliacaoCaixa: 0, valorVenda: 267567.93, valorFinal: 267567.93, status: 'Disponível', torre: 'B' },
  { id: 'pe-b-1106', unidade: 'Torre B - 1106', tipologia: '2Q S t. MEIO (11º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'B' },
  { id: 'pe-b-1304', unidade: 'Torre B - 1304', tipologia: '2Q S t. MEIO (13º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'B' },
  { id: 'pe-b-1603', unidade: 'Torre B - 1603', tipologia: '2Q S t. MEIO (16º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6020.59, avaliacaoCaixa: 0, valorVenda: 274900.00, valorFinal: 274900.00, status: 'Disponível', torre: 'B' },

  // TORRE C
  { id: 'pe-c-0906', unidade: 'Torre C - 0906', tipologia: '2Q S t. MEIO (9º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'C' },
  { id: 'pe-c-1004', unidade: 'Torre C - 1004', tipologia: '2Q S t. MEIO (10º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'C' },
  { id: 'pe-c-1602', unidade: 'Torre C - 1602', tipologia: '2Q S t. PONTA (16º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6020.59, avaliacaoCaixa: 0, valorVenda: 274900.00, valorFinal: 274900.00, status: 'Disponível', torre: 'C' },

  // TORRE D
  { id: 'pe-d-0905', unidade: 'Torre D - 0905', tipologia: '2Q S t. MEIO (9º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'D' },
  { id: 'pe-d-1702', unidade: 'Torre D - 1702', tipologia: '2Q S t. PONTA (17º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6130.09, avaliacaoCaixa: 0, valorVenda: 279900.00, valorFinal: 279900.00, status: 'Disponível', torre: 'D' },

  // TORRE E
  { id: 'pe-e-0603', unidade: 'Torre E - 0603', tipologia: '2Q S t. MEIO (6º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-0806', unidade: 'Torre E - 0806', tipologia: '2Q S t. MEIO (8º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1406', unidade: 'Torre E - 1406', tipologia: '2Q S t. MEIO (14º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 5911.08, avaliacaoCaixa: 0, valorVenda: 269900.00, valorFinal: 269900.00, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1503', unidade: 'Torre E - 1503', tipologia: '2Q S t. MEIO (15º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6129.88, avaliacaoCaixa: 0, valorVenda: 279890.53, valorFinal: 279890.53, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1504', unidade: 'Torre E - 1504', tipologia: '2Q S t. MEIO (15º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6129.88, avaliacaoCaixa: 0, valorVenda: 279890.53, valorFinal: 279890.53, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1505', unidade: 'Torre E - 1505', tipologia: '2Q S t. MEIO (15º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6129.88, avaliacaoCaixa: 0, valorVenda: 279890.53, valorFinal: 279890.53, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1506', unidade: 'Torre E - 1506', tipologia: '2Q S t. MEIO (15º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6129.88, avaliacaoCaixa: 0, valorVenda: 279890.53, valorFinal: 279890.53, status: 'Disponível', torre: 'E' },
  { id: 'pe-e-1602', unidade: 'Torre E - 1602', tipologia: '2Q S t. PONTA (16º Andar)', areaM2: 45.66, vagas: 'DESCOBERTA', valorM2: 6062.05, avaliacaoCaixa: 0, valorVenda: 276793.38, valorFinal: 276793.38, status: 'Disponível', torre: 'E' },
];

export const PARK_ESPANHA_INFO = {
  id: 'park-espanha',
  nomeEmpreendimento: 'Park Espanha',
  construtora: 'INC Empreendimentos',
  localizacao: 'Uberlândia - MG',
  previsaoEntrega: 'Agosto/2026',
  avaliacaoCaixaInterna: 0, // EXCLUÍDO TOTALMENTE
  valorTabelaImovel: 269900.00,
  maxParcelasEntrada: 74, // 60M + 14M durante a obra
  qtdParcelasObra: 14,
  qtdParcelasPosObra: 60,

  // Taxas e Documentação (Nota 8: DOCUMENTAÇÃO GRATUITA)
  registroItbiTotal: 0,
  registroItbiParcelas: 0,
  registroItbiValorParcela: 0,
  tarifaBancaria: 900.00, // Nota 9: R$ 900,00

  // Reajustes Oficiais
  correcaoObra: 'INCC durante a obra',
  correcaoPosObra: 'IPCA + 1,99% a.a. pós-obra',

  observacoes: [
    'TABELA OFICIAL PARK ESPANHA (TODAS AS TORRES).',
    'DOCUMENTAÇÃO GRATUITA.',
    'PRÓ-SOLUTO: 60 Meses + 14 Meses durante a Obra + 4 Intermediárias.',
    'CORREÇÃO PELO INCC DURANTE A OBRA E PÓS-OBRA IPCA + 1,99% a.a.',
    'NÃO SERÁ COBRADA TAXA DE ENXOVAL.',
    'VALOR MÁXIMO DE PRÓ-SOLUTO É 23% COM A CONSTRUTORA / 25% NA EMCASH.',
    'TARIFA BANCÁRIA (NÃO INCLUÍDA NA TABELA): APROX. R$ 900,00.'
  ]
};
