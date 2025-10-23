import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AvaliacaoStats } from '@/types/avaliacoes.types';

/**
 * GET /api/avaliacoes/stats
 * Obter estatísticas de avaliações
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todas as avaliações
    const { data: avaliacoes, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        reserva:reservations!reviews_reserva_id_fkey(
          quadra_id,
          quadra:courts!reservations_quadra_id_fkey(id, nome)
        )
      `);

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar estatísticas' },
        { status: 500 }
      );
    }

    if (!avaliacoes || avaliacoes.length === 0) {
      // Retornar estatísticas vazias
      const emptyStats: AvaliacaoStats = {
        mediaGeral: 0,
        totalAvaliacoes: 0,
        distribuicao: [
          { rating: 5, quantidade: 0, percentual: 0 },
          { rating: 4, quantidade: 0, percentual: 0 },
          { rating: 3, quantidade: 0, percentual: 0 },
          { rating: 2, quantidade: 0, percentual: 0 },
          { rating: 1, quantidade: 0, percentual: 0 },
        ],
        porQuadra: [],
      };
      return NextResponse.json(emptyStats);
    }

    // Calcular média geral
    const totalAvaliacoes = avaliacoes.length;
    const somaRatings = avaliacoes.reduce((sum, a) => sum + a.rating, 0);
    const mediaGeral = somaRatings / totalAvaliacoes;

    // Calcular distribuição
    const distribuicao = [5, 4, 3, 2, 1].map((rating) => {
      const quantidade = avaliacoes.filter((a) => a.rating === rating).length;
      const percentual = (quantidade / totalAvaliacoes) * 100;
      return {
        rating: rating as 1 | 2 | 3 | 4 | 5,
        quantidade,
        percentual: Math.round(percentual * 10) / 10,
      };
    });

    // Calcular por quadra
    const quadrasMap = new Map<string, { nome: string; ratings: number[] }>();
    
    avaliacoes.forEach((avaliacao) => {
      if (avaliacao.reserva?.quadra) {
        const quadraId = avaliacao.reserva.quadra_id;
        const quadraNome = avaliacao.reserva.quadra.nome;
        
        if (!quadrasMap.has(quadraId)) {
          quadrasMap.set(quadraId, { nome: quadraNome, ratings: [] });
        }
        
        quadrasMap.get(quadraId)!.ratings.push(avaliacao.rating);
      }
    });

    const porQuadra = Array.from(quadrasMap.entries()).map(([quadra_id, data]) => {
      const total = data.ratings.length;
      const soma = data.ratings.reduce((sum, r) => sum + r, 0);
      const media = soma / total;
      
      return {
        quadra_id,
        quadra_nome: data.nome,
        media: Math.round(media * 10) / 10,
        total,
      };
    }).sort((a, b) => b.media - a.media);

    const stats: AvaliacaoStats = {
      mediaGeral: Math.round(mediaGeral * 10) / 10,
      totalAvaliacoes,
      distribuicao,
      porQuadra,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro na API de estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
