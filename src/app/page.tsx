import Image from "next/image";
import Link from "next/link";
import { AnimationObserver } from "@/components/AnimationObserver";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <AnimationObserver />

      {/* Header de Navegação */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo-arena.png"
                alt="Arena Dona Santa"
                width={50}
                height={50}
                className="drop-shadow-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Arena Dona Santa
                </h1>
                <p className="text-xs text-dark/60">Governador Valadares</p>
              </div>
            </div>

            {/* Menu de Navegação */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#modalidades" className="text-dark/70 hover:text-primary font-semibold transition-colors">
                Modalidades
              </a>
              <a href="#features" className="text-dark/70 hover:text-primary font-semibold transition-colors">
                Recursos
              </a>
              <a href="#contato" className="text-dark/70 hover:text-primary font-semibold transition-colors">
                Contato
              </a>
            </nav>

            {/* Botões de Ação */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-3 md:px-4 py-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm md:text-base">
                  Entrar
                </button>
              </Link>
              <Link href="/cadastro">
                <button className="btn-hover px-4 md:px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-lg shadow-lg text-sm md:text-base">
                  Criar Conta
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0 z-0">
          <Image
            src="/hero-arena.jpg"
            alt="Arena Dona Santa - Governador Valadares"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container-custom relative z-10 text-center text-white py-20">
          <div className="mb-4 fade-in">
            <span className="inline-block bg-primary/90 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              A Melhor Arena de Governador Valadares
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 fade-in leading-tight">
            Bem-vindo à
            <br />
            <span className="gradient-text">Arena Dona Santa</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 fade-in leading-relaxed">
            Reserve sua quadra online, organize turmas e gerencie tudo em um só lugar.
            Futebol Society e Futsal com a melhor estrutura da região.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16 fade-in">
            <Link href="/login">
              <button className="btn-hover bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-lg text-lg font-bold shadow-2xl w-full">
                ⚽ Reservar Quadra
              </button>
            </Link>
            <a href="#academia-galo">
              <button className="btn-hover bg-yellow-500 hover:bg-yellow-600 text-dark px-6 py-4 rounded-lg text-lg font-black shadow-2xl w-full">
                ⚽ Academia do Galo
              </button>
            </a>
            <a href="#day-use">
              <button className="btn-hover bg-secondary hover:bg-secondary/90 text-white px-6 py-4 rounded-lg text-lg font-bold shadow-2xl w-full">
                🏊 Day Use
              </button>
            </a>
          </div>

          <div className="flex flex-wrap gap-8 justify-center text-sm md:text-base fade-in">
            <span className="flex items-center gap-2">
              <span className="text-2xl">⚽</span> 5 Modalidades
            </span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">🎓</span> Aulas com Professores
            </span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">🏊</span> Piscina + Bar
            </span>
            <span className="flex items-center gap-2">
              <span className="text-2xl">📍</span> Governador Valadares
            </span>
          </div>
        </div>
      </section>

      {/* Infraestrutura Completa */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
              Infraestrutura Completa
            </h2>
            <p className="text-xl md:text-2xl text-dark/70 max-w-4xl mx-auto leading-relaxed fade-in">
              Contamos com <strong>1 campo society de grama sintética</strong> e <strong>4 quadras de areia multifuncionais</strong> para Beach Tennis, Vôlei de Praia e Futevôlei.
              Oferecemos uma experiência ao ar livre em contato com a natureza, com quadras sombreadas por árvores de grande porte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Texto Destaque */}
            <div className="slide-in-left flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🌳
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-dark">Contato com a Natureza</h3>
                    <p className="text-dark/70 leading-relaxed">
                      Ambiente ao ar livre com quadras sombreadas por árvores de grande porte. Jogue com conforto e bem-estar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🍺
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-dark">Bar e Área de Convivência</h3>
                    <p className="text-dark/70 leading-relaxed">
                      Relaxe após o jogo no nosso bar com espaço de convivência. Brinquedos para as crianças se divertirem enquanto você joga.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎥
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-dark">Sistema Replay Sports</h3>
                    <p className="text-dark/70 leading-relaxed">
                      Grave seus jogos e reveja suas melhores jogadas! Sistema profissional de gravação disponível.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de Destaques */}
            <div className="slide-in-right space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border-2 border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">⚽</span>
                  <div>
                    <h3 className="text-2xl font-bold text-dark">Campo Society</h3>
                    <p className="text-primary font-semibold">45x25m • Grama Sintética</p>
                  </div>
                </div>
                <p className="text-dark/70 leading-relaxed">
                  Gramado sintético de última geração com dimensões oficiais, perfeito para partidas de 7x7.
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-8 border-2 border-secondary/20">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">🏐</span>
                  <div>
                    <h3 className="text-2xl font-bold text-dark">Quadras de Areia</h3>
                    <p className="text-secondary font-semibold">4 Quadras Multifuncionais</p>
                  </div>
                </div>
                <p className="text-dark/70 leading-relaxed">
                  Areia branca de qualidade para Beach Tennis, Vôlei de Praia e Futevôlei. Modalidades variadas para todos!
                </p>
              </div>
            </div>
          </div>

          {/* Ícones de Facilidades */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-gray flex items-center justify-center mx-auto mb-3 text-4xl">
                ⚽
              </div>
              <h4 className="font-bold text-dark mb-1">Campo Society</h4>
              <p className="text-sm text-dark/60">45x25m grama sintética</p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-gray flex items-center justify-center mx-auto mb-3 text-4xl">
                🏖️
              </div>
              <h4 className="font-bold text-dark mb-1">4 Quadras Areia</h4>
              <p className="text-sm text-dark/60">Beach, Vôlei, Futevôlei</p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-gray flex items-center justify-center mx-auto mb-3 text-4xl">
                🎥
              </div>
              <h4 className="font-bold text-dark mb-1">Replay Sports</h4>
              <p className="text-sm text-dark/60">Gravação de jogos</p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-gray flex items-center justify-center mx-auto mb-3 text-4xl">
                🍺
              </div>
              <h4 className="font-bold text-dark mb-1">Bar Completo</h4>
              <p className="text-sm text-dark/60">Vestiários e estacionamento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades Esportivas */}
      <section id="modalidades" className="section-padding bg-gray">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 fade-in">
              Modalidades Esportivas
            </h2>
            <p className="text-xl text-dark/70 fade-in">
              Diversas opções para você se divertir e praticar esportes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Futebol Society */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-7xl">⚽</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Futebol Society
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Campo 45x25m com grama sintética de alta qualidade. Partidas de 7x7.
                </p>
                <Link href="/login">
                  <button className="btn-hover bg-primary text-white px-6 py-3 rounded-lg font-semibold w-full">
                    Reservar Agora
                  </button>
                </Link>
              </div>
            </div>

            {/* Beach Tennis */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <span className="text-7xl">🎾</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Beach Tennis
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Quadras de areia branca com infraestrutura completa. Diversão garantida!
                </p>
                <Link href="/login">
                  <button className="btn-hover bg-secondary text-white px-6 py-3 rounded-lg font-semibold w-full">
                    Reservar Agora
                  </button>
                </Link>
              </div>
            </div>

            {/* Vôlei de Praia */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <span className="text-7xl">🏐</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Vôlei de Praia
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Areia de qualidade e espaço adequado para jogos e treinos.
                </p>
                <Link href="/login">
                  <button className="btn-hover bg-accent text-white px-6 py-3 rounded-lg font-semibold w-full">
                    Reservar Agora
                  </button>
                </Link>
              </div>
            </div>

            {/* Futevôlei */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-7xl">⚽🏐</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Futevôlei
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Modalidade que une futebol e vôlei em quadras de areia.
                </p>
                <Link href="/login">
                  <button className="btn-hover bg-primary text-white px-6 py-3 rounded-lg font-semibold w-full">
                    Reservar Agora
                  </button>
                </Link>
              </div>
            </div>

            {/* Eventos */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                <span className="text-7xl">🎉</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Eventos Esportivos
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Espaço perfeito para torneios, campeonatos e confraternizações.
                </p>
                <button className="btn-hover bg-secondary text-white px-6 py-3 rounded-lg font-semibold w-full">
                  Saiba Mais
                </button>
              </div>
            </div>

            {/* Área Kids */}
            <div className="feature-card card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                <span className="text-7xl">🧒</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-dark">
                  Área Kids
                </h3>
                <p className="text-dark/70 mb-4 leading-relaxed">
                  Brinquedos para as crianças enquanto você se diverte!
                </p>
                <button className="btn-hover bg-accent text-white px-6 py-3 rounded-lg font-semibold w-full">
                  Ver Estrutura
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 fade-in text-dark">
              Por Que Escolher a Arena Dona Santa?
            </h2>
            <p className="text-xl text-dark/70 fade-in">
              A melhor estrutura e tecnologia para seus jogos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">
                Estrutura Completa
              </h3>
              <p className="text-dark/70">
                Vestiários, estacionamento, arquibancadas e lanchonete
              </p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                💡
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">
                Iluminação LED
              </h3>
              <p className="text-dark/70">
                Jogue até mais tarde com iluminação profissional de alta qualidade
              </p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                🔒
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">
                Segurança Total
              </h3>
              <p className="text-dark/70">
                Monitoramento 24h e equipe sempre presente
              </p>
            </div>

            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                📱
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">
                Reserva Online
              </h3>
              <p className="text-dark/70">
                Sistema moderno para reservar e gerenciar suas partidas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academia do Galo - Destaque */}
      <section id="academia-galo" className="relative section-padding bg-gradient-to-br from-dark via-gray-900 to-dark text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)"}}>
</div>
        </div>

        <div className="container-custom relative z-10">
          {/* Badge Oficial */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-dark px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider shadow-2xl">
              ⚽ Unidade Oficial Credenciada ⚽
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Lado Esquerdo - Conteúdo */}
            <div className="slide-in-left">
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Academia de Futebol
                </span>
                <br />
                <span className="text-yellow-500">do Galo</span>
              </h2>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                <p className="text-2xl font-bold mb-2">Unidade Governador Valadares</p>
                <p className="text-xl text-white/90">
                  Metodologia oficial do <strong className="text-yellow-500">Clube Atlético Mineiro</strong>
                </p>
              </div>

              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Treinos estruturados com exercícios técnicos, táticos e preparação física,
                levando a qualidade de clube grande para o nível local.
                <strong> Formação integral</strong> que valoriza tanto o atleta quanto o ser humano.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/login">
                  <button className="btn-hover bg-yellow-500 hover:bg-yellow-600 text-dark px-8 py-4 rounded-lg text-lg font-black shadow-2xl w-full sm:w-auto">
                    ⚽ Inscrever na Academia do Galo
                  </button>
                </Link>
                <button className="btn-hover bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:bg-white/30 text-white px-8 py-4 rounded-lg text-lg font-bold">
                  📋 Ver Turmas e Horários
                </button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">✓</span>
                  <span>5 mil alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">✓</span>
                  <span>50+ unidades Brasil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">✓</span>
                  <span>Metodologia CAM</span>
                </div>
              </div>
            </div>

            {/* Lado Direito - Diferenciais */}
            <div className="slide-in-right">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-black mb-6 text-yellow-500">
                  🏆 Por Que Escolher a Academia do Galo?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      ⚽
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Metodologia Oficial</h4>
                      <p className="text-sm text-white/70">Mesma metodologia das categorias de base do Galo</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      🎯
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Peneiras Oficiais</h4>
                      <p className="text-sm text-white/70">Testes em parceria com o Atlético Mineiro</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      🏟️
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Visitas Exclusivas</h4>
                      <p className="text-sm text-white/70">Cidade do Galo e Arena MRV</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      📱
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">App Dedicado</h4>
                      <p className="text-sm text-white/70">Pais acompanham o progresso em tempo real</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      👧👦
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Inclusão Total</h4>
                      <p className="text-sm text-white/70">Turmas mistas para meninos e meninas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold text-xl">
                      🏆
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Match Days + Torneios</h4>
                      <p className="text-sm text-white/70">Participação em copas e ativações nos jogos do Galo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chamada Final */}
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-500/50">
              <h3 className="text-3xl font-black mb-4">
                💪 Chance Real de Ingressar na Base do Atlético!
              </h3>
              <p className="text-xl text-white/90 mb-6">
                Nossa parceria oficial oferece oportunidades concretas de profissionalização.
                Valores humanos: <strong>disciplina, trabalho em equipe e superação</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <button className="btn-hover bg-yellow-500 hover:bg-yellow-600 text-dark px-10 py-4 rounded-lg text-xl font-black shadow-2xl">
                    Quero Fazer Parte do Galo! 🐔
                  </button>
                </Link>
                <Link href="/login">
                  <button className="btn-hover bg-white text-dark px-10 py-4 rounded-lg text-xl font-bold shadow-2xl">
                    Agendar Avaliação Gratuita
                  </button>
                </Link>
              </div>
              <p className="text-sm text-white/70 mt-4">
                💰 Planos acessíveis com desconto para sócios e parcelamento facilitado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Escolinha - Outras Modalidades */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="slide-in-left">
              <div className="inline-block bg-accent/20 px-4 py-2 rounded-full mb-4">
                <span className="text-accent font-bold uppercase text-sm">Escolinha Esportiva</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-dark">
                Mais Modalidades Esportivas
              </h2>
              <p className="text-xl text-dark/80 mb-8 leading-relaxed">
                Além da <strong>Academia do Galo</strong>, oferecemos aulas de <strong>Vôlei, Beach Tennis e Futsal</strong> para todas as idades.
                Do iniciante ao avançado, desenvolvemos suas habilidades com professores especializados!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">✓</div>
                  <span className="text-lg text-dark">Turmas divididas por idade e nível</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">✓</div>
                  <span className="text-lg text-dark">Professores com certificação</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">✓</div>
                  <span className="text-lg text-dark">Desconto especial para sócios da arena</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">✓</div>
                  <span className="text-lg text-dark">Aula experimental gratuita</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="btn-hover bg-accent text-white px-8 py-4 rounded-lg text-lg font-bold shadow-xl w-full sm:w-auto">
                    🎓 Agendar Aula Experimental
                  </button>
                </Link>
                <button className="btn-hover bg-white text-accent border-2 border-accent px-8 py-4 rounded-lg text-lg font-bold">
                  📋 Ver Turmas e Horários
                </button>
              </div>
            </div>

            {/* Cards de Modalidades */}
            <div className="slide-in-right grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl mb-3">🏐</div>
                <h3 className="font-bold text-lg mb-2">Vôlei</h3>
                <p className="text-sm text-dark/60 mb-3">8 a 16 anos</p>
                <p className="text-secondary font-bold">A partir de R$ 129/mês</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl mb-3">🎾</div>
                <h3 className="font-bold text-lg mb-2">Beach Tennis</h3>
                <p className="text-sm text-dark/60 mb-3">Adultos</p>
                <p className="text-accent font-bold">A partir de R$ 179/mês</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl mb-3">🏐</div>
                <h3 className="font-bold text-lg mb-2">Futsal</h3>
                <p className="text-sm text-dark/60 mb-3">6 a 14 anos</p>
                <p className="text-primary font-bold">A partir de R$ 129/mês</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="font-bold text-lg mb-2">Iniciação Esportiva</h3>
                <p className="text-sm text-dark/60 mb-3">4 a 6 anos</p>
                <p className="text-primary font-bold">A partir de R$ 99/mês</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day Use - Experiência Completa */}
      <section id="day-use" className="section-padding bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-block bg-secondary/20 px-4 py-2 rounded-full mb-4">
              <span className="text-secondary font-bold uppercase text-sm">Day Use</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-dark">
              Dia Completo de Diversão e Lazer
            </h2>
            <p className="text-xl text-dark/70 max-w-3xl mx-auto">
              Aproveite nossa estrutura completa! Piscina, bar, alimentação, quadras e muito mais em pacotes especiais.
              Perfeito para família, amigos e eventos!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pacote Família */}
            <div className="feature-card bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20">
              <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white text-center">
                <div className="text-6xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold">Day Use Família</h3>
                <p className="text-white/90 text-sm mt-2">Até 6 pessoas</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-dark/50 line-through text-xl">R$ 599</span>
                    <span className="text-4xl font-black text-primary">R$ 449</span>
                  </div>
                  <p className="text-center text-sm text-dark/60">Válido seg-qui</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-dark/80">Acesso à piscina (10h às 18h)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-dark/80">Almoço buffet completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-dark/80">Bebidas não-alcoólicas à vontade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-dark/80">2h de quadra incluídas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-dark/80">Área kids com brinquedos</span>
                  </li>
                </ul>

                <Link href="/login">
                  <button className="btn-hover w-full bg-primary text-white py-4 rounded-lg font-bold text-lg">
                    Reservar Agora
                  </button>
                </Link>
              </div>
            </div>

            {/* Pacote Individual */}
            <div className="feature-card bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-secondary/20">
              <div className="bg-gradient-to-br from-secondary to-accent p-6 text-white text-center">
                <div className="text-6xl mb-3">🏊</div>
                <h3 className="text-2xl font-bold">Day Use Individual</h3>
                <p className="text-white/90 text-sm mt-2">Por pessoa</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-black text-secondary">R$ 89</span>
                  </div>
                  <p className="text-center text-sm text-dark/60">Seg-qui • R$ 119 sex-dom</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-dark/80">Acesso à piscina</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-dark/80">Bar e área de convivência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-dark/80">Bebidas não-alcoólicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-dark/80">Vestiários com duchas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">✓</span>
                    <span className="text-dark/80">Estacionamento gratuito</span>
                  </li>
                </ul>

                <Link href="/login">
                  <button className="btn-hover w-full bg-secondary text-white py-4 rounded-lg font-bold text-lg">
                    Comprar Day Use
                  </button>
                </Link>
              </div>
            </div>

            {/* Pacote Premium */}
            <div className="feature-card bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-accent/20 relative">
              <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                MAIS VENDIDO
              </div>
              <div className="bg-gradient-to-br from-accent to-primary p-6 text-white text-center">
                <div className="text-6xl mb-3">⭐</div>
                <h3 className="text-2xl font-bold">Day Use Premium</h3>
                <p className="text-white/90 text-sm mt-2">Até 10 pessoas</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-black text-accent">R$ 899</span>
                  </div>
                  <p className="text-center text-sm text-dark/60">Qualquer dia da semana</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-dark/80">Tudo do pacote família +</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-dark/80">4h de quadra incluídas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-dark/80">Churrasqueira exclusiva</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-dark/80">Área reservada na piscina</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-dark/80">Bebidas alcoólicas incluídas</span>
                  </li>
                </ul>

                <Link href="/login">
                  <button className="btn-hover w-full bg-accent text-white py-4 rounded-lg font-bold text-lg">
                    Garantir Vaga Premium
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-dark/70 mb-4">
              🎉 <strong>Promoção:</strong> Reserve com 7 dias de antecedência e ganhe 15% de desconto!
            </p>
            <Link href="/login">
              <button className="btn-hover bg-white text-secondary border-2 border-secondary px-10 py-4 rounded-lg text-xl font-bold shadow-xl">
                Ver Todos os Pacotes e Add-ons
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Patrocinadores */}
      <section className="section-padding bg-gradient-to-br from-gray via-white to-gray relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,102,204,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,87,34,0.3) 0%, transparent 50%)"}}>
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 px-6 py-2 rounded-full mb-4">
              <span className="text-primary font-bold uppercase text-sm tracking-wider">Nossos Parceiros</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-dark fade-in">
              Patrocinadores que
              <br />
              <span className="gradient-text">Fazem a Diferença</span>
            </h2>
            <p className="text-xl text-dark/70 max-w-3xl mx-auto leading-relaxed fade-in">
              Agradecemos aos nossos parceiros que acreditam no potencial do esporte
              e contribuem para o desenvolvimento da nossa comunidade.
            </p>
          </div>

          {/* Grid de Logos Premium */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center min-h-[160px] group border-2 border-gray/20 hover:border-primary/40"
              >
                <div className="text-center">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    🏢
                  </div>
                  <p className="text-xs font-semibold text-dark/60 group-hover:text-primary transition-colors">
                    Logo {num}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Métricas de Impacto */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 mb-16 border-2 border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-black text-dark mb-4">
                📊 Impacto dos Nossos Patrocinadores
              </h3>
              <p className="text-lg text-dark/70">
                Sua marca conectada com uma comunidade ativa e engajada
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center fade-in">
                <div className="text-5xl font-black text-primary mb-2">5.000+</div>
                <div className="text-dark/70 font-semibold">Pessoas/mês</div>
                <div className="text-sm text-dark/50 mt-1">visitando a arena</div>
              </div>

              <div className="text-center fade-in">
                <div className="text-5xl font-black text-secondary mb-2">500+</div>
                <div className="text-dark/70 font-semibold">Alunos Ativos</div>
                <div className="text-sm text-dark/50 mt-1">academia e escolinha</div>
              </div>

              <div className="text-center fade-in">
                <div className="text-5xl font-black text-accent mb-2">50+</div>
                <div className="text-dark/70 font-semibold">Eventos/ano</div>
                <div className="text-sm text-dark/50 mt-1">torneios e campeonatos</div>
              </div>

              <div className="text-center fade-in">
                <div className="text-5xl font-black text-primary mb-2">100K+</div>
                <div className="text-dark/70 font-semibold">Impressões</div>
                <div className="text-sm text-dark/50 mt-1">nas redes sociais</div>
              </div>
            </div>
          </div>

          {/* CTA para Novos Patrocinadores */}
          <div className="bg-gradient-to-br from-dark via-primary/20 to-dark rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Lado Esquerdo - Conteúdo */}
              <div className="p-12 text-white">
                <div className="inline-block bg-yellow-500 text-dark px-4 py-2 rounded-full mb-6 font-black text-sm">
                  🤝 OPORTUNIDADE DE PARCERIA
                </div>
                <h3 className="text-4xl font-black mb-6 leading-tight">
                  Torne-se um
                  <br />
                  <span className="text-yellow-500">Patrocinador Oficial</span>
                </h3>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Conecte sua marca a uma comunidade esportiva ativa e em crescimento.
                  Exposição em eventos, redes sociais, uniformes e instalações.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Exposição Premium</h4>
                      <p className="text-white/70 text-sm">Logo em uniformes, banners e materiais digitais</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Eventos Exclusivos</h4>
                      <p className="text-white/70 text-sm">Ativações e experiências em torneios e campeonatos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Redes Sociais</h4>
                      <p className="text-white/70 text-sm">Menções, posts patrocinados e stories destacados</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-dark font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Comunidade Engajada</h4>
                      <p className="text-white/70 text-sm">Acesso direto a 5 mil+ visitantes mensais</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-hover bg-yellow-500 hover:bg-yellow-600 text-dark px-8 py-4 rounded-lg text-lg font-black shadow-2xl">
                    📞 Quero Ser Patrocinador
                  </button>
                  <button className="btn-hover bg-white/10 backdrop-blur-sm border-2 border-white/40 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-bold">
                    📄 Ver Pacotes
                  </button>
                </div>
              </div>

              {/* Lado Direito - Benefícios em Destaque */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-12 flex items-center">
                <div className="space-y-6 w-full">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl">🎯</div>
                      <h4 className="text-2xl font-bold text-white">Plano Bronze</h4>
                    </div>
                    <p className="text-white/80 mb-2">Logo em banners e redes sociais</p>
                    <p className="text-yellow-500 font-black text-xl">A partir de R$ 500/mês</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl">🥈</div>
                      <h4 className="text-2xl font-bold text-white">Plano Prata</h4>
                    </div>
                    <p className="text-white/80 mb-2">Bronze + logo em uniformes</p>
                    <p className="text-yellow-500 font-black text-xl">A partir de R$ 1.200/mês</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-500 relative">
                    <div className="absolute -top-3 right-4 bg-yellow-500 text-dark px-3 py-1 rounded-full text-xs font-black">
                      MAIS ESCOLHIDO
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl">🥇</div>
                      <h4 className="text-2xl font-bold text-white">Plano Ouro</h4>
                    </div>
                    <p className="text-white/80 mb-2">Prata + naming rights de eventos</p>
                    <p className="text-yellow-500 font-black text-xl">A partir de R$ 2.500/mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gray">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 fade-in">
            Organize Seus Jogos com Tecnologia
          </h2>
          <p className="text-xl text-center text-dark/70 mb-16 fade-in">
            Plataforma completa para gerenciar suas partidas
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Reserva Online 24/7
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Veja disponibilidade em tempo real e reserve sua quadra a qualquer hora pelo celular.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Gestão de Turmas
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Crie grupos fixos, convide jogadores e organize peladas recorrentes automaticamente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Divisão de Custos
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Rateio automático entre jogadores. Chega de correr atrás de quem não pagou!
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">📲</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Notificações WhatsApp
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Lembretes automáticos antes dos jogos. Nunca mais esqueça seu horário.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Pagamento Simplificado
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Pix, cartão ou crédito na plataforma. Pague de forma rápida e segura.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card card-hover bg-white rounded-xl p-8 shadow-md">
              <div className="icon-rotate text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Histórico e Estatísticas
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Acompanhe todas suas partidas, gastos e avalie a experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Contato CTA Section */}
      <section id="contato" className="section-padding bg-gradient-to-br from-primary to-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
              Entre em Contato
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 fade-in">
              Reserve sua quadra ou tire suas dúvidas. Estamos sempre prontos para atender!
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 fade-in">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
                <p className="text-white/80">(33) 9 9999-9999</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 fade-in">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-bold text-lg mb-2">Localização</h3>
                <p className="text-white/80">Governador Valadares, MG</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 fade-in">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="font-bold text-lg mb-2">Horário</h3>
                <p className="text-white/80">Seg - Dom: 6h às 23h</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
              <button className="btn-hover bg-white text-primary hover:bg-white/90 px-10 py-5 rounded-lg text-xl font-bold shadow-2xl">
                💬 Chamar no WhatsApp
              </button>
              <button className="btn-hover bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-10 py-5 rounded-lg text-xl font-bold">
                📅 Ver Disponibilidade
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-dark via-primary/20 to-dark text-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-6 fade-in">
                Comece Hoje Sua Jornada Esportiva!
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-white/90 fade-in leading-relaxed">
                Escolha como você quer aproveitar a <strong>Arena Dona Santa</strong>:
                Jogue, Aprenda ou Relaxe!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Opção 1: Reservar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-white/20 hover:border-primary transition-all fade-in">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold mb-3">Reservar Quadra</h3>
                <p className="text-white/80 mb-6">
                  Society, Futsal, Vôlei e Beach Tennis disponíveis
                </p>
                <button className="btn-hover bg-primary text-white w-full py-3 rounded-lg font-bold">
                  Ver Horários
                </button>
              </div>

              {/* Opção 2: Academia do Galo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-yellow-500 scale-105 shadow-2xl fade-in">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-dark px-4 py-1 rounded-full text-sm font-black">
                  CREDENCIADA CAM ⚽
                </div>
                <div className="text-6xl mb-4">🐔</div>
                <h3 className="text-2xl font-bold mb-3">Academia do Galo</h3>
                <p className="text-white/80 mb-6">
                  Metodologia oficial • Chance de profissionalizar
                </p>
                <button className="btn-hover bg-yellow-500 text-dark w-full py-3 rounded-lg font-black">
                  Inscrever Agora!
                </button>
              </div>

              {/* Opção 3: Day Use */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-white/20 hover:border-secondary transition-all fade-in">
                <div className="text-6xl mb-4">🏊</div>
                <h3 className="text-2xl font-bold mb-3">Day Use</h3>
                <p className="text-white/80 mb-6">
                  A partir de R$ 89 • Piscina, bar e muito +
                </p>
                <button className="btn-hover bg-secondary text-white w-full py-3 rounded-lg font-bold">
                  Ver Pacotes
                </button>
              </div>
            </div>

            <div className="text-center fade-in">
              <p className="text-white/70 mb-6 text-lg">
                💬 <strong>Dúvidas?</strong> Fale com nosso time agora mesmo!
              </p>
              <button className="btn-hover bg-white text-dark px-12 py-5 rounded-lg text-xl font-bold shadow-2xl">
                📱 Chamar no WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
              <div className="fade-in">
                <div className="text-3xl font-black text-primary mb-1">500+</div>
                <div className="text-white/70 text-sm">Alunos Ativos</div>
              </div>
              <div className="fade-in">
                <div className="text-3xl font-black text-accent mb-1">4.9★</div>
                <div className="text-white/70 text-sm">Avaliação</div>
              </div>
              <div className="fade-in">
                <div className="text-3xl font-black text-secondary mb-1">15+</div>
                <div className="text-white/70 text-sm">Anos no Mercado</div>
              </div>
              <div className="fade-in">
                <div className="text-3xl font-black text-primary mb-1">100%</div>
                <div className="text-white/70 text-sm">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Image
                  src="/logo-arena.png"
                  alt="Arena Dona Santa Logo"
                  width={80}
                  height={80}
                  className="mb-3"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">Arena Dona Santa</h3>
              <p className="text-white/70">
                Gestão inteligente de quadras esportivas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quadras</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="#modalidades" className="hover:text-primary transition-colors">
                    Society
                  </a>
                </li>
                <li>
                  <a href="#modalidades" className="hover:text-primary transition-colors">
                    Futsal
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:text-primary transition-colors">
                    Horários
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  📱
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  📷
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  🐦
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>© 2025 Arena Dona Santa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
