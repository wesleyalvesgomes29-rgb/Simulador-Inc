import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, Home, CheckCircle2, Search, Car, Maximize2, AlertCircle, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { ParkUnit } from '../types';
import { INITIAL_PARK_UNITS } from '../data/jardimDoSolData';
import { formatBRL, parseBRLInput } from '../utils/formatters';

interface Step3EscolhaImovelProps {
  selectedUnit: ParkUnit | null;
  setSelectedUnit: (unit: ParkUnit | null) => void;
  valorImovel: number;
  setValorImovel: (val: number) => void;
  availableUnits?: ParkUnit[];
  onNext: () => void;
  onBack: () => void;
}

export const Step3EscolhaImovel: React.FC<Step3EscolhaImovelProps> = ({
  selectedUnit,
  setSelectedUnit,
  valorImovel,
  setValorImovel,
  availableUnits = INITIAL_PARK_UNITS,
  onNext,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(!selectedUnit && valorImovel > 0);
  const [displayCustomValor, setDisplayCustomValor] = useState<string>(
    valorImovel > 0 ? formatBRL(valorImovel) : ''
  );

  const cleanQuery = searchTerm.trim().toLowerCase();

  // Filter units strictly based on search term (only when typed)
  const matchingUnits = cleanQuery.length > 0
    ? availableUnits.filter((u) => {
        const numOnly = cleanQuery.replace(/\D/g, '');
        const unitNum = u.unidade.toLowerCase();
        
        // Match exact or partial unit number (e.g., "0101", "1510", "101")
        if (numOnly.length > 0) {
          return unitNum.includes(numOnly) || unitNum.includes(cleanQuery);
        }
        return unitNum.includes(cleanQuery);
      })
    : [];

  const handleSelectUnit = (unit: ParkUnit) => {
    setSelectedUnit(unit);
    setIsCustom(false);
    const precoVenda = unit.valorVenda || unit.valorFinal;
    setValorImovel(precoVenda);
  };

  const handleSelectCustom = () => {
    setSelectedUnit(null);
    setIsCustom(true);
    if (valorImovel === 0) {
      setValorImovel(229900);
      setDisplayCustomValor(formatBRL(229900));
    }
  };

  const handleCustomValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorImovel(numeric);
    setDisplayCustomValor(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valorImovel <= 0) return;
    onNext();
  };

  // Helper to format tipologia display (e.g., "02 Quartos GARDEN" -> "02 Quartos • Garden")
  const formatTipologia = (tipologia: string) => {
    if (tipologia.toLowerCase().includes('garden')) {
      return tipologia.replace(/garden/i, '• Garden');
    }
    if (tipologia.toLowerCase().includes('ponta')) {
      return tipologia.replace(/ponta/i, '• Ponta');
    }
    if (tipologia.toLowerCase().includes('meio')) {
      return tipologia.replace(/meio/i, '• Meio');
    }
    if (tipologia.toLowerCase().includes('pcd')) {
      return tipologia.replace(/pcd/i, '• PCD');
    }
    return tipologia;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Etapa 3 de 6 • PARK JARDIM DO SOL
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-400" />
              ESCOLHA A UNIDADE
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Field */}
          <div>
            <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-teal-400" />
              PESQUISAR UNIDADE
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o número da unidade (ex.: 0101)"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-teal-400 text-white font-bold text-base rounded-2xl pl-4 pr-10 py-3.5 outline-none shadow-inner placeholder:text-slate-500 transition-colors"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-xs font-bold bg-slate-800 text-slate-400 hover:text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Currently Selected Unit Banner (if user returns or has selected) */}
          {selectedUnit && !cleanQuery && !isCustom && (
            <div className="bg-emerald-950/60 border-2 border-emerald-500/50 p-4 rounded-2xl shadow-lg relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  UNIDADE ATUALMENTE SELECIONADA
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUnit(null);
                    setSearchTerm('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-400 underline"
                >
                  Trocar unidade
                </button>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-black text-white">
                    Unidade {selectedUnit.unidade}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    {formatTipologia(selectedUnit.tipologia)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedUnit.areaM2} m² • Vaga {selectedUnit.vagas.toLowerCase()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Valor de Venda
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    {formatBRL(selectedUnit.valorVenda || valorImovel)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          {cleanQuery.length > 0 && (
            <div className="space-y-3">
              {matchingUnits.length === 0 ? (
                /* Not Found Box */
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-2 my-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-slate-300 font-bold text-sm">
                    Unidade não encontrada. Confira o número informado.
                  </p>
                  <p className="text-slate-500 text-xs">
                    Tente digitar números como 0101, 0201, 0303, 1510, 2601...
                  </p>
                </div>
              ) : (
                /* Matching Units Cards */
                matchingUnits.map((u) => {
                  const isSelected = selectedUnit?.id === u.id && !isCustom;
                  const precoVendaOficial = u.valorVenda || u.valorFinal;

                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUnit(u)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-black text-white">
                              Unidade {u.unidade}
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                              Disponível
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 font-semibold">
                            {formatTipologia(u.tipologia)}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                              {u.areaM2} m²
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <Car className="w-3.5 h-3.5 text-teal-400" />
                              Vaga {u.vagas.toLowerCase()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                            VALOR DE VENDA
                          </span>
                          <span className="text-lg font-black text-emerald-400 block mt-0.5">
                            {formatBRL(precoVendaOficial)}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unidade Selecionada
                          </span>
                          <span className="bg-emerald-500/20 px-2 py-0.5 rounded">Preço Oficial INC</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Clean State Prompt when query is empty and no unit selected */}
          {!cleanQuery && !selectedUnit && !isCustom && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-2 my-2">
              <Home className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold text-sm">
                Digite o número da unidade no campo acima
              </p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                O sistema buscará instantaneamente o valor de venda e as características oficiais da unidade no Park Jardim do Sol.
              </p>
            </div>
          )}

          {/* Custom Price Manual Entry (Discrete Option at Bottom) */}
          <div className="pt-2">
            {!isCustom ? (
              <button
                type="button"
                onClick={handleSelectCustom}
                className="w-full text-center text-xs text-slate-400 hover:text-teal-300 font-semibold py-2 hover:underline transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                <span>Digitar outro valor de venda manualmente</span>
              </button>
            ) : (
              <div className="bg-slate-950 border border-teal-500/40 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 uppercase">
                    VALOR DE VENDA PERSONALIZADO (R$)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustom(false)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Voltar para busca
                  </button>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayCustomValor}
                  onChange={handleCustomValorChange}
                  placeholder="R$ 229.900,00"
                  className="w-full bg-slate-900 border border-slate-700 text-white font-black text-xl rounded-xl px-4 py-3 outline-none focus:border-teal-400"
                />
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={valorImovel <= 0}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>AVANÇAR PARA VALORES DO CLIENTE</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
