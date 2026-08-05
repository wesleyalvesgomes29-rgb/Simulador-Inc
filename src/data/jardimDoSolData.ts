import { ParkUnit } from '../types';

/**
 * DADOS OFICIAIS DO EMPREENDIMENTO PARK JARDIM DO SOL (INC EMPREENDIMENTOS)
 * TABELA PRÉ LANÇAMENTO - MARÇO 2026
 * 
 * ESTRUTURA DOS DADOS:
 * - unidade (e.g. "0101", "0201", "2613")
 * - tipologia (e.g. "02 Quartos GARDEN", "02 Quartos Meio", "02 Quartos Ponta", "01 Quarto PCD")
 * - areaM2 (e.g. 56.09, 39.5, 41.2, 37.98)
 * - vagas (e.g. "DESCOBERTA", "COBERTA")
 * - valorM2 (e.g. 5168.48)
 * - avaliacaoCaixa (Interna CAIXA - NÃO EXIBIR NA INTERFACE CLIENTE)
 * - valorVenda (Preço Oficial para apresentação ao cliente e todos os cálculos comerciais)
 */

export const INITIAL_PARK_UNITS: ParkUnit[] = [
  // TÉRREO - GARDENS
  { id: 'u-0101', unidade: '0101', tipologia: '02 Quartos GARDEN', areaM2: 56.09, vagas: 'DESCOBERTA', valorM2: 5168.48, avaliacaoCaixa: 248900, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-0102', unidade: '0102', tipologia: '02 Quartos GARDEN', areaM2: 55.42, vagas: 'DESCOBERTA', valorM2: 5230.96, avaliacaoCaixa: 246100, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-0103', unidade: '0103', tipologia: '02 Quartos GARDEN', areaM2: 73.81, vagas: 'DESCOBERTA', valorM2: 4063.14, avaliacaoCaixa: 262000, valorVenda: 299900, valorFinal: 299900, status: 'Disponível' },
  { id: 'u-0104', unidade: '0104', tipologia: '02 Quartos GARDEN', areaM2: 73.81, vagas: 'DESCOBERTA', valorM2: 4063.14, avaliacaoCaixa: 262000, valorVenda: 299900, valorFinal: 299900, status: 'Disponível' },
  { id: 'u-0105', unidade: '0105', tipologia: '02 Quartos GARDEN', areaM2: 55.79, vagas: 'DESCOBERTA', valorM2: 5196.27, avaliacaoCaixa: 247400, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-0107', unidade: '0107', tipologia: '01 Quarto GARDEN', areaM2: 53.04, vagas: 'DESCOBERTA', valorM2: 5371.42, avaliacaoCaixa: 236800, valorVenda: 284900, valorFinal: 284900, status: 'Disponível' },
  { id: 'u-0109', unidade: '0109', tipologia: '02 Quartos GARDEN', areaM2: 55.79, vagas: 'DESCOBERTA', valorM2: 5196.27, avaliacaoCaixa: 247400, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-0110', unidade: '0110', tipologia: '02 Quartos GARDEN', areaM2: 73.81, vagas: 'DESCOBERTA', valorM2: 4063.14, avaliacaoCaixa: 262000, valorVenda: 299900, valorFinal: 299900, status: 'Disponível' },
  { id: 'u-0111', unidade: '0111', tipologia: '02 Quartos GARDEN', areaM2: 73.81, vagas: 'DESCOBERTA', valorM2: 4063.14, avaliacaoCaixa: 262000, valorVenda: 299900, valorFinal: 299900, status: 'Disponível' },
  { id: 'u-0112', unidade: '0112', tipologia: '02 Quartos GARDEN', areaM2: 55.42, vagas: 'DESCOBERTA', valorM2: 5230.96, avaliacaoCaixa: 246100, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-0113', unidade: '0113', tipologia: '02 Quartos GARDEN', areaM2: 56.09, vagas: 'DESCOBERTA', valorM2: 5168.48, avaliacaoCaixa: 248900, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },

  // 2º ANDAR
  { id: 'u-0201', unidade: '0201', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 237100, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0202', unidade: '0202', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0203', unidade: '0203', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0204', unidade: '0204', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0205', unidade: '0205', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0206', unidade: '0206', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0207', unidade: '0207', tipologia: '01 Quarto PCD', areaM2: 37.98, vagas: 'DESCOBERTA', valorM2: 5789.89, avaliacaoCaixa: 227400, valorVenda: 219900, valorFinal: 219900, status: 'Disponível' },
  { id: 'u-0208', unidade: '0208', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 237100, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0209', unidade: '0209', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0210', unidade: '0210', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0211', unidade: '0211', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0212', unidade: '0212', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0213', unidade: '0213', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 237100, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },

  // 3º ANDAR
  { id: 'u-0301', unidade: '0301', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 237100, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0302', unidade: '0302', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0303', unidade: '0303', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0304', unidade: '0304', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5652.91, avaliacaoCaixa: 246000, valorVenda: 232900, valorFinal: 232900, status: 'Disponível' },
  { id: 'u-0305', unidade: '0305', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0306', unidade: '0306', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 234500, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },
  { id: 'u-0307', unidade: '0307', tipologia: '01 Quarto PCD', areaM2: 37.98, vagas: 'DESCOBERTA', valorM2: 5816.22, avaliacaoCaixa: 227400, valorVenda: 220900, valorFinal: 220900, status: 'Disponível' },
  { id: 'u-0308', unidade: '0308', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5820.25, avaliacaoCaixa: 237100, valorVenda: 229900, valorFinal: 229900, status: 'Disponível' },

  // 4º ANDAR
  { id: 'u-0401', unidade: '0401', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 6002.53, avaliacaoCaixa: 237100, valorVenda: 237100, valorFinal: 237100, status: 'Disponível' },
  { id: 'u-0402', unidade: '0402', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 5936.71, avaliacaoCaixa: 234500, valorVenda: 234500, valorFinal: 234500, status: 'Disponível' },
  { id: 'u-0403', unidade: '0403', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5774.27, avaliacaoCaixa: 246000, valorVenda: 237900, valorFinal: 237900, status: 'Disponível' },
  { id: 'u-0407', unidade: '0407', tipologia: '01 Quarto PCD', areaM2: 37.98, vagas: 'DESCOBERTA', valorM2: 5842.55, avaliacaoCaixa: 227400, valorVenda: 221900, valorFinal: 221900, status: 'Disponível' },

  // 6º ANDAR
  { id: 'u-0601', unidade: '0601', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 6002.53, avaliacaoCaixa: 237100, valorVenda: 237100, valorFinal: 237100, status: 'Disponível' },
  { id: 'u-0603', unidade: '0603', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 5895.63, avaliacaoCaixa: 246000, valorVenda: 242900, valorFinal: 242900, status: 'Disponível' },
  { id: 'u-0607', unidade: '0607', tipologia: '01 Quarto PCD', areaM2: 37.98, vagas: 'DESCOBERTA', valorM2: 5895.21, avaliacaoCaixa: 227400, valorVenda: 223900, valorFinal: 223900, status: 'Disponível' },

  // 8º ANDAR
  { id: 'u-0801', unidade: '0801', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 6200.00, avaliacaoCaixa: 237100, valorVenda: 244900, valorFinal: 244900, status: 'Disponível' },
  { id: 'u-0803', unidade: '0803', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 6016.99, avaliacaoCaixa: 246000, valorVenda: 247900, valorFinal: 247900, status: 'Disponível' },

  // 10º ANDAR
  { id: 'u-1001', unidade: '1001', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 6326.58, avaliacaoCaixa: 245600, valorVenda: 249900, valorFinal: 249900, status: 'Disponível' },
  { id: 'u-1003', unidade: '1003', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'DESCOBERTA', valorM2: 6184.47, avaliacaoCaixa: 254800, valorVenda: 254800, valorFinal: 254800, status: 'Disponível' },

  // 12º ANDAR
  { id: 'u-1201', unidade: '1201', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'DESCOBERTA', valorM2: 6453.16, avaliacaoCaixa: 245600, valorVenda: 254900, valorFinal: 254900, status: 'Disponível' },

  // 15º ANDAR (VAGA COBERTA)
  { id: 'u-1505', unidade: '1505', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'COBERTA', valorM2: 6579.75, avaliacaoCaixa: 259500, valorVenda: 259900, valorFinal: 259900, status: 'Disponível' },
  { id: 'u-1510', unidade: '1510', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'COBERTA', valorM2: 6606.80, avaliacaoCaixa: 272200, valorVenda: 272200, valorFinal: 272200, status: 'Disponível' },

  // 18º ANDAR (VAGA COBERTA)
  { id: 'u-1801', unidade: '1801', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'COBERTA', valorM2: 6706.33, avaliacaoCaixa: 262300, valorVenda: 264900, valorFinal: 264900, status: 'Disponível' },

  // 21º ANDAR (VAGA COBERTA)
  { id: 'u-2101', unidade: '2101', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'COBERTA', valorM2: 6959.49, avaliacaoCaixa: 262300, valorVenda: 274900, valorFinal: 274900, status: 'Disponível' },

  // 24º ANDAR (VAGA COBERTA)
  { id: 'u-2401', unidade: '2401', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'COBERTA', valorM2: 7086.08, avaliacaoCaixa: 262300, valorVenda: 279900, valorFinal: 279900, status: 'Disponível' },

  // 26º ANDAR (ANDAR ALTO VAGA COBERTA)
  { id: 'u-2601', unidade: '2601', tipologia: '02 Quartos Meio', areaM2: 39.50, vagas: 'COBERTA', valorM2: 7339.24, avaliacaoCaixa: 262300, valorVenda: 289900, valorFinal: 289900, status: 'Disponível' },
  { id: 'u-2603', unidade: '2603', tipologia: '02 Quartos Ponta', areaM2: 41.20, vagas: 'COBERTA', valorM2: 7157.77, avaliacaoCaixa: 272200, valorVenda: 294900, valorFinal: 294900, status: 'Disponível' },
  { id: 'u-2607', unidade: '2607', tipologia: '01 Quarto', areaM2: 37.98, vagas: 'COBERTA', valorM2: 6421.80, avaliacaoCaixa: 237200, valorVenda: 243900, valorFinal: 243900, status: 'Disponível' },
];

export const INC_PROJECT_INFO = {
  nomeEmpreendimento: 'PARK JARDIM DO SOL',
  construtora: 'INC Empreendimentos',
  localizacao: 'Uberlândia - MG',
  previsaoEntrega: '15/01/2030',
  avaliacaoCaixaInterna: 237100.00, // Armazenado internamente apenas
  valorTabelaImovel: 229900.00,
  maxParcelasEntrada: 108,
  qtdParcelasObra: 30,
  qtdParcelasPosObra: 78,
  
  // Taxas e Documentação
  registroItbiTotal: 6800.00,
  registroItbiParcelas: 36,
  registroItbiValorParcela: 188.89,
  tarifaBancaria: 1000.00,
  
  // Reajustes Oficiais
  correcaoObra: 'INCC (Reajuste sobre o saldo devedor durante a obra)',
  correcaoPosObra: 'IPCA + 1,99% a.a. no saldo devedor pós-obra',
  
  observacoes: [
    'ESTA É APENAS UMA SIMULAÇÃO - VALORES SUJEITOS A ALTERAÇÃO SEM AVISO PRÉVIO.',
    'CORREÇÃO DE 1,99% a.a. + IPCA NO VALOR DO SALDO DEVEDOR PÓS OBRA.',
    'OBRIGATÓRIO FIADOR COM CPF OK E RENDA COMPROVADA.',
    'AS PARCELAS DE INTERMEDIÁRIAS DEVEM SER PAGAS DENTRO DO PERÍODO DE OBRA.',
    'OBRIGATÓRIO INFORMAR COBRANÇA DE INCC.',
    'DOCUMENTAÇÃO (Registro + ITBI): R$ 6.800,00 parcelado em até 36x de R$ 188,89 + Tarifa bancária R$ 1.000,00.'
  ]
};
