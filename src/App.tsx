/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  AppStep, 
  McmvBracket, 
  McmvSimulationResult, 
  ParkUnit, 
  IntermediariaItem,
  Empreendimento
} from './types';
import { INITIAL_MCMV_DATA, lookupMcmvTable } from './data/mcmvData';
import { INITIAL_PARK_UNITS } from './data/jardimDoSolData';
import { JARDIM_DO_SOL_EMPREENDIMENTO } from './data/developmentsData';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { Step2ClientData } from './components/Step2ClientData';
import { Step3McmvResult } from './components/Step3McmvResult';
import { Step3EscolhaImovel } from './components/Step3EscolhaImovel';
import { Step4ValoresCliente } from './components/Step4ValoresCliente';
import { Step5IncFlow } from './components/Step5IncFlow';
import { Step6Summary } from './components/Step6Summary';
import { TableDataModal } from './components/TableDataModal';
import { ClientsModal } from './components/ClientsModal';
import { saveClientLead, ClientLead } from './utils/clientStorage';

export default function App() {
  // Navigation Step - Start directly on Screen 1 (Cliente) for high speed in Feirão
  const [currentStep, setCurrentStep] = useState<AppStep>('dados_cliente');

  // Customer Data
  const [nomeCliente, setNomeCliente] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [income, setIncome] = useState<number>(3200);
  const [temDependente, setTemDependente] = useState<boolean>(true);
  const [isCotista, setIsCotista] = useState<boolean>(true);
  const [currentLeadId, setCurrentLeadId] = useState<string | undefined>(undefined);

  // MCMV & Unit Datasets
  const [mcmvData, setMcmvData] = useState<McmvBracket[]>(INITIAL_MCMV_DATA);

  // Selected Development, Unit & Property Value
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState<Empreendimento>(JARDIM_DO_SOL_EMPREENDIMENTO);
  const [parkUnits, setParkUnits] = useState<ParkUnit[]>(INITIAL_PARK_UNITS);
  const [selectedUnit, setSelectedUnit] = useState<ParkUnit | null>(INITIAL_PARK_UNITS[0]);
  const [valorImovel, setValorImovel] = useState<number>(INITIAL_PARK_UNITS[0].valorFinal);

  // CAIXA & Sinal Values
  const [financiamentoCaixa, setFinanciamentoCaixa] = useState<number>(184000);
  const [subsidioCaixa, setSubsidioCaixa] = useState<number>(32500);
  const [fgts, setFgts] = useState<number>(0);
  const [sinalAVista, setSinalAVista] = useState<number>(0);

  // INC Flow Setup
  const [numParcelasEntrada, setNumParcelasEntrada] = useState<number>(108);
  const [usarIntermediarias, setUsarIntermediarias] = useState<boolean>(false);
  const [intermediarias, setIntermediarias] = useState<IntermediariaItem[]>([]);

  // Modals
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState<boolean>(false);

  // Calculate MCMV simulation result dynamically
  const simulationResult: McmvSimulationResult = lookupMcmvTable(
    income,
    temDependente,
    isCotista,
    mcmvData
  );

  // Entry Total calculation
  const valorEntradaTotal = Math.max(
    0,
    valorImovel - financiamentoCaixa - subsidioCaixa - fgts
  );

  // Helper to persist/sync active simulation state to local storage for the broker
  const autoSaveLead = (statusStr: 'Em Atendimento' | 'Proposta Gerada' = 'Em Atendimento') => {
    if (!nomeCliente.trim()) return;

    const lead = saveClientLead({
      id: currentLeadId,
      nome: nomeCliente,
      whatsapp,
      email,
      cpf,
      renda: income,
      temDependente,
      isCotista,
      selectedUnit,
      valorImovel,
      financiamentoCaixa,
      subsidioCaixa,
      fgts,
      sinalAVista,
      numParcelasEntrada,
      usarIntermediarias,
      valorEntradaInc: valorEntradaTotal,
      status: statusStr,
    });

    if (lead && lead.id) {
      setCurrentLeadId(lead.id);
    }
  };

  // Sync MCMV lookup to CAIXA financing & subsidy fields when moving from Step 1 to Step 2
  const handleCalculateMcmv = () => {
    const res = lookupMcmvTable(income, temDependente, isCotista, mcmvData);
    setFinanciamentoCaixa(res.financiamento);
    setSubsidioCaixa(res.subsidio);
    autoSaveLead('Em Atendimento');
    setCurrentStep('resultado_mcmv');
  };

  // Load a saved client into state
  const handleSelectSavedClient = (client: ClientLead) => {
    setCurrentLeadId(client.id);
    setNomeCliente(client.nome);
    setWhatsapp(client.whatsapp || '');
    setEmail(client.email || '');
    setCpf(client.cpf || '');
    setIncome(client.renda);
    setTemDependente(client.temDependente);
    setIsCotista(client.isCotista);
    setSelectedUnit(client.selectedUnit || parkUnits[0]);
    setValorImovel(client.valorImovel);
    setFinanciamentoCaixa(client.financiamentoCaixa);
    setSubsidioCaixa(client.subsidioCaixa);
    setFgts(client.fgts);
    setSinalAVista(client.sinalAVista);
    setNumParcelasEntrada(client.numParcelasEntrada);
    setUsarIntermediarias(client.usarIntermediarias);

    if (client.status === 'Proposta Gerada') {
      setCurrentStep('resumo_final');
    } else {
      setCurrentStep('dados_cliente');
    }
  };

  // Reset function to restart simulation
  const handleReset = () => {
    setCurrentStep('dados_cliente');
    setCurrentLeadId(undefined);
    setNomeCliente('');
    setWhatsapp('');
    setEmail('');
    setCpf('');
    setIncome(3200);
    setTemDependente(true);
    setIsCotista(true);
    setFgts(0);
    setSinalAVista(0);
    setNumParcelasEntrada(108);
    setUsarIntermediarias(false);
    setIntermediarias([]);
    if (parkUnits.length > 0) {
      setSelectedUnit(parkUnits[0]);
      setValorImovel(parkUnits[0].valorFinal);
    }
  };

  const handleResetDataToDefault = () => {
    setMcmvData(INITIAL_MCMV_DATA);
    setParkUnits(INITIAL_PARK_UNITS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Sticky Header */}
      <Header
        currentStep={currentStep}
        onReset={handleReset}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenClientsModal={() => setIsClientsModalOpen(true)}
      />

      {/* Visual Step Progress Indicator */}
      <StepIndicator
        currentStep={currentStep}
        onNavigateToStep={(step) => setCurrentStep(step)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        <AnimatePresence mode="wait">
          {currentStep === 'dados_cliente' && (
            <Step2ClientData
              key="dados_cliente"
              nomeCliente={nomeCliente}
              setNomeCliente={setNomeCliente}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              email={email}
              setEmail={setEmail}
              cpf={cpf}
              setCpf={setCpf}
              income={income}
              setIncome={setIncome}
              temDependente={temDependente}
              setTemDependente={setTemDependente}
              isCotista={isCotista}
              setIsCotista={setIsCotista}
              onNext={handleCalculateMcmv}
            />
          )}

          {currentStep === 'resultado_mcmv' && (
            <Step3McmvResult
              key="resultado_mcmv"
              simulationResult={simulationResult}
              nomeCliente={nomeCliente}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('escolha_imovel');
              }}
              onBack={() => setCurrentStep('dados_cliente')}
              onEditClientData={() => setCurrentStep('dados_cliente')}
            />
          )}

          {currentStep === 'escolha_imovel' && (
            <Step3EscolhaImovel
              key="escolha_imovel"
              selectedEmpreendimento={selectedEmpreendimento}
              setSelectedEmpreendimento={setSelectedEmpreendimento}
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              valorImovel={valorImovel}
              setValorImovel={setValorImovel}
              setNumParcelasEntrada={setNumParcelasEntrada}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('valores_cliente');
              }}
              onBack={() => setCurrentStep('resultado_mcmv')}
            />
          )}

          {currentStep === 'valores_cliente' && (
            <Step4ValoresCliente
              key="valores_cliente"
              empreendimento={selectedEmpreendimento}
              valorImovel={valorImovel}
              financiamentoCaixa={financiamentoCaixa}
              subsidioCaixa={subsidioCaixa}
              fgts={fgts}
              setFgts={setFgts}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('fluxo_inc');
              }}
              onBack={() => setCurrentStep('escolha_imovel')}
            />
          )}

          {currentStep === 'fluxo_inc' && (
            <Step5IncFlow
              key="fluxo_inc"
              empreendimento={selectedEmpreendimento}
              valorEntradaTotal={valorEntradaTotal}
              sinalAVista={sinalAVista}
              setSinalAVista={setSinalAVista}
              numParcelasEntrada={numParcelasEntrada}
              setNumParcelasEntrada={setNumParcelasEntrada}
              usarIntermediarias={usarIntermediarias}
              setUsarIntermediarias={setUsarIntermediarias}
              intermediarias={intermediarias}
              setIntermediarias={setIntermediarias}
              onNext={() => {
                autoSaveLead('Proposta Gerada');
                setCurrentStep('resumo_final');
              }}
              onBack={() => setCurrentStep('valores_cliente')}
            />
          )}

          {currentStep === 'resumo_final' && (
            <Step6Summary
              key="resumo_final"
              nomeCliente={nomeCliente}
              whatsapp={whatsapp}
              email={email}
              cpf={cpf}
              empreendimento={selectedEmpreendimento}
              simulationResult={simulationResult}
              selectedUnit={selectedUnit}
              valorImovel={valorImovel}
              financiamentoCaixa={financiamentoCaixa}
              subsidioCaixa={subsidioCaixa}
              fgts={fgts}
              sinalAVista={sinalAVista}
              numParcelasEntrada={numParcelasEntrada}
              usarIntermediarias={usarIntermediarias}
              intermediarias={intermediarias}
              onBack={() => setCurrentStep('fluxo_inc')}
              onEditStep={(step) => {
                setCurrentStep(step);
              }}
              onNewSimulation={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Reference Table Inspection Modal */}
      <TableDataModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        mcmvData={mcmvData}
        setMcmvData={setMcmvData}
        parkUnits={parkUnits}
        setParkUnits={setParkUnits}
        onResetData={handleResetDataToDefault}
      />

      {/* Clientes do Feirão Panel Modal */}
      <ClientsModal
        isOpen={isClientsModalOpen}
        onClose={() => setIsClientsModalOpen(false)}
        onSelectClient={handleSelectSavedClient}
      />
    </div>
  );
}
