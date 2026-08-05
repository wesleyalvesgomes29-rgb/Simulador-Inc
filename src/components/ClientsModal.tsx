import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Building2,
  DollarSign,
  Download
} from 'lucide-react';
import { 
  ClientLead, 
  getSavedClients, 
  deleteClientLead, 
  generateCrmText, 
  exportClientsToCsv 
} from '../utils/clientStorage';
import { formatBRL, copyToClipboard } from '../utils/formatters';

interface ClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: ClientLead) => void;
}

export const ClientsModal: React.FC<ClientsModalProps> = ({
  isOpen,
  onClose,
  onSelectClient,
}) => {
  const [clients, setClients] = useState<ClientLead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setClients(getSavedClients());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredClients = clients.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      (c.nome || '').toLowerCase().includes(search) ||
      (c.whatsapp || '').includes(search) ||
      (c.cpf || '').includes(search) ||
      (c.selectedUnit?.torre || '').toLowerCase().includes(search) ||
      (c.selectedUnit?.unidade || '').toLowerCase().includes(search)
    );
  });

  const handleCopyCrm = async (client: ClientLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const crmText = generateCrmText(client);
    const success = await copyToClipboard(crmText);
    if (success) {
      setCopiedId(client.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja excluir este cliente da lista do feirão?')) {
      deleteClientLead(id);
      setClients(getSavedClients());
    }
  };

  const handleExportCsv = () => {
    exportClientsToCsv(clients);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block mb-0.5">
              PAINEL DO CORRETOR • FEIRÃO MCMV
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              CLIENTES DO FEIRÃO ({clients.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, WhatsApp, CPF ou unidade..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 text-white font-medium text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none shadow-inner"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={clients.length === 0}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              title="Exportar planilha CSV para CRM"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Clients List Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <User className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-bold text-sm">Nenhum cliente cadastrado ainda.</p>
              <p className="text-slate-500 text-xs mt-1">
                Ao preencher a Etapa 1 e simular, os dados do cliente aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const formattedDate = new Date(client.dataCriacao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCopied = copiedId === client.id;

              return (
                <div
                  key={client.id}
                  onClick={() => {
                    onSelectClient(client);
                    onClose();
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all cursor-pointer relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-white text-base">
                          {client.nome || 'Cliente sem Nome'}
                        </span>
                        <span className="text-[10px] font-extrabold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                          {client.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-teal-400" />
                          {client.whatsapp || 'Sem celular'}
                        </span>

                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {formattedDate}
                        </span>

                        {client.selectedUnit && (
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <Building2 className="w-3.5 h-3.5" />
                            {client.selectedUnit.torre} - {client.selectedUnit.unidade}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Renda: <strong className="text-white">{formatBRL(client.renda)}</strong></span>
                        <span>•</span>
                        <span>Imóvel: <strong className="text-white">{formatBRL(client.valorImovel)}</strong></span>
                        <span>•</span>
                        <span>Entrada INC: <strong className="text-emerald-400">{formatBRL(client.valorEntradaInc)}</strong></span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800 justify-end">
                      <button
                        type="button"
                        onClick={(e) => handleCopyCrm(client, e)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                        title="Copiar Ficha do Cliente formatada para o CRM"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-slate-950" />
                            <span>COPIADO!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-teal-400" />
                            <span>COPIAR CRM</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(client.id, e)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                        title="Excluir Atendimento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-xs text-slate-400">
          <span>Armazenado localmente no celular/navegador do corretor.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
