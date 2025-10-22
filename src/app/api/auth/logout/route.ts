import { NextResponse } from 'next/server';


export async function POST() {
  try {
    // Limpar cookie de autenticação
    const response = NextResponse.json({
      message: 'Logout realizado com sucesso'
    });

    response.cookies.delete('auth-token');
    
    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}