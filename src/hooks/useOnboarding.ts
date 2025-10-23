"use client";

import { useState, useEffect } from "react";

interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  content: string;
  completed: boolean;
}

interface OnboardingConfig {
  id: string;
  steps: Omit<OnboardingStep, 'completed'>[];
  autoStart?: boolean;
  skipCompleted?: boolean;
}

export function useOnboarding(config: OnboardingConfig) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Carregar estado do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`onboarding-${config.id}`);
    if (savedState) {
      const { completed, completedSteps: saved } = JSON.parse(savedState);
      setCompletedSteps(saved || []);
      setIsCompleted(completed || false);
    }

    // Auto-start se configurado e não completado
    if (config.autoStart && !isCompleted) {
      const timer = setTimeout(() => {
        start();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [config.id, config.autoStart, isCompleted]);

  // Salvar estado no localStorage
  const saveState = (completed: string[], finished: boolean) => {
    localStorage.setItem(`onboarding-${config.id}`, JSON.stringify({
      completed,
      completedSteps: completed,
      isCompleted: finished
    }));
  };

  const start = () => {
    if (isCompleted && config.skipCompleted) return;
    
    // Encontrar primeiro step não completado
    const firstIncompleteIndex = config.steps.findIndex(
      step => !completedSteps.includes(step.id)
    );
    
    setCurrentStepIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
    setIsActive(true);
  };

  const next = () => {
    const currentStep = config.steps[currentStepIndex];
    if (currentStep && !completedSteps.includes(currentStep.id)) {
      const newCompleted = [...completedSteps, currentStep.id];
      setCompletedSteps(newCompleted);
      saveState(newCompleted, false);
    }

    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      complete();
    }
  };

  const previous = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < config.steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const skip = () => {
    setIsActive(false);
  };

  const complete = () => {
    const allStepIds = config.steps.map(step => step.id);
    setCompletedSteps(allStepIds);
    setIsCompleted(true);
    setIsActive(false);
    saveState(allStepIds, true);
  };

  const reset = () => {
    setCompletedSteps([]);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setIsActive(false);
    localStorage.removeItem(`onboarding-${config.id}`);
  };

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      saveState(newCompleted, newCompleted.length === config.steps.length);
    }
  };

  const currentStep = config.steps[currentStepIndex];
  const progress = (completedSteps.length / config.steps.length) * 100;

  return {
    // Estado
    isActive,
    isCompleted,
    currentStep,
    currentStepIndex,
    completedSteps,
    progress,
    totalSteps: config.steps.length,
    
    // Ações
    start,
    next,
    previous,
    goToStep,
    skip,
    complete,
    reset,
    markStepCompleted,
    
    // Helpers
    isStepCompleted: (stepId: string) => completedSteps.includes(stepId),
    canGoNext: currentStepIndex < config.steps.length - 1,
    canGoPrevious: currentStepIndex > 0,
    isLastStep: currentStepIndex === config.steps.length - 1,
    isFirstStep: currentStepIndex === 0
  };
}

// Hook para onboarding específico do dashboard
export function useDashboardOnboarding() {
  return useOnboarding({
    id: 'dashboard',
    autoStart: true,
    skipCompleted: true,
    steps: [
      {
        id: 'welcome',
        target: '#dashboard-header',
        title: 'Bem-vindo ao Arena!',
        content: 'Este é seu painel principal onde você pode acompanhar todas suas atividades.'
      },
      {
        id: 'navigation',
        target: '#sidebar-navigation',
        title: 'Navegação',
        content: 'Use o menu lateral para navegar entre as diferentes seções da plataforma.'
      },
      {
        id: 'reservas',
        target: '[href="/cliente/reservas"]',
        title: 'Suas Reservas',
        content: 'Aqui você pode ver e gerenciar todas suas reservas de quadras.'
      },
      {
        id: 'turmas',
        target: '[href="/cliente/turmas"]',
        title: 'Turmas',
        content: 'Gerencie seus grupos fixos de jogadores e aulas regulares.'
      },
      {
        id: 'indicacoes',
        target: '[href="/cliente/indicacoes"]',
        title: 'Programa de Indicações',
        content: 'Indique amigos e ganhe créditos para usar na plataforma.'
      },
      {
        id: 'creditos',
        target: '#creditos-header',
        title: 'Seus Créditos',
        content: 'Acompanhe seu saldo de créditos e histórico de transações.'
      }
    ]
  });
}

// Hook para onboarding de nova funcionalidade
export function useFeatureOnboarding(featureId: string, steps: OnboardingConfig['steps']) {
  return useOnboarding({
    id: `feature-${featureId}`,
    autoStart: false,
    skipCompleted: true,
    steps
  });
}

// Hook para tooltips contextuais baseados em ações do usuário
export function useContextualHelp() {
  const [activeHelp, setActiveHelp] = useState<string | null>(null);
  const [helpHistory, setHelpHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('contextual-help-history');
    if (saved) {
      setHelpHistory(JSON.parse(saved));
    }
  }, []);

  const showHelp = (helpId: string) => {
    setActiveHelp(helpId);
    if (!helpHistory.includes(helpId)) {
      const newHistory = [...helpHistory, helpId];
      setHelpHistory(newHistory);
      localStorage.setItem('contextual-help-history', JSON.stringify(newHistory));
    }
  };

  const hideHelp = () => {
    setActiveHelp(null);
  };

  const hasSeenHelp = (helpId: string) => {
    return helpHistory.includes(helpId);
  };

  const clearHistory = () => {
    setHelpHistory([]);
    localStorage.removeItem('contextual-help-history');
  };

  return {
    activeHelp,
    showHelp,
    hideHelp,
    hasSeenHelp,
    clearHistory,
    helpHistory
  };
}