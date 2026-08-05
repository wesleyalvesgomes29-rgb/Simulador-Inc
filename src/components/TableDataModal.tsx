import React, { useState } from 'react';
import { X, Table, Search, Plus, Edit2, Trash2, Check, RotateCcw, Building2, ShieldCheck } from 'lucide-react';
import { McmvBracket, ParkUnit } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';

interface TableDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcmvData: McmvBracket[];
  setMcmvData: React.Dispatch<React.SetStateAction<McmvBracket[]>>;
  parkUnits: ParkUnit[];
  setParkUnits: React.Dispatch<React.SetStateAction<ParkUnit[]>>;
  onResetData: () => void;
}

export const TableDataModal: React.FC<TableDataModalProps> = ({
  isOpen,
  onClose,
  mcmvData,
  setMcmvData,
  parkUnits,
  setParkUnits,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'mcmv' | 'jardim'>('mcmv');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredMcmv = mcmvData.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.faixa.toLowerCase().includes(q) ||
      b.minRenda.toString().includes(q) ||
      b.maxRenda.toString().includes(q) ||
      (b.obs && b.obs.toLowerCase().includes(q))
    );
  });

  const filteredUnits = parkUnits.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.torre.toLowerCase().includes(q) ||
      u.unidade.toLowerCase().includes(q) ||
      u.tipologia.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                CONSULTA & CONFIGURAÇÃO DE TABELAS
              </h2>
              <p className="text-xs text-slate-400">
                MCMV_DATA e JARDIM_DO_SOL_FLUXO (Feirão 04/2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('mcmv')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'mcmv'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MCMV_DATA ({mcmvData.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('jardim')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'jardim'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UNIDADES PARK JARDIM DO SOL ({parkUnits.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por faixa, valor, torre..."
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Modal Body Table Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'mcmv' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tabela de Referência MCMV - Uberlândia/MG (Tabela PRICE)
                </span>
                <button
                  type="button"
                  onClick={onResetData}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Faixa</th>
                      <th className="p-3">Faixa Renda</th>
                      <th className="p-3">Perfil</th>
                      <th className="p-3">Financ. Máx</th>
                      <th className="p-3">Subsídio</th>
                      <th className="p-3">Parcela</th>
                      <th className="p-3">Juros</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredMcmv.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/50">
                        <td className="p-3">
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-white font-bold">
                            {item.faixa}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">
                          R$ {item.minRenda.toLocaleString('pt-BR')} - R$ {item.maxRenda.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.isCotista ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.isCotista ? 'Cotista' : 'Não Cot.'} | {item.temDependente ? 'c/ Dep' : 's/ Dep'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          {formatBRL(item.financiamentoMax)}
                        </td>
                        <td className="p-3 font-bold text-teal-300">
                          {formatBRL(item.subsidioMax)}
                        </td>
                        <td className="p-3 text-white font-bold">
                          {formatBRL(item.parcelaEstimada)}
                        </td>
                        <td className="p-3 text-teal-300">
                          {formatPercent(item.taxaJurosAnual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Catálogo de Unidades - Park Jardim do Sol
                </span>
                <button
                  type="button"
                  onClick={onResetData}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Unidade</th>
                      <th className="p-3">Tipologia</th>
                      <th className="p-3">Área (m²)</th>
                      <th className="p-3">Vagas</th>
                      <th className="p-3">Valor m²</th>
                      <th className="p-3">Valor de Venda</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredUnits.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-teal-300 font-extrabold">{u.unidade}</td>
                        <td className="p-3 text-slate-300">{u.tipologia}</td>
                        <td className="p-3">{u.areaM2} m²</td>
                        <td className="p-3">{u.vagas}</td>
                        <td className="p-3 text-slate-400">{formatBRL(u.valorM2)}</td>
                        <td className="p-3 font-black text-emerald-400">
                          {formatBRL(u.valorVenda || u.valorFinal)}
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 px-5 rounded-xl cursor-pointer"
          >
            FECHAR CONSULTA
          </button>
        </div>
      </div>
    </div>
  );
};
