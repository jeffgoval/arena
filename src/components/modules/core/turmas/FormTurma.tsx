'use client';

import { useState } from 'react';
import { User, Mail, Phone, Plus, Trash2, X } from 'lucide-react';
import type { Team } from '@/types/turmas.types';
import type { TeamFormData, TeamMemberFormData } from '@/lib/validations/turma.schema';

interface FormTurmaProps {
  turma?: Team;
  onSubmit: (data: TeamFormData) => Promise<void>;
  onCancel: () => void;
}

export function FormTurma({ turma, onSubmit, onCancel }: FormTurmaProps) {
  const [nome, setNome] = useState(turma?.nome || '');
  const [descricao, setDescricao] = useState(turma?.descricao || '');
  const [membros, setMembros] = useState<TeamMemberFormData[]>(
    turma?.membros?.map(m => ({
      nome: m.nome,
      email: m.email || '',
      whatsapp: m.whatsapp || '',
      status: m.status,
    })) || []
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addMembro = () => {
    setMembros([
      ...membros,
      { nome: '', email: '', whatsapp: '', status: 'fixo' },
    ]);
  };

  const removeMembro = (index: number) => {
    setMembros(membros.filter((_, i) => i !== index));
  };

  const updateMembro = (index: number, field: keyof TeamMemberFormData, value: string) => {
    const newMembros = [...membros];
    (newMembros[index] as any)[field] = value;
    setMembros(newMembros);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!nome.trim()) {
      setError('Nome da turma é obrigatório');
      return;
    }

    if (membros.length === 0) {
      setError('Adicione pelo menos um membro');
      return;
    }

    // Validar membros
    for (let i = 0; i < membros.length; i++) {
      if (!membros[i].nome.trim()) {
        setError(`Nome do membro ${i + 1} é obrigatório`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({ nome, descricao, membros });
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar turma');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Nome da Turma */}
      <div>
        <label className="block text-sm font-bold text-dark mb-2">
          Nome da Turma *
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Ex: Pelada de Quinta"
          className="w-full px-4 py-3 border-2 border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-bold text-dark mb-2">
          Descrição (opcional)
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Time fixo de quinta-feira à noite"
          rows={3}
          className="w-full px-4 py-3 border-2 border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Membros */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-bold text-dark">
            Membros * ({membros.length})
          </label>
          <button
            type="button"
            onClick={addMembro}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </button>
        </div>

        {membros.length === 0 ? (
          <div className="p-8 bg-gray rounded-xl border-2 border-dashed border-dark/20 text-center">
            <User className="w-12 h-12 mx-auto text-dark/20 mb-3" />
            <p className="text-dark/60 text-sm mb-4">Nenhum membro adicionado</p>
            <button
              type="button"
              onClick={addMembro}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Membro
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {membros.map((membro, index) => (
              <div key={index} className="p-4 bg-gray rounded-xl border-2 border-dark/10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Nome */}
                    <div>
                      <input
                        type="text"
                        value={membro.nome}
                        onChange={(e) => updateMembro(index, 'nome', e.target.value)}
                        required
                        placeholder="Nome do membro *"
                        className="w-full px-3 py-2 text-sm border-2 border-dark/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>

                    {/* Email e WhatsApp */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                        <input
                          type="email"
                          value={membro.email}
                          onChange={(e) => updateMembro(index, 'email', e.target.value)}
                          placeholder="Email"
                          className="w-full pl-8 pr-3 py-2 text-sm border-2 border-dark/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                        <input
                          type="tel"
                          value={membro.whatsapp}
                          onChange={(e) => updateMembro(index, 'whatsapp', e.target.value)}
                          placeholder="WhatsApp"
                          className="w-full pl-8 pr-3 py-2 text-sm border-2 border-dark/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`status-${index}`}
                          checked={membro.status === 'fixo'}
                          onChange={() => updateMembro(index, 'status', 'fixo')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm font-semibold text-dark">Fixo</span>
                        <span className="text-xs text-dark/60">(sempre incluído)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer ml-4">
                        <input
                          type="radio"
                          name={`status-${index}`}
                          checked={membro.status === 'variavel'}
                          onChange={() => updateMembro(index, 'status', 'variavel')}
                          className="w-4 h-4 text-secondary"
                        />
                        <span className="text-sm font-semibold text-dark">Variável</span>
                        <span className="text-xs text-dark/60">(opcional)</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMembro(index)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t-2 border-dark/10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-white border-2 border-dark/10 hover:border-dark/30 text-dark font-semibold rounded-xl transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : turma ? 'Salvar Alterações' : 'Criar Turma'}
        </button>
      </div>
    </form>
  );
}
