export const MODALIDADES = [
  { value: 'society', label: 'Society', emoji: '⚽' },
  { value: 'beach_tennis', label: 'Beach Tennis', emoji: '🎾' },
  { value: 'volei', label: 'Vôlei', emoji: '🏐' },
  { value: 'futvolei', label: 'Futevôlei', emoji: '⚽🏐' }
] as const;

export type ModalidadeType = typeof MODALIDADES[number]['value'];

export const getModalidadeEmoji = (tipo: string) => {
  return MODALIDADES.find(m => m.value === tipo)?.emoji || '🏃';
};

export const getModalidadeLabel = (tipo: string) => {
  return MODALIDADES.find(m => m.value === tipo)?.label || tipo;
};