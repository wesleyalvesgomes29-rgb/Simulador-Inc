export interface IncTipologia {
  id: string;
  nome: string;
  descricao: string;
  areaM2: number;
  quartos: number;
  suites: number;
  vagas: number;
  valorPadrao: number;
  destaque?: boolean;
}

export interface IncEmpreendimento {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  bairro: string;
  previsaoEntrega: string;
  mesesObra: number;
  mesesPosObra: number;
  maxParcelasProSoluto: number;
  limiteProSolutoPercent: number; // 23% da INC
  tipologias: IncTipologia[];
  descricao: string;
}

export const INC_EMPREENDIMENTOS: IncEmpreendimento[] = [
  {
    id: 'park-jardim-do-sol',
    nome: 'Park Jardim do Sol',
    cidade: 'Uberlândia',
    estado: 'MG',
    bairro: 'Granja Marileusa / Região Leste',
    previsaoEntrega: 'Dezembro/2028',
    mesesObra: 30,
    mesesPosObra: 44,
    maxParcelasProSoluto: 74,
    limiteProSolutoPercent: 23,
    descricao: 'Empreendimento MCMV completo com lazer, portaria 24h, piscina, salão de festas e plantas modernas.',
    tipologias: [
      {
        id: '2q-varanda',
        nome: '2 Quartos com Varanda',
        descricao: 'Apartamento com 2 quartos, varanda gourmet integrada e 1 vaga de garagem.',
        areaM2: 46.50,
        quartos: 2,
        suites: 0,
        vagas: 1,
        valorPadrao: 199900,
        destaque: true,
      },
      {
        id: '2q-suite-varanda',
        nome: '2 Quartos com Suíte e Varanda',
        descricao: 'Apartamento amplo com suíte master, varanda e acabamento diferenciado.',
        areaM2: 52.80,
        quartos: 2,
        suites: 1,
        vagas: 1,
        valorPadrao: 229900,
        destaque: false,
      },
      {
        id: '2q-garden',
        nome: '2 Quartos Garden com Quintal',
        descricao: 'Apartamento térreo com quintal privativo e espaço gourmet exclusivo.',
        areaM2: 64.20,
        quartos: 2,
        suites: 1,
        vagas: 1,
        valorPadrao: 259900,
        destaque: false,
      },
    ],
  },
];

export const EMPREENDIMENTO_PADRAO_INC = INC_EMPREENDIMENTOS[0];
