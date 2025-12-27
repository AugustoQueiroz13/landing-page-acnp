import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Cpu, BookOpen, Monitor, CheckCircle, ShieldCheck,
  Award, ChevronDown, ChevronUp, Menu, X, Zap,
  Lock, ArrowRight, Star, Truck,
  GraduationCap, Calendar, HelpCircle, Code, Globe,
  Heart, Leaf, Package, FileText, Headphones, MapPin, User,
  CreditCard, QrCode, Barcode, Phone, Mail, FileCheck,
  LogIn, MessageCircle, ArrowUp, Send,
  Instagram, Facebook, Camera, UserPlus,
  MessageSquare, MousePointer, Tag, // Mantido
  Linkedin, Brain // <--- NOVOS ÍCONES ADICIONADOS
} from 'lucide-react';

// --- CONFIGURAÇÃO DA API ---
import { API_URL } from './config';

// --- PÁGINAS LEGAIS ---
const PrivacyPolicy = ({ onBack }) => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-700">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[#1a365d] font-bold hover:underline">← Voltar para o site</button>
    <h1 className="text-3xl font-extrabold text-[#1a365d] mb-6 flex items-center gap-3"><Lock /> Política de Privacidade</h1>
    <p className="mb-4">A sua privacidade é importante para nós. É política da ACNP Robótica respeitar a sua privacidade em relação a qualquer informação que possamos coletar neste site.</p>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">1. Coleta de Dados</h2>
    <p className="mb-4">Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (como o processamento do pagamento, envio do kit e emissão do certificado). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">2. Uso de Informações</h2>
    <p className="mb-4">Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">3. Compartilhamento</h2>
    <p className="mb-4">Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou para processamento de pagamentos (Gateway Asaas).</p>
  </div>
);

const TermsOfUse = ({ onBack }) => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-700">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[#1a365d] font-bold hover:underline">← Voltar para o site</button>
    <h1 className="text-3xl font-extrabold text-[#1a365d] mb-6 flex items-center gap-3"><FileText /> Termos de Uso</h1>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">1. Aceitação</h2>
    <p className="mb-4">Ao acessar ao site Robotica ACNP, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">2. Uso de Licença</h2>
    <p className="mb-4">É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Robotica ACNP, apenas para visualização transitória pessoal e não comercial. Em relação a apostila, não é permitida qualquer a reprodução total ou parcial da obra, por qualquer meio ou processo, para uso comercial ou redistribuição sem a expressa autorização do autor e da instituição editora. A violação dos direitos autorais é crime estabelecido na Lei nº 9.610/98 e punido pelo artigo 184 do Código Penal.</p>
    <h2 className="text-xl font-bold text-[#1a365d] mt-6 mb-3">3. Cancelamento e Reembolso</h2>
    <p className="mb-4">Conforme o Código de Defesa do Consumidor, o cliente tem até 7 dias corridos após o recebimento do kit para solicitar o cancelamento e reembolso total, desde que o material não tenha sido danificado.</p>
  </div>
);

// --- COMPONENTES VISUAIS ---
const RobotDivider = () => (
  <div className="absolute -bottom-6 left-0 w-full z-30 flex justify-center items-center">
    <div className="w-full max-w-7xl flex items-center px-4">
      <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-gray-400 hidden md:block"></div>
      <div className="mx-6 relative shrink-0">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center justify-center transform hover:scale-110 transition duration-300 cursor-default">
          <Bot size={32} className="text-[#1a365d]" strokeWidth={2} />
        </div>
      </div>
      <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-gray-300 to-gray-400 hidden md:block"></div>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, fullWidth = false }) => {
  const baseStyle = "font-extrabold py-3 px-6 md:py-4 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 text-base md:text-lg tracking-wide";
  const styles = {
    primary: "bg-[#e53e3e] text-white hover:bg-red-600 ring-4 ring-red-100",
    secondary: "bg-[#1a365d] text-white hover:bg-blue-900 ring-4 ring-blue-100",
    white: "bg-white text-[#1a365d] hover:bg-gray-50"
  };
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} disabled={disabled} className={`${baseStyle} ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
      {children}
    </motion.button>
  );
};

const AccordionItem = ({ title, sub, children, isOpen, onClick, icon }) => (
  <div className={`mb-4 rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-white border-[#e53e3e] shadow-md' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
    <button className="w-full py-5 px-6 flex justify-between items-center text-left" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isOpen ? 'bg-[#e53e3e] text-white' : 'bg-blue-50 text-[#1a365d]'}`}>{icon}</div>
        <div><h4 className={`font-bold text-lg ${isOpen ? 'text-[#e53e3e]' : 'text-[#1a365d]'}`}>{title}</h4>{sub && <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{sub}</p>}</div>
      </div>
      {isOpen ? <ChevronUp className="text-[#e53e3e]" /> : <ChevronDown className="text-gray-400" />}
    </button>
    <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
      <div className="p-6 pt-0 text-gray-600 border-t border-dashed border-gray-100 mt-2"><div className="pt-4">{children}</div></div>
    </motion.div>
  </div>
);

const TestimonialCard = ({ name, role, text, stars = 5 }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative">
    <div className="absolute -top-4 left-8 text-6xl text-blue-100 font-serif leading-none">"</div>
    <div className="flex gap-1 mb-4 text-yellow-400">{[...Array(stars)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
    <p className="text-gray-600 italic mb-6 relative z-10">{text}</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">{name.charAt(0)}</div>
      <div><h5 className="font-bold text-[#1a365d]">{name}</h5><span className="text-xs text-gray-400 uppercase font-bold">{role}</span></div>
    </div>
  </motion.div>
);
// --- APP PRINCIPAL ---
export default function LandingPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState('home');
  const [openModule, setOpenModule] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);

  // --- ESTADOS PARA CUPOM (NOVO) ---
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null); // { discount: 10, valid: true }
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Estados do formulário de compra
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '',
    nomeAluno: '', idadeAluno: '',
    cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: ''
  });

  useEffect(() => {
    const checkScroll = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScrollTop]);

  const navigateTo = (targetPage) => {
    setPage(targetPage);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const scrollToSection = (id) => {
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'cpf') v = v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (name === 'telefone') v = v.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (name === 'cep') v = v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d{3})/, "$1-$2");
    setFormData({ ...formData, [name]: v });
  };

  // --- FUNÇÃO PARA VALIDAR CUPOM ---
  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch(`${API_URL}/api/validar-cupom`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: couponCode })
      });
      const data = await res.json();
      if (data.valid) {
        setCouponData(data);
        alert(`Cupom Aplicado! Desconto de ${data.discount}%`);
      } else {
        setCouponData(null);
        alert('Cupom inválido ou expirado.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao validar cupom.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePurchase = async (event) => {
    event.preventDefault();
    if (window.fbq) window.fbq('track', 'InitiateCheckout');
    setIsLoading(true);
    const purchaseData = {
      nome: formData.nome,
      cpf: formData.cpf.replace(/\D/g, ''),
      email: formData.email,
      telefone: formData.telefone,
      aluno: { nome: formData.nomeAluno, idade: formData.idadeAluno },
      endereco_entrega: {
        cep: formData.cep, logradouro: formData.endereco, numero: formData.numero,
        complemento: formData.complemento, bairro: formData.bairro, cidade: formData.cidade
      },
      itens: ['curso-robotica-educacional-completo'],
      cupomCode: couponData ? couponData.code : null // <--- ENVIA O CUPOM SE EXISTIR
    };

    try {
      const response = await fetch(`${API_URL}/api/comprar-produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      const result = await response.json();
      if (result.success) {
        navigate('/confirmacao', {
          state: { paymentUrl: result.paymentUrl, nome: formData.nome }
        });
      } else {
        alert('Erro: ' + (result.error || 'Tente novamente.'));
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- NOVA FUNÇÃO DE CONTATO CONECTADA AO BACKEND ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSendingContact(true);

    // Captura os dados do formulário
    const nome = e.target[0].value;
    const email = e.target[1].value;
    const mensagem = e.target[2].value;

    try {
      const res = await fetch(`${API_URL}/api/enviar-contato`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, mensagem })
      });

      const data = await res.json();

      if (data.success) {
        alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
        e.target.reset(); // Limpa o formulário
      } else {
        alert("Erro ao enviar: " + (data.error || "Tente novamente."));
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao enviar mensagem.");
    } finally {
      setIsSendingContact(false);
    }
  };

  if (page === 'privacy') return <PrivacyPolicy onBack={() => setPage('home')} />;
  if (page === 'terms') return <TermsOfUse onBack={() => setPage('home')} />;

  return (
    <div className="font-sans text-gray-800 bg-gray-50 overflow-x-hidden selection:bg-[#e53e3e] selection:text-white relative">

      {/* HEADER */}
      <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img
              src="/educacional/logo-curso.png"
              alt="Robótica Educacional ACNP"
              className="h-10 md:h-16 w-auto"
              onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="font-extrabold text-[#1a365d] text-2xl">ROBÓTICA ACNP</span>' }}
            />
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex gap-5 text-[#1a365d] font-bold text-xs uppercase items-center tracking-wide">
              <button onClick={() => scrollToSection('metodo')} className="hover:text-[#e53e3e] transition">O Curso</button>
              <button onClick={() => scrollToSection('kit')} className="hover:text-[#e53e3e] transition">Kit</button>
              <button onClick={() => scrollToSection('projetos')} className="hover:text-[#e53e3e] transition">Projetos</button>
              <button onClick={() => scrollToSection('depoimentos')} className="hover:text-[#e53e3e] transition">Depoimentos</button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-[#e53e3e] transition">Dúvidas</button>
              <button onClick={() => scrollToSection('contato')} className="hover:text-[#e53e3e] transition">Contato</button>
            </nav>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <Button onClick={() => scrollToSection('checkout')} variant="primary" className="py-2 px-5 text-sm shadow-md">
              Matricular Agora
            </Button>

            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 font-extrabold text-[#1a365d] bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full transition border border-blue-200 text-sm"
            >
              <LogIn size={18} />
              <span>Área do Aluno</span>
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-[#1a365d]">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="lg:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('metodo')} className="text-[#1a365d] font-bold p-2 text-left border-b border-gray-50">O Curso</button>
            <button onClick={() => scrollToSection('kit')} className="text-[#1a365d] font-bold p-2 text-left border-b border-gray-50">Kit</button>
            <button onClick={() => scrollToSection('projetos')} className="text-[#1a365d] font-bold p-2 text-left border-b border-gray-50">Projetos</button>
            <button onClick={() => scrollToSection('faq')} className="text-[#1a365d] font-bold p-2 text-left border-b border-gray-50">Dúvidas</button>
            <button onClick={() => scrollToSection('contato')} className="text-[#1a365d] font-bold p-2 text-left border-b border-gray-50">Contato</button>
            <Button onClick={() => scrollToSection('checkout')} fullWidth>Matricular Agora</Button>
            <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 text-[#1a365d] font-bold p-3 bg-blue-50 rounded-xl">
              <LogIn size={20} /> Área do Aluno
            </button>
          </motion.div>
        )}
      </header>

      {/* 1. HERO SECTION */}
      <div className="relative pt-32 pb-32 md:pt-48 md:pb-56 bg-gradient-to-br from-[#1a365d] to-[#2d5aa0]">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-64 h-64 bg-[#e53e3e]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e53e3e] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 shadow-lg border border-red-400">
              <Star size={14} fill="white" /> Matrículas Abertas 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              O Laboratório de Robótica da Escola, <span className="text-[#ffd700]">agora na sua casa!</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed font-medium">
              Seu filho gosta de tecnologia? Tire-o das telas e transforme-o em um inventor. Curso completo de Robótica Educacional com <strong>Kit Arduíno (+ de 80 peças)</strong> + <strong>Material Didático</strong> e Certificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => scrollToSection('checkout')} variant="primary" className="bg-[#e53e3e] hover:bg-red-500 ring-white/20 text-lg py-4">
                QUERO O KIT COMPLETO
              </Button>
              <Button onClick={() => scrollToSection('metodo')} variant="secondary" className="bg-white/10 ring-white/20 hover:bg-white/20 backdrop-blur-sm text-lg py-4">
                Como Funciona?
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6 text-blue-200 text-xs md:text-sm font-bold">
              <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-lg"><Truck size={16} className="text-[#ffd700]" /> Envio Imediato</div>
              <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-lg"><ShieldCheck size={16} className="text-[#ffd700]" /> Garantia 7 Dias</div>
              <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-lg"><Award size={16} className="text-[#ffd700]" /> Certificado de Conclusão</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex justify-center">
            <div className="relative z-10 transform hover:scale-[1.02] transition duration-500 w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700] to-[#e53e3e] rounded-[2.5rem] blur opacity-75"></div>
              <div className="relative rounded-[2rem] p-2 bg-white/20 backdrop-blur-sm">
                <img
                  src="/educacional/hero-kit.jpg"
                  alt="Kit Robótica ACNP"
                  className="rounded-[1.8rem] shadow-2xl border-4 border-white/20 w-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = `<div class="bg-white/10 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-white/30 h-80 flex items-center justify-center text-white font-bold">Imagem Hero Kit</div>` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- DIVISOR ROBÔ ESTILIZADO --- */}
        <RobotDivider />
      </div>

      {/* 2. MÉTODO */}
      <section id="metodo" className="py-20 px-4 relative bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-4 flex items-center justify-center gap-3">
              <Zap size={36} className="text-[#e53e3e]" /> Como funciona o aprendizado?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Enviamos para você o material completo contendo o kit Arduíno com mais de 80 peças e apostila didática ilustrada com todas as instruções para criar projetos incríveis.</p>
          </div>

          {/* --- NOVO: BLOCO DE BENEFÍCIOS COGNITIVOS --- */}
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-16 max-w-5xl mx-auto text-center shadow-sm">
            <h3 className="text-[#1a365d] font-bold mb-4 flex items-center justify-center gap-2 text-xl">
              <Brain size={28} className="text-[#e53e3e]" /> Desenvolvimento Cognitivo Completo
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              A Robótica Educacional vai muito além da tecnologia. Ela estimula o <strong>raciocínio lógico</strong>, a capacidade de <strong>resolução de problemas complexos</strong> e a <strong>criatividade</strong>. Essas são competências fundamentais que preparam seu filho para ter sucesso e destaque no futuro em <strong>qualquer profissão</strong>, seja ele um engenheiro, médico ou advogado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen size={32} />, color: "bg-blue-500", title: "1. O Guia", text: "Apostila impressa passo a passo. A criança lê, interpreta e executa sem distrações." },
              { icon: <Cpu size={32} />, color: "bg-[#e53e3e]", title: "2. O Laboratório", text: "Kit Arduino físico. O aluno monta os circuitos na mesa e vê a mágica acontecer." },
              { icon: <Monitor size={32} />, color: "bg-green-500", title: "3. A Lógica", text: "Programação no computador. Ele digita o código e comanda os circuitos." },
              { icon: <Award size={32} />, color: "bg-yellow-500", title: "4. O Reconhecimento", text: "Ao finalizar, o aluno recebe um certificado de conclusão oficial válido." }
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 relative z-10`}>{item.icon}</div>
                <h3 className="text-xl font-bold text-[#1a365d] mb-3 relative z-10">{item.title}</h3>
                <p className="text-gray-600 relative z-10 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* --- NOVO: BLOCO C++ --- */}
          <div className="mt-16 bg-white border-2 border-[#00599C] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl max-w-4xl mx-auto transform hover:scale-[1.01] transition duration-300">
            <div className="shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" alt="Logo C++" className="h-24 w-auto" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-[#00599C] mb-3">Lógica de Programação com C++</h3>
              <p className="text-gray-600 leading-relaxed">
                Diferente de cursos que usam apenas "blocos de montar", aqui seu filho aprende uma <strong>linguagem de programação profissional</strong>. O C++ é a base de grandes sistemas mundiais. Ensinamos a lógica estruturada que abre portas para aprender qualquer outra tecnologia no futuro de forma sólida.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. GALERIA */}
      <section id="galeria" className="py-20 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-[#e53e3e] font-bold uppercase tracking-widest text-sm">Visualização</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mt-2 flex items-center gap-3">
                <Camera size={36} className="text-[#e53e3e]" /> Por dentro do material
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
            <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-xl relative group h-[300px] md:h-full">
              <img src="/educacional/galeria-kit-close.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Kit Detalhe" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#f3f4f6'; }} />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
                <p className="text-white font-bold text-xl">Peças Reais & Seguras</p>
                <p className="text-gray-300 text-sm">Sem solda, apenas encaixe e lógica.</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg relative group h-[240px]">
              <img src="/educacional/galeria-apostila.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Apostila" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#f3f4f6'; }} />
              <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-[#1a365d]">Didática Visual</div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg relative group h-[240px]">
              <img src="/educacional/galeria-aluno.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Aluno" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#f3f4f6'; }} />
              <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-[#1a365d]">Foco Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INVENTÁRIO */}
      <section id="kit" className="py-24 px-4 bg-[#1a365d] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 border border-[#e53e3e] rounded-full text-[#e53e3e] font-bold text-xs uppercase tracking-widest mb-4">Hardware Profissional</div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 flex items-center justify-center gap-3">
              <Package size={42} className="text-[#e53e3e]" /> O que vem na caixa?
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">São <strong>+ de 80 componentes</strong> selecionados para garantir que seu filho tenha um laboratório completo em casa.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cérebro", items: ["Placa Uno R3 SMD", "Cabo USB", "Protoboard", "Jumpers", "Conector 9V"] },
              { title: "Luzes", items: ["12 LEDs Coloridos", "1 LED RGB", "Display 7 Segmentos"] },
              { title: "Sensores", items: ["Sensor de Luz (LDR)", "Sensor Temp. (NTC)", "Sensor Tilt", "Potenciômetro"] },
              { title: "Ação", items: ["Servo Motor SG90", "Buzzer (Som)", "Botões Tácteis", "Resistores"] }
            ].map((cat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300">
                <h3 className="font-bold text-[#e53e3e] text-xl mb-4 border-b border-white/10 pb-2">{cat.title}</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {cat.items.map((it, i) => <li key={i}>• {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. JORNADA DO ALUNO */}
      <section id="projetos" className="py-24 px-4 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto relative z-10 pt-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-4 flex items-center justify-center gap-3">
              <Zap size={36} className="text-[#e53e3e]" /> O que será criado?
            </h2>
            <p className="text-lg text-gray-600">15 Projetos Práticos divididos em 5 Módulos de Evolução</p>
          </div>
          <div className="space-y-4">
            <AccordionItem icon={<Zap size={24} />} title="Módulo 1: Fundamentos" sub="A Base da Robótica" isOpen={openModule === 0} onClick={() => setOpenModule(openModule === 0 ? -1 : 0)}>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["O Clássico Pisca-Pisca", "Pedido de Socorro S.O.S", "Efeito Fade (Brilho)", "Semáforo Inteligente"].map((p, i) => <li key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg"><CheckCircle size={16} className="text-green-500 shrink-0" /> {p}</li>)}
              </ul>
            </AccordionItem>
            <AccordionItem icon={<Monitor size={24} />} title="Módulo 2: Interação Digital" sub="Entradas e Saídas" isOpen={openModule === 1} onClick={() => setOpenModule(openModule === 1 ? -1 : 1)}>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Interruptor Digital", "Luzes Coloridas (RGB)", "Seletor de Cores"].map((p, i) => <li key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg"><CheckCircle size={16} className="text-green-500 shrink-0" /> {p}</li>)}
              </ul>
            </AccordionItem>
            <AccordionItem icon={<Cpu size={24} />} title="Módulo 3: Movimento" sub="Motores e Mecânica" isOpen={openModule === 2} onClick={() => setOpenModule(openModule === 2 ? -1 : 2)}>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Acionando Motores DC", "Controle Mecânico (Servo)"].map((p, i) => <li key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg"><CheckCircle size={16} className="text-green-500 shrink-0" /> {p}</li>)}
              </ul>
            </AccordionItem>
            <AccordionItem icon={<Award size={24} />} title="Módulo 4 e 5: Projetos Avançados" sub="Sensores e Lógica Complexa" isOpen={openModule === 3} onClick={() => setOpenModule(openModule === 3 ? -1 : 3)}>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Sensor de Luz Noturna", "Piano Eletrônico", "Termômetro Digital", "Alarme Antifurto", "Contador Digital", "Dado Eletrônico"].map((p, i) => <li key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg"><CheckCircle size={16} className="text-green-500 shrink-0" /> {p}</li>)}
              </ul>
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* 6. DEPOIMENTOS */}
      <section id="depoimentos" className="py-20 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#e53e3e] font-bold uppercase tracking-widest text-sm">Famílias Aprovam</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mt-2 flex items-center justify-center gap-3">
              <MessageSquare size={36} className="text-[#e53e3e]" /> O que os pais estão dizendo
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard name="Mariana Souza" role="Mãe do Pedro (10 anos)" stars={5} text="Eu não aguentava mais ver ele no tablet. Com o kit, ele passa a tarde toda montando e me chamando para ver o que criou. O material é muito didático." />
            <TestimonialCard name="Carlos Ferreira" role="Pai da Sofia (12 anos)" stars={5} text="A apostila é excelente. Minha filha conseguiu fazer tudo sozinha, sem eu precisar ficar em cima. É impressionante ver ela escrevendo código em C++." />
            <TestimonialCard name="Luciana Dias" role="Mãe do João (9 anos)" stars={5} text="Entrega super rápida. O kit vem muito bem organizado na maleta. O suporte do professor Augusto também fez toda a diferença." />
          </div>
        </div>
      </section>

      {/* 7. PROFESSOR */}
      <section id="professor" className="py-20 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="text-[#e53e3e] font-bold uppercase tracking-widest text-sm">Coordenação Pedagógica</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mt-2 mb-6 flex items-center gap-3">
              <UserPlus size={36} className="text-[#e53e3e]" /> Conheça o Prof. Augusto Queiroz
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">Com sólida formação em TICs, Augusto é <strong>Técnico em Eletrônica</strong>, <strong>Analista de Sistemas</strong> e especialista em <strong>Engenharia da Computação</strong>. Atua como professor de programação e robótica, ensinando desde crianças que dão os primeiros passos até adultos em busca de especialização.</p>
            <p className="text-gray-600 leading-relaxed mb-6">Membro ativo do <a href="https://codeclubbrasil.org.br/" target="_blank" rel="noopener noreferrer" className="text-[#e53e3e] font-bold hover:underline">CodeClub Brasil</a> e mentor em torneios, atua frequentemente como juiz em competições prestigiadas como a <strong>FLL</strong> (First LEGO League) e <strong>WRO</strong> (World Robot Olympiad). Suas aulas focam na autonomia para que o aluno use a tecnologia como ferramenta de criação.</p>
            <p className="text-gray-600 leading-relaxed mb-6">Apaixonado por educação tecnológica, Augusto acredita que a robótica é uma ponte para o futuro, capacitando jovens mentes a se tornarem os inovadores de amanhã.</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-[#1a365d] font-bold text-sm flex items-center gap-2"><GraduationCap size={16} /> Engº Computação</div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-[#1a365d] font-bold text-sm flex items-center gap-2"><Award size={16} /> Juiz FLL & WRO</div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-[#1a365d] font-bold text-sm flex items-center gap-2"><Code size={16} /> CodeClub</div>
              {/* --- NOVO: BOTÃO LINKEDIN --- */}
              <a href="https://www.linkedin.com/in/queiroz-augusto/" target="_blank" rel="noopener noreferrer" className="bg-[#0077b5] hover:bg-[#005582] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                <Linkedin size={16} /> Ver Perfil Profissional
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-[#e53e3e] rounded-full opacity-10 transform translate-x-4 translate-y-4"></div>
              <img src="/educacional/professor.jpg" alt="Prof. Augusto Queiroz" className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10 bg-gray-200" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#f3f4f6'; }} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CERTIFICADO (20 HORAS) */}
      <section id="certificado" className="py-20 px-4 bg-gradient-to-r from-yellow-50 to-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block px-4 py-1 bg-yellow-100 border border-yellow-200 rounded-full text-yellow-700 font-bold text-xs uppercase tracking-widest mb-4">Reconhecimento</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-6 flex items-center gap-3">
              <FileCheck size={36} className="text-[#e53e3e]" /> Certificado de Conclusão
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">Ao concluir os projetos da apostila, e responder um questionário, <strong>o aluno recebe um certificado nominal de conclusão de 20 horas</strong>. Um documento que valida o aprendizado e enriquece o currículo escolar como atividade extracurricular, na Competência Geral 5 da <strong>Base Nacional Comum Curricular/BNCC</strong>: Cultura Digital.</p>
            <ul className="space-y-4">
              {["Carga horária válida em todo território nacional", "Assinado pelo Prof. Augusto (Engº da Computação)", "Comprovação de habilidades em Lógica e Robótica"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-yellow-100"><div className="bg-yellow-400 text-white p-1 rounded-full"><CheckCircle size={16} /></div><span className="text-[#1a365d] font-bold text-sm">{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="relative transform hover:scale-105 transition duration-500">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
            <img src="/educacional/certificado.jpg" alt="Modelo do Certificado ACNP" className="relative rounded-xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition duration-300 w-full" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#fef3c7'; }} />
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-xl shadow-lg border border-gray-100"><Award size={32} className="text-yellow-500" /></div>
          </div>
        </div>
      </section>

      {/* 9. ACNP HISTÓRIA */}
      <section id="acnp" className="py-20 px-4 bg-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[#e53e3e] opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-8 flex items-center justify-center gap-3">
            <Calendar size={36} className="text-[#e53e3e]" /> A Associação Cultural Nascente Pequena - ACNP
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left bg-white p-8 md:p-12 rounded-[2rem] shadow-xl items-center">
            <div className="flex flex-col items-center text-center">
              <img src="/educacional/logo-acnp.png" alt="Logo ACNP" className="h-36 w-auto mb-6" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#f3f4f6'; }} />
              <div className="flex items-center gap-2 mb-2 bg-blue-100 px-4 py-1 rounded-full"><Calendar size={18} className="text-[#1a365d]" /><span className="font-bold text-[#1a365d] text-sm">Fundada em 1987</span></div>
              <a href="https://nascentepequena.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#1a365d] hover:bg-[#e53e3e] px-6 py-3 rounded-full mt-4 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1"><Globe size={16} /> Conheça nossa História Completa</a>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
              <p className="text-gray-600 leading-relaxed mb-6"><strong>Com mais de 38 anos de história</strong>, a ACNP é mais do que uma organização; é um patrimônio cultural da cidade de Guapimirim no RJ. Com uma <strong>trajetória dedicada à transformação social através da arte e educação</strong>, a ONG é referência de trabalho sério e dedicação da comunidade ao longo dos anos, sendo uma <strong>instituição de Utilidade Pública</strong> reconhecida por Lei Municipal.</p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3"><div className="bg-[#e53e3e] p-2 rounded-lg text-white"><Heart size={18} /></div><div><h5 className="font-bold text-[#1a365d]">Inclusão Social</h5><p className="text-sm text-gray-500">Ações socioeducativas que mobilizam o cidadão.</p></div></div>
                <div className="flex items-start gap-3"><div className="bg-[#e53e3e] p-2 rounded-lg text-white"><Leaf size={18} /></div><div><h5 className="font-bold text-[#1a365d]">Sustentabilidade</h5><p className="text-sm text-gray-500">Projetos socioambientais inovadores e reciclagem.</p></div></div>
                <div className="flex items-start gap-3"><div className="bg-[#e53e3e] p-2 rounded-lg text-white"><Code size={18} /></div><div><h5 className="font-bold text-[#1a365d]">Inovação (2019)</h5><p className="text-sm text-gray-500">Início dos cursos de tecnologia: Robótica e Programação.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CHECKOUT COMPLETO */}
      <section id="checkout" className="py-24 px-4 bg-[#f0f4f8] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 mb-10">
            <h3 className="text-2xl font-bold text-[#1a365d] mb-6 flex items-center gap-2"><Package size={28} className="text-[#e53e3e]" /> O que você está adquirindo:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><div className="bg-blue-100 p-2 rounded-lg text-[#1a365d]"><Monitor size={20} /></div><div><h4 className="font-bold text-[#1a365d]">Curso Completo</h4><p className="text-xs text-gray-500">Metodologia Ativa e Prática</p></div></div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><div className="bg-blue-100 p-2 rounded-lg text-[#1a365d]"><Cpu size={20} /></div><div><h4 className="font-bold text-[#1a365d]">Kit Arduino + de 80 Peças</h4><p className="text-xs text-gray-500">Hardware completo para 15 projetos</p></div></div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><div className="bg-blue-100 p-2 rounded-lg text-[#1a365d]"><FileText size={20} /></div><div><h4 className="font-bold text-[#1a365d]">Apostila Impressa</h4><p className="text-xs text-gray-500">Material didático especial</p></div></div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><div className="bg-blue-100 p-2 rounded-lg text-[#1a365d]"><Award size={20} /></div><div><h4 className="font-bold text-[#1a365d]">Certificado Oficial</h4><p className="text-xs text-gray-500">20 Horas (Digital)</p></div></div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl sm:col-span-2"><div className="bg-green-100 p-2 rounded-lg text-green-700"><Headphones size={20} /></div><div><h4 className="font-bold text-[#1a365d]">Suporte Pós-Compra</h4><p className="text-xs text-gray-500">Acompanhamento com Prof. Augusto Queiroz</p></div></div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-end border-t border-gray-100 pt-6 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full text-sm border border-green-100 self-start"><Truck size={18} /> Frete Grátis para todo Brasil</div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium ml-1">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><QrCode size={14} /> Pix</span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Barcode size={14} /> Boleto</span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><CreditCard size={14} /> Cartão</span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-400 line-through font-bold">De R$ 397,00</p>
                <p className="text-4xl font-extrabold text-[#1a365d]">R$ 294,00</p>
                <p className="text-xs text-gray-400">À vista ou Parcelado</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-4 border-white ring-1 ring-gray-100">
            <div className="text-center mb-10">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Passo Final</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mt-4 mb-2 flex items-center justify-center gap-3">
                <CreditCard size={36} className="text-[#e53e3e]" /> Matrícula + Envio do Kit
              </h2>
              <p className="text-gray-500">Preencha os dados com atenção para realizar a matrícula e enviarmos o kit.</p>
            </div>
            <form onSubmit={handlePurchase} className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-bold text-[#1a365d] flex items-center gap-2 border-b pb-2"><User size={18} /> Dados do Responsável</h4>
                <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Nome Completo</label><input type="text" name="nome" required value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Nome do Responsável" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">CPF</label><input type="text" name="cpf" required value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] outline-none transition" placeholder="000.000.000-00" /></div>
                  <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">WhatsApp</label><input type="tel" name="telefone" required value={formData.telefone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] outline-none transition" placeholder="(00) 00000-0000" /></div>
                </div>
                <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">E-mail</label><input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] outline-none transition" placeholder="Seu melhor e-mail" /></div>
              </div>
              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-[#1a365d] flex items-center gap-2 border-b pb-2"><GraduationCap size={18} /> Dados do Aluno</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2"><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Nome do Aluno</label><input type="text" name="nomeAluno" required value={formData.nomeAluno} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Nome completo do aluno" /></div>
                  <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Idade</label><input type="number" name="idadeAluno" required value={formData.idadeAluno} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Anos" /></div>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-[#1a365d] flex items-center gap-2 border-b pb-2"><MapPin size={18} /> Endereço de Entrega do Kit</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1"><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">CEP</label><input type="text" name="cep" required value={formData.cep} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="00000-000" /></div>
                  <div className="col-span-2"><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Cidade / Estado</label><input type="text" name="cidade" required value={formData.cidade} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Ex: Rio de Janeiro / RJ" /></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3"><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Endereço (Rua/Av)</label><input type="text" name="endereco" required value={formData.endereco} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Nome da Rua" /></div>
                  <div className="col-span-1"><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Número</label><input type="text" name="numero" required value={formData.numero} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="123" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Bairro</label><input type="text" name="bairro" required value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Bairro" /></div>
                  <div><label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Complemento</label><input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e53e3e] focus:bg-white outline-none transition" placeholder="Apto, Bloco (Opcional)" /></div>
                </div>
              </div>

              {/* ÁREA DE CUPOM DE DESCONTO (NOVO) */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Tag size={12} /> Possui Cupom de Desconto?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 p-3 border border-gray-300 rounded-lg uppercase font-bold text-[#1a365d] outline-none focus:border-[#e53e3e] text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCoupon}
                    disabled={isValidatingCoupon || couponData}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition text-sm ${couponData ? 'bg-green-500' : 'bg-gray-400 hover:bg-gray-500'}`}
                  >
                    {couponData ? 'Aplicado' : (isValidatingCoupon ? '...' : 'Aplicar')}
                  </button>
                </div>
                {couponData && (
                  <div className="mt-2 text-green-600 text-xs font-bold flex justify-between animate-fade-in">
                    <span>Desconto de {couponData.discount}% aplicado!</span>
                    <span>- R$ {((294 * couponData.discount) / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="text-xl py-5 shadow-2xl shadow-red-200 flex flex-col items-center justify-center leading-tight h-auto gap-1">
                  {isLoading ? "Processando..." : (
                    <>
                      <span className="flex items-center gap-2">
                        Pagar {couponData ? `R$ ${(294 * (1 - couponData.discount / 100)).toFixed(2).replace('.', ',')}` : 'R$ 294,00'} e Finalizar <ArrowRight size={24} />
                      </span>
                    </>
                  )}
                </Button>
                <div className="mt-4 flex flex-col items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-2"><Lock size={12} /> Compra 100% Segura</div>
                  <div className="flex gap-2 opacity-60"><CreditCard size={16} /> Pagamento Processado com Segurança</div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a365d] mb-4 flex items-center justify-center gap-3">
              <HelpCircle size={36} className="text-[#e53e3e]" /> Dúvidas Comuns
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Para qual idade é recomendado?", a: "O curso é ideal para jovens de 8 a 15 anos. Crianças alfabetizadas já conseguem acompanhar a apostila ilustrada." },
              { q: "Sou adulto, posso fazer o curso?", a: "Com certeza! Apesar da linguagem didática ser voltada para o público jovem, o conteúdo técnico de Arduino e Eletrônica é completo e serve perfeitamente para adultos iniciantes que querem entrar no mundo maker." },
              { q: "Precisa de internet o tempo todo?", a: "Não! A internet é necessária apenas para baixar o software do Arduino (uma única vez). Todo o aprendizado segue a apostila impressa." },
              { q: "Precisa saber programação ou eletrônica?", a: "Absolutamente não. Ensinamos do zero absoluto: desde o que é um LED até códigos complexos." },
              { q: "É seguro? Tem risco de choque?", a: "Totalmente seguro. O kit trabalha com 5 Volts (alimentação USB), que é inofensivo ao toque humano. Não usamos solda nem ferramentas perigosas." },
              { q: "Qual computador preciso ter?", a: "Qualquer computador ou notebook simples (Windows, Mac ou Linux) com uma entrada USB funciona perfeitamente." }
            ].map((faq, i) => (
              <AccordionItem key={i} icon={<HelpCircle size={20} />} title={faq.q} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>{faq.a}</AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CONTATO */}
      <section id="contato" className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a365d] mb-4 flex items-center gap-3">
              <Mail size={36} className="text-[#e53e3e]" /> Fale Conosco
            </h2>
            <p className="text-gray-600 mb-8">Tem alguma dúvida específica ou precisa de ajuda? Nossa equipe está pronta para atender você.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full text-[#1a365d]"><Phone size={24} /></div>
                <div><h4 className="font-bold text-[#1a365d]">Telefone / WhatsApp</h4><p className="text-gray-500">(21) 92043-6492</p></div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full text-[#1a365d]"><Mail size={24} /></div>
                <div><h4 className="font-bold text-[#1a365d]">E-mail</h4><p className="text-gray-500">contato@roboticaacnp.com.br</p></div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full text-[#1a365d]"><MapPin size={24} /></div>
                <div><h4 className="font-bold text-[#1a365d]">Localização</h4><p className="text-gray-500">Guapimirim / RJ</p></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-[#1a365d] mb-6 flex items-center gap-2"><MousePointer size={24} className="text-[#e53e3e]" /> Envie uma mensagem</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input type="text" required placeholder="Seu Nome" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1a365d]" />
              <input type="email" required placeholder="Seu E-mail" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1a365d]" />
              <textarea required placeholder="Como podemos ajudar?" rows="4" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1a365d]"></textarea>
              <button type="submit" className="w-full bg-[#1a365d] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition flex items-center justify-center gap-2">
                <Send size={18} /> Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a365d] text-white py-16 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">

          <div className="flex flex-col items-center md:items-start">
            <div className="bg-white p-3 rounded-xl mb-4 inline-block">
              <img
                src="/educacional/logo-acnp.png"
                alt="ACNP"
                className="h-16 w-auto"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="font-extrabold text-[#1a365d] text-2xl px-2">ACNP</span>' }}
              />
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Associação Cultural Nascente Pequena.<br />
              Transformando vidas através da educação, cultura e tecnologia desde 1987.
            </p>
            <div className="text-xs text-blue-400">CNPJ: 31.828.296/0001-67</div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">Menu Rápido</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li><button onClick={() => scrollToSection('metodo')} className="hover:text-[#e53e3e] transition">O Curso</button></li>
              <li><button onClick={() => scrollToSection('kit')} className="hover:text-[#e53e3e] transition">Material Didático</button></li>
              <li><button onClick={() => scrollToSection('projetos')} className="hover:text-[#e53e3e] transition">Projetos</button></li>
              <li><button onClick={() => scrollToSection('depoimentos')} className="hover:text-[#e53e3e] transition">Depoimentos</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-[#e53e3e] transition">Dúvidas Comuns</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">Área do Cliente</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li><button onClick={() => navigate('/login')} className="hover:text-[#e53e3e] transition font-bold text-white flex items-center justify-center md:justify-start gap-2"><LogIn size={14} /> Área do Aluno</button></li>
              <li><button onClick={() => navigate('/validar')} className="hover:text-[#e53e3e] transition flex items-center justify-center md:justify-start gap-2"><FileCheck size={14} /> Validação de Certificado</button></li>
              <li className="pt-2 border-t border-blue-800/50 mt-2"><button onClick={() => navigateTo('privacy')} className="hover:text-[#e53e3e] transition">Política de Privacidade</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-[#e53e3e] transition">Termos de Uso</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">Fale Conosco</h4>
            <ul className="space-y-4 text-blue-200 text-sm mb-6">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="bg-blue-900 p-1.5 rounded-lg"><Phone size={14} /></div>
                <span>(21) 92043-6492</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="bg-blue-900 p-1.5 rounded-lg"><Mail size={14} /></div>
                <span>contato@roboticaacnp.com.br</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="bg-blue-900 p-1.5 rounded-lg"><MapPin size={14} /></div>
                <span>Guapimirim / RJ</span>
              </li>
            </ul>

            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://www.instagram.com/roboticaeducacionalacnp" target="_blank" rel="noopener noreferrer" className="bg-blue-900 p-3 rounded-xl hover:bg-[#e53e3e] transition-colors group">
                <Instagram size={20} className="group-hover:text-white" />
              </a>
              <a href="https://www.facebook.com/roboticaeducacionalacnp" target="_blank" rel="noopener noreferrer" className="bg-blue-900 p-3 rounded-xl hover:bg-[#e53e3e] transition-colors group">
                <Facebook size={20} className="group-hover:text-white" />
              </a>
            </div>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-blue-900/50 text-center">
          <p className="text-blue-500 text-xs"><strong>© 2026 Robótica Educacional ACNP</strong></p>
          <p className="text-blue-500 text-xs">Todos os direitos reservados</p>
          <p className="text-blue-500 text-xs"><strong>Sistema desenvolvido por:</strong> Augusto Queiroz</p>
        </div>
      </footer>

      {/* BOTÕES FLUTUANTES */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        <a
          href="https://wa.me/5521920436492"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          title="Fale no WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              className="bg-[#1a365d] hover:bg-blue-900 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
              title="Voltar ao topo"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}