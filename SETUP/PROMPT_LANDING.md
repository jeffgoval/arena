🏟️ PROMPT: Landing Page Arena Dona Santa

📋 CONTEXTO DO PROJETO

Você vai criar uma landing page moderna e high-performance para a Arena Dona Santa - uma plataforma de gestão de quadras esportivas focada em público jovem que ama esportes.

🎯 OBJETIVO PRINCIPAL

Criar uma landing page leve, moderna e com efeitos visuais sutis que converta visitantes em usuários cadastrados. A página deve ter MUITO espaço em branco entre elementos, priorizando performance e UX fluida.

⚠️ RESTRIÇÕES CRÍTICAS

Performance (PRIORIDADE MÁXIMA)

&nbsp;	• NÃO use Framer Motion - ficou pesado demais em tentativas anteriores

&nbsp;	• Use apenas CSS animations nativas e Intersection Observer API

&nbsp;	• Otimize todas as imagens (WebP, lazy loading)

&nbsp;	• Bundle final deve carregar em < 2 segundos em 3G

&nbsp;	• Lighthouse score mínimo: 90+ em Performance

Efeitos Visuais

&nbsp;	• ✅ PERMITIDO: fade-in, slide-in sutis, parallax leve, hover effects suaves

&nbsp;	• ❌ PROIBIDO: animações complexas, múltiplas bibliotecas de animação, efeitos pesados

&nbsp;	• Use transform e opacity para animações (GPU-accelerated)

&nbsp;	• Prefira will-change com moderação

🎨 DESIGN SYSTEM

Espaçamento (MUITO IMPORTANTE)

/\* Espaço em branco generoso entre seções \*/

section-padding: 8rem 0      /\* Desktop \*/

section-padding: 4rem 0      /\* Mobile \*/

element-gap: 3rem            /\* Entre elementos \*/

Cores (Esportivas e Jovens)

--primary: #2D9F5D          /\* Verde esportivo vibrante \*/

--secondary: #4F9CFF        /\* Azul energia \*/

--accent: #FF6B35           /\* Laranja ação \*/

--dark: #1A1A1A             /\* Preto profundo \*/

--light: #FFFFFF            /\* Branco puro \*/

--gray: #F5F5F5             /\* Cinza clarinho \*/

Tipografia

&nbsp;	• Headings: Inter ou Montserrat (weight: 700-900)

&nbsp;	• Body: Inter (weight: 400-600)

&nbsp;	• Tamanhos: h1: 3.5rem (mobile: 2.5rem), h2: 2.5rem, body: 1.125rem

📐 ESTRUTURA DA LANDING PAGE

1\. HERO SECTION (Above the Fold) ⚡

Imagem Hero: /hero-arena.jpg (já está na pasta uploads)

<section class="hero">

&nbsp; <!-- Imagem de fundo: stadium esportivo iluminado -->

&nbsp; <div class="hero-overlay">

&nbsp;   <h1 class="animate-fade-in">

&nbsp;     Organize Seus Jogos,<br/>

&nbsp;     <span class="gradient-text">Gerencie Suas Turmas</span>

&nbsp;   </h1>

&nbsp;   

&nbsp;   <p class="hero-subtitle">

&nbsp;     A plataforma completa para reservar quadras, criar turmas 

&nbsp;     e dividir custos de forma inteligente.

&nbsp;   </p>

&nbsp;   

&nbsp;   <div class="cta-buttons">

&nbsp;     <button class="btn-primary">Começar Agora</button>

&nbsp;     <button class="btn-secondary">Ver Demo</button>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Social proof -->

&nbsp;   <div class="stats">

&nbsp;     <span>500+ jogadores</span>

&nbsp;     <span>1.200+ jogos organizados</span>

&nbsp;     <span>4.9★ avaliação</span>

&nbsp;   </div>

&nbsp; </div>

</section>

Efeitos:

&nbsp;	• Background com parallax LEVE (apenas -5% ao scroll)

&nbsp;	• Overlay escuro semitransparente (rgba(0,0,0,0.5))

&nbsp;	• Texto com fade-in cascata (delay 0.1s entre elementos)

&nbsp;	• Botões com hover suave (scale 1.05 + shadow)



2\. PROBLEMA/SOLUÇÃO (Storytelling)

<section class="problem-solution">

&nbsp; <div class="problem">

&nbsp;   <h2>Cansado de Mensagens Perdidas?</h2>

&nbsp;   <ul class="pain-points">

&nbsp;     <li>❌ Grupos de WhatsApp bagunçados</li>

&nbsp;     <li>❌ Confusão na divisão de valores</li>

&nbsp;     <li>❌ Jogadores que não confirmam presença</li>

&nbsp;     <li>❌ Dificuldade pra fechar turmas fixas</li>

&nbsp;   </ul>

&nbsp; </div>

&nbsp; 

&nbsp; <div class="solution">

&nbsp;   <h2>Gerencie Tudo em Um Só Lugar</h2>

&nbsp;   <p>Arena Dona Santa centraliza reservas, convites, 

&nbsp;      pagamentos e turmas em uma plataforma moderna.</p>

&nbsp; </div>

</section>

Efeito: Slide-in lateral quando entra no viewport (Intersection Observer)



3\. FEATURES CARDS (3 Colunas)

<section class="features">

&nbsp; <h2>Funcionalidades Principais</h2>

&nbsp; 

&nbsp; <div class="cards-grid">

&nbsp;   <!-- Card 1: Reservas -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">🏟️</div>

&nbsp;     <h3>Reservas Inteligentes</h3>

&nbsp;     <p>Escolha quadra, horário e pague com Pix, 

&nbsp;        cartão ou saldo acumulado.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Card 2: Turmas -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">👥</div>

&nbsp;     <h3>Turmas Recorrentes</h3>

&nbsp;     <p>Crie turmas fixas e reutilize em qualquer 

&nbsp;        jogo. Membros fixos e variáveis.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Card 3: Rateio -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">💰</div>

&nbsp;     <h3>Rateio Flexível</h3>

&nbsp;     <p>Divida por percentual ou valor fixo. 

&nbsp;        Sistema calcula automaticamente.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Card 4: Convites -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">🔗</div>

&nbsp;     <h3>Convites Públicos</h3>

&nbsp;     <p>Gere links de convite e preencha vagas 

&nbsp;        automaticamente via WhatsApp.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Card 5: Notificações -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">📲</div>

&nbsp;     <h3>Lembretes Automáticos</h3>

&nbsp;     <p>WhatsApp notifica jogadores 45min e 10min 

&nbsp;        antes do horário do jogo.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Card 6: Relatórios -->

&nbsp;   <div class="feature-card">

&nbsp;     <div class="icon">📊</div>

&nbsp;     <h3>Histórico Completo</h3>

&nbsp;     <p>Veja todos os jogos, gastos, estatísticas 

&nbsp;        e avaliações em um painel.</p>

&nbsp;   </div>

&nbsp; </div>

</section>

Efeitos:

&nbsp;	• Cards com fade-in em cascata (stagger 0.1s)

&nbsp;	• Hover: elevação suave (translateY -8px + shadow)

&nbsp;	• Ícones com rotate sutil no hover



4\. HOW IT WORKS (Timeline)

<section class="how-it-works">

&nbsp; <h2>Como Funciona?</h2>

&nbsp; 

&nbsp; <div class="timeline">

&nbsp;   <div class="step" data-step="1">

&nbsp;     <div class="step-number">01</div>

&nbsp;     <h3>Cadastre-se Grátis</h3>

&nbsp;     <p>Crie sua conta em 2 minutos com CPF, e-mail e WhatsApp.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="step" data-step="2">

&nbsp;     <div class="step-number">02</div>

&nbsp;     <h3>Escolha a Quadra</h3>

&nbsp;     <p>Veja horários disponíveis, preços e reserve online.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="step" data-step="3">

&nbsp;     <div class="step-number">03</div>

&nbsp;     <h3>Monte Sua Turma</h3>

&nbsp;     <p>Adicione jogadores e configure rateio automático.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="step" data-step="4">

&nbsp;     <div class="step-number">04</div>

&nbsp;     <h3>Jogue e Avalie</h3>

&nbsp;     <p>Receba lembretes automáticos e avalie após o jogo.</p>

&nbsp;   </div>

&nbsp; </div>

</section>

Efeito: Linha conectora animada progressivamente ao scroll



5\. SOCIAL PROOF (Depoimentos)

<section class="testimonials">

&nbsp; <h2>O Que Nossos Jogadores Dizem</h2>

&nbsp; 

&nbsp; <div class="testimonials-slider">

&nbsp;   <div class="testimonial">

&nbsp;     <div class="avatar">JP</div>

&nbsp;     <p>"Antes eu perdia 30min organizando pelo WhatsApp. 

&nbsp;        Agora em 2 cliques tá tudo pronto!"</p>

&nbsp;     <span class="author">João Pedro, 24 anos</span>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="testimonial">

&nbsp;     <div class="avatar">MC</div>

&nbsp;     <p>"O rateio automático acabou com aquela confusão 

&nbsp;        de quem pagou ou não. Top demais!"</p>

&nbsp;     <span class="author">Mariana Costa, 28 anos</span>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="testimonial">

&nbsp;     <div class="avatar">RF</div>

&nbsp;     <p>"Minha turma fixa joga toda quinta. Só vincular 

&nbsp;        e já convido todo mundo de uma vez."</p>

&nbsp;     <span class="author">Rafael Fernandes, 31 anos</span>

&nbsp;   </div>

&nbsp; </div>

</section>

Efeito: Slider horizontal com fade entre depoimentos (auto-play 5s)



6\. PRICING (Opcional - Gratuito)

<section class="pricing">

&nbsp; <h2>Comece Gratuitamente</h2>

&nbsp; 

&nbsp; <div class="pricing-card">

&nbsp;   <h3>100% Gratuito</h3>

&nbsp;   <div class="price">R$ 0<span>/mês</span></div>

&nbsp;   <ul class="benefits">

&nbsp;     <li>✓ Reservas ilimitadas</li>

&nbsp;     <li>✓ Turmas ilimitadas</li>

&nbsp;     <li>✓ Convites ilimitados</li>

&nbsp;     <li>✓ Rateio automático</li>

&nbsp;     <li>✓ Notificações WhatsApp</li>

&nbsp;     <li>✓ Suporte prioritário</li>

&nbsp;   </ul>

&nbsp;   <button class="btn-primary">Criar Conta Grátis</button>

&nbsp;   <small>\*Você só paga pela reserva da quadra</small>

&nbsp; </div>

</section>



7\. FAQ (Accordion)

<section class="faq">

&nbsp; <h2>Perguntas Frequentes</h2>

&nbsp; 

&nbsp; <div class="accordion">

&nbsp;   <div class="faq-item">

&nbsp;     <button class="faq-question">

&nbsp;       Como funciona o rateio de custos?

&nbsp;       <span class="icon">+</span>

&nbsp;     </button>

&nbsp;     <div class="faq-answer">

&nbsp;       Você escolhe entre dividir por percentual (ex: 50%, 30%, 20%) 

&nbsp;       ou valor fixo (ex: R$ 40, R$ 30, R$ 30). O sistema valida 

&nbsp;       automaticamente e envia cobranças individuais.

&nbsp;     </div>

&nbsp;   </div>

&nbsp;   

&nbsp;   <!-- Mais 4-5 FAQs relevantes -->

&nbsp; </div>

</section>



8\. CTA FINAL (Conversão)

<section class="final-cta">

&nbsp; <h2>Pronto para Simplificar Seus Jogos?</h2>

&nbsp; <p>Junte-se a centenas de jogadores que já organizam 

&nbsp;    partidas de forma profissional.</p>

&nbsp; 

&nbsp; <button class="btn-primary-large">

&nbsp;   Começar Agora - É Grátis

&nbsp; </button>

&nbsp; 

&nbsp; <small>Sem cartão de crédito. Ative em 2 minutos.</small>

</section>



9\. FOOTER

<footer>

&nbsp; <div class="footer-grid">

&nbsp;   <div class="footer-brand">

&nbsp;     <h3>Arena Dona Santa</h3>

&nbsp;     <p>Gestão inteligente de quadras esportivas.</p>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="footer-links">

&nbsp;     <h4>Produto</h4>

&nbsp;     <a href="#features">Funcionalidades</a>

&nbsp;     <a href="#pricing">Preços</a>

&nbsp;     <a href="#faq">FAQ</a>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="footer-links">

&nbsp;     <h4>Suporte</h4>

&nbsp;     <a href="#">Central de Ajuda</a>

&nbsp;     <a href="#">Contato</a>

&nbsp;     <a href="#">Status</a>

&nbsp;   </div>

&nbsp;   

&nbsp;   <div class="footer-social">

&nbsp;     <h4>Redes Sociais</h4>

&nbsp;     <!-- Ícones sociais -->

&nbsp;   </div>

&nbsp; </div>

&nbsp; 

&nbsp; <div class="footer-bottom">

&nbsp;   <p>© 2025 Arena Dona Santa. Todos os direitos reservados.</p>

&nbsp; </div>

</footer>



🎨 IMPLEMENTAÇÃO DE EFEITOS (CSS Only)

1\. Fade In ao Scroll (Intersection Observer)

// utils/animations.js

const observerOptions = {

&nbsp; threshold: 0.1,

&nbsp; rootMargin: '0px 0px -100px 0px'

};

const observer = new IntersectionObserver((entries) => {

&nbsp; entries.forEach(entry => {

&nbsp;   if (entry.isIntersecting) {

&nbsp;     entry.target.classList.add('visible');

&nbsp;   }

&nbsp; });

}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/\* styles/animations.css \*/

.fade-in {

&nbsp; opacity: 0;

&nbsp; transform: translateY(30px);

&nbsp; transition: opacity 0.6s ease, transform 0.6s ease;

}

.fade-in.visible {

&nbsp; opacity: 1;

&nbsp; transform: translateY(0);

}

/\* Cascata em grid \*/

.cards-grid .feature-card {

&nbsp; opacity: 0;

&nbsp; animation: fadeInUp 0.6s ease forwards;

}

.cards-grid .feature-card:nth-child(1) { animation-delay: 0.1s; }

.cards-grid .feature-card:nth-child(2) { animation-delay: 0.2s; }

.cards-grid .feature-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {

&nbsp; from {

&nbsp;   opacity: 0;

&nbsp;   transform: translateY(30px);

&nbsp; }

&nbsp; to {

&nbsp;   opacity: 1;

&nbsp;   transform: translateY(0);

&nbsp; }

}

2\. Parallax Leve (Hero)

// utils/parallax.js

window.addEventListener('scroll', () => {

&nbsp; const scrolled = window.pageYOffset;

&nbsp; const hero = document.querySelector('.hero');

&nbsp; 

&nbsp; // Apenas 5% de movimento - sutil!

&nbsp; hero.style.transform = `translateY(${scrolled \* 0.05}px)`;

});

3\. Hover Effects (Cards)

.feature-card {

&nbsp; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

&nbsp; will-change: transform;

}

.feature-card:hover {

&nbsp; transform: translateY(-8px);

&nbsp; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

}

.feature-card .icon {

&nbsp; transition: transform 0.3s ease;

}

.feature-card:hover .icon {

&nbsp; transform: rotate(-5deg) scale(1.1);

}



📱 RESPONSIVIDADE (Mobile-First)

Breakpoints

/\* Mobile: 320px - 767px \*/

.container { padding: 1rem; }

.hero h1 { font-size: 2rem; }

.cards-grid { grid-template-columns: 1fr; }

/\* Tablet: 768px - 1023px \*/

@media (min-width: 768px) {

&nbsp; .cards-grid { grid-template-columns: repeat(2, 1fr); }

}

/\* Desktop: 1024px+ \*/

@media (min-width: 1024px) {

&nbsp; .hero h1 { font-size: 3.5rem; }

&nbsp; .cards-grid { grid-template-columns: repeat(3, 1fr); }

}



⚡ OTIMIZAÇÃO DE PERFORMANCE

1\. Imagens

<!-- Hero com srcset -->

<picture>

&nbsp; <source srcset="hero-arena-mobile.webp" media="(max-width: 767px)">

&nbsp; <source srcset="hero-arena-tablet.webp" media="(max-width: 1023px)">

&nbsp; <img src="hero-arena.webp" alt="Arena esportiva" loading="lazy">

</picture>

2\. Lazy Loading

// Usar Intersection Observer para lazy load

const lazyImages = document.querySelectorAll('img\[data-src]');

const imageObserver = new IntersectionObserver((entries) => {

&nbsp; entries.forEach(entry => {

&nbsp;   if (entry.isIntersecting) {

&nbsp;     const img = entry.target;

&nbsp;     img.src = img.dataset.src;

&nbsp;     imageObserver.unobserve(img);

&nbsp;   }

&nbsp; });

});

lazyImages.forEach(img => imageObserver.observe(img));

3\. CSS Critical Path

<!-- Inline critical CSS no <head> -->

<style>

&nbsp; /\* Hero + ATF only \*/

&nbsp; .hero { /\* estilos críticos \*/ }

</style>

<!-- Defer non-critical CSS -->

<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">



🚀 STACK TECNOLÓGICA

Recomendado (Next.js)

\# Criar projeto

npx create-next-app@latest arena-landing --typescript --tailwind

\# Dependências

npm install clsx tailwind-merge lucide-react

\# Opcional: Smooth scroll

npm install lenis

Alternativa (HTML/CSS/JS Puro)

&nbsp;	• Apenas Tailwind CDN

&nbsp;	• Vanilla JS para interações

&nbsp;	• Deploy direto no Cloudflare Pages



✅ CHECKLIST DE ENTREGA

Funcional

&nbsp;	• \[ ] Todos os links de CTA funcionam (mesmo que mock)

&nbsp;	• \[ ] Accordion FAQ abre/fecha

&nbsp;	• \[ ] Slider de depoimentos funciona

&nbsp;	• \[ ] Menu mobile hamburger funciona

&nbsp;	• \[ ] Formulário de contato valida campos

Performance

&nbsp;	• \[ ] Lighthouse Score >= 90

&nbsp;	• \[ ] Todas imagens em WebP

&nbsp;	• \[ ] Lazy loading implementado

&nbsp;	• \[ ] Sem Framer Motion ou libs pesadas

&nbsp;	• \[ ] CSS animations com GPU acceleration

Design

&nbsp;	• \[ ] Espaçamento generoso entre seções (8rem desktop)

&nbsp;	• \[ ] Efeitos sutis e profissionais

&nbsp;	• \[ ] Responsivo em todos os tamanhos

&nbsp;	• \[ ] Contraste de cores acessível (WCAG AA)

&nbsp;	• \[ ] Tipografia legível e hierárquica

Conteúdo

&nbsp;	• \[ ] Textos alinhados com o PRD

&nbsp;	• \[ ] Hero com imagem do estádio

&nbsp;	• \[ ] 6 features cards implementados

&nbsp;	• \[ ] 3 depoimentos reais/realistas

&nbsp;	• \[ ] FAQ com 5+ perguntas



🎯 OUTPUT ESPERADO

Ao finalizar, forneça:

&nbsp;	1. Código completo da landing page

&nbsp;	2. README.md com instruções de instalação e deploy

&nbsp;	3. Screenshot ou link preview da página funcionando

&nbsp;	4. Lighthouse report mostrando scores de performance

&nbsp;	5. Lista de assets necessários (imagens otimizadas)



💡 DICAS FINAIS

O que FAZER ✅

&nbsp;	• Use transform/opacity para animações (GPU)

&nbsp;	• Intersection Observer para scroll animations

&nbsp;	• Tailwind para styling rápido

&nbsp;	• Mobile-first approach

&nbsp;	• Web Vitals em mente (LCP, CLS, FID)

O que EVITAR ❌

&nbsp;	• Framer Motion ou GSAP (muito pesado)

&nbsp;	• Múltiplas bibliotecas de UI

&nbsp;	• Animações em propriedades custosas (width, height)

&nbsp;	• Imagens não otimizadas

&nbsp;	• JavaScript blocante



