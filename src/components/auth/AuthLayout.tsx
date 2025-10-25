interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'cadastro' | 'forgot';
  onModeChange: (mode: 'login' | 'cadastro' | 'forgot') => void;
}

export function AuthLayout({ children, mode, onModeChange }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-dark/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Arena Dona Santa</h1>
            <p className="text-white/90 text-xs">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'cadastro' && 'Crie sua conta'}
              {mode === 'forgot' && 'Recuperar senha'}
            </p>
          </div>

          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex border-b-2 border-gray">
              <button
                onClick={() => onModeChange('login')}
                className={`flex-1 py-3 font-semibold transition-all text-sm ${
                  mode === 'login'
                    ? 'text-primary border-b-4 border-primary'
                    : 'text-dark/40 hover:text-dark/60'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => onModeChange('cadastro')}
                className={`flex-1 py-3 font-semibold transition-all text-sm ${
                  mode === 'cadastro'
                    ? 'text-primary border-b-4 border-primary'
                    : 'text-dark/40 hover:text-dark/60'
                }`}
              >
                Cadastrar
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}