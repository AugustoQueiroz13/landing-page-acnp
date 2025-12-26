import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import {
    LogOut, User, Box, Award, BookOpen,
    LayoutDashboard, Settings, ExternalLink,
    CheckCircle, AlertCircle, Lock, Save,
    CreditCard, Calendar, Hash, Baby, Clock, FileText,
    LifeBuoy, Wrench, GraduationCap, MessageCircle, Send, Menu, X
} from 'lucide-react';

// --- CONFIGURAÇÕES ---
const DIAS_CARENCIA_PROVA = 20;
const NOTA_MINIMA = 7.0;
const MAX_TENTATIVAS = 3;

// --- CONFIGURAÇÃO DO SUPORTE ---
const PHONE_SUPORTE_TECNICO = "5521920436492";
const PHONE_SUPORTE_PEDAGOGICO = "5521920436492";

// Banco de Perguntas (Baseado na Apostila)
const PERGUNTAS_BASE = [
    { id: 1, question: "Qual a função do 'void setup()' no código do Arduino?", options: ["Roda repetidamente para sempre", "Roda apenas uma vez ao ligar a placa", "Desliga o Arduino", "Controla a voltagem"], correct: 1 },
    { id: 2, question: "Para que serve um Resistor ligado a um LED?", options: ["Aumentar o brilho", "Mudar a cor do LED", "Limitar a corrente para não queimar o LED", "Armazenar energia"], correct: 2 },
    { id: 3, question: "Como identificar o pino positivo (Anodo) de um LED?", options: ["É a perna menor", "É a perna maior", "É a perna do meio", "Não tem lado certo"], correct: 1 },
    { id: 4, question: "O que o sensor LDR detecta?", options: ["Temperatura", "Umidade", "Luminosidade (Luz)", "Movimento"], correct: 2 },
    { id: 5, question: "Qual comando faz o Arduino 'esperar' um tempo?", options: ["stop()", "wait()", "pause()", "delay()"], correct: 3 },
    { id: 6, question: "Qual a diferença principal entre um Servo Motor e um Motor comum?", options: ["O Servo obedece a uma posição (ângulo) exata", "O Servo gira mais rápido", "O Servo não precisa de energia", "Não há diferença"], correct: 0 },
    { id: 7, question: "Na protoboard, como as linhas laterais (vermelho/azul) estão conectadas?", options: ["Na vertical", "Não são conectadas", "Na horizontal (de ponta a ponta)", "Em diagonal"], correct: 2 }
];

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const translateStatus = (status) => {
    const map = { 'PENDING': 'Pendente', 'PAID': 'Matrícula Confirmada', 'CANCELED': 'Cancelado', 'ACTIVE': 'Ativa', 'PREPARING': 'Em Preparação', 'SHIPPED': 'Enviado', 'DELIVERED': 'Entregue' };
    return map[status] || status;
};

// Função para embaralhar array
const shuffleArray = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estados do Quiz
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [tentativas, setTentativas] = useState(MAX_TENTATIVAS);

    // Estados de Edição e Suporte
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [supportMsg, setSupportMsg] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/meus-dados`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Token inválido");
                return res.json();
            })
            .then(userData => {
                setData(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.addresses?.[0]?.street || ''
                });

                const studentWithEnrollment = userData.students?.find(s => s.enrollments.length > 0);
                if (studentWithEnrollment?.enrollments?.[0]?.examAttempts) {
                    const attempts = studentWithEnrollment.enrollments[0].examAttempts;
                    const passedAttempt = attempts.find(a => a.passed);

                    if (passedAttempt) {
                        setScore(passedAttempt.score);
                    } else {
                        const attemptsMade = attempts.length;
                        setTentativas(Math.max(0, MAX_TENTATIVAS - attemptsMade));
                    }
                }
            })
            .catch(() => { localStorage.removeItem('token'); navigate('/login'); });
    }, [navigate]);

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

    const startQuiz = () => {
        if (tentativas > 0) {
            setQuizQuestions(shuffleArray(PERGUNTAS_BASE));
            setQuizStarted(true);
            setCurrentQuestion(0);
            setAnswers([]);
            setScore(null);
        }
    };

    const handleAnswer = (optionIndex) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestion + 1 < quizQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            let correctCount = 0;
            newAnswers.forEach((ans, idx) => {
                if (ans === quizQuestions[idx].correct) correctCount++;
            });
            const finalScore = (correctCount / quizQuestions.length) * 10;
            setScore(finalScore);
            setQuizStarted(false);
            setTentativas(prev => prev - 1);

            const token = localStorage.getItem('token');
            fetch(`${API_URL}/api/salvar-nota`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ score: finalScore })
            });
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/atualizar-perfil`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) { alert("Dados salvos com sucesso!"); setData({ ...data, ...formData }); }
        } catch (e) { console.error(e); } finally { setIsSaving(false); }
    };

    const handleSendSupport = (e, type) => {
        e.preventDefault();
        alert(`Sua mensagem de suporte ${type === 'tecnico' ? 'TÉCNICO' : 'PEDAGÓGICO'} foi enviada! Responderemos por e-mail em até 24h.`);
        setSupportMsg('');
    };

    const openWhatsApp = (type) => {
        const phone = type === 'tecnico' ? PHONE_SUPORTE_TECNICO : PHONE_SUPORTE_PEDAGOGICO;
        const text = type === 'tecnico'
            ? `Olá, sou o(a) aluno(a) ${data.name}. Preciso de ajuda técnica com a plataforma.`
            : `Olá Prof. Augusto, sou o(a) aluno(a) ${data.students?.[0]?.name || data.name}. Tenho uma dúvida sobre a aula.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const getQuizStatus = (matricula, pedido) => {
        if (!pedido || pedido.status !== 'PAID') {
            return { allowed: false, title: "Bloqueio Financeiro", message: "Aguardando confirmação do pagamento." };
        }
        // Correção de segurança para data inválida
        if (!matricula.createdAt) return { allowed: false, title: "Erro", message: "Data de matrícula inválida." };

        const dataMatricula = new Date(matricula.createdAt);
        const dataLiberacao = new Date(dataMatricula);
        dataLiberacao.setDate(dataMatricula.getDate() + DIAS_CARENCIA_PROVA);

        const dataHoje = new Date();
        if (dataHoje < dataLiberacao) {
            const dataFormatada = dataLiberacao.toLocaleDateString('pt-BR');
            return { allowed: false, title: "Conteúdo em Andamento", message: `Prova libera dia ${dataFormatada}.` };
        }
        return { allowed: true };
    };

    if (!data) return <div className="min-h-screen flex items-center justify-center text-[#1a365d] font-bold">Carregando portal...</div>;

    const aluno = data.students?.find(s => s.enrollments && s.enrollments.length > 0) || data.students?.[0];
    const matricula = aluno?.enrollments?.[0];
    const pedido = data.orders?.[0];
    const nomeCurso = pedido?.items?.[0]?.product?.name || "Curso Robótica ACNP";
    const quizStatus = (matricula && pedido) ? getQuizStatus(matricula, pedido) : { allowed: false, title: "Erro de Dados", message: "Contate o suporte." };
    const numeroMatriculaExibicao = matricula?.code ? matricula.code : (matricula?.id ? matricula.id.substring(0, 8).toUpperCase() : '---');

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row">

            {/* HEADER MOBILE (NOVO) */}
            <div className="md:hidden bg-[#1a365d] text-white p-4 flex justify-between items-center shadow-md z-50">
                <span className="font-bold">Portal do Aluno</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* SIDEBAR */}
            <aside className={`bg-[#1a365d] text-white w-full md:w-64 flex-shrink-0 flex flex-col transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
                <div className="p-6 border-b border-blue-800 flex items-center gap-3 hidden md:flex">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                        {data.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-sm truncate">{data.name?.split(' ')[0]}</h2>
                        <span className="text-xs text-blue-300">Responsável</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-[#e53e3e] shadow-lg' : 'hover:bg-white/10 text-blue-200'}`}>
                        <LayoutDashboard size={20} /> Visão Geral
                    </button>
                    <button onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#e53e3e] shadow-lg' : 'hover:bg-white/10 text-blue-200'}`}>
                        <Settings size={20} /> Meus Dados
                    </button>
                    <button onClick={() => { setActiveTab('manual'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'manual' ? 'bg-[#e53e3e] shadow-lg' : 'hover:bg-white/10 text-blue-200'}`}>
                        <BookOpen size={20} /> Manual
                    </button>
                    <button onClick={() => { setActiveTab('certificate'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'certificate' ? 'bg-[#e53e3e] shadow-lg' : 'hover:bg-white/10 text-blue-200'}`}>
                        <Award size={20} /> Avaliação
                    </button>
                    <button onClick={() => { setActiveTab('support'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'support' ? 'bg-[#e53e3e] shadow-lg' : 'hover:bg-white/10 text-blue-200'}`}>
                        <LifeBuoy size={20} /> Suporte
                    </button>
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-300 hover:text-white transition-colors w-full px-4"><LogOut size={16} /> Sair</button>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">

                    {/* --- ABA 1: VISÃO GERAL --- */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-extrabold text-[#1a365d]">Painel do Curso</h1>

                            {pedido && pedido.status !== 'PAID' && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="text-yellow-600 w-6 h-6" />
                                        <div>
                                            <p className="font-bold text-yellow-800">Pagamento Pendente</p>
                                            <p className="text-sm text-yellow-700">Seu acesso será liberado após a confirmação.</p>
                                        </div>
                                    </div>
                                    {pedido.paymentUrl && (
                                        <a href={pedido.paymentUrl} target="_blank" rel="noopener noreferrer" className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-700 whitespace-nowrap">Pagar Agora</a>
                                    )}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Card Matrícula */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-lg text-[#1a365d] mb-4 flex items-center gap-2"><BookOpen size={24} /> Dados da Matrícula</h3>
                                    {aluno ? (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Aluno(a) Matriculado(a)</p>
                                                <p className="font-bold text-[#1a365d] text-xl">{aluno.name}</p>
                                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">{aluno.age} anos</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-gray-50 p-3 rounded-lg flex-1 border border-gray-100">
                                                    <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1"><Hash size={12} /> Nº Matrícula</p>
                                                    <p className="font-mono text-[#1a365d] font-bold text-lg tracking-wide">{numeroMatriculaExibicao}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg flex-1 border border-gray-100">
                                                    <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1"><Calendar size={12} /> Data Início</p>
                                                    <p className="font-medium text-gray-700">
                                                        {matricula ? new Date(matricula.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : <p>Nenhuma matrícula ativa.</p>}
                                </div>

                                {/* Card Financeiro */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-lg text-[#1a365d] mb-4 flex items-center gap-2"><CreditCard size={24} /> Financeiro</h3>
                                    {pedido ? (
                                        <div className="space-y-3">
                                            <div className="border-b border-dashed border-gray-200 pb-3 mb-3">
                                                <p className="text-xs text-gray-500 uppercase font-bold">Curso Adquirido</p>
                                                <p className="font-medium text-gray-800 text-sm leading-tight mt-1">{nomeCurso}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Valor Total</span>
                                                <span className="font-bold text-[#1a365d]">{formatCurrency(pedido.total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Status</span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${pedido.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {translateStatus(pedido.status)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Método</span>
                                                <span className="text-gray-800 text-sm uppercase">{pedido.paymentMethod || 'Checkout Online'}</span>
                                            </div>
                                        </div>
                                    ) : <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>}
                                </div>
                            </div>

                            {/* Card Rastreamento */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2 mb-4 text-[#e53e3e]"><Box size={24} /><h3 className="font-bold text-lg">Rastreamento do Kit</h3></div>
                                {pedido?.shipment ? (
                                    <div className="bg-gray-50 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-600">Status Logístico: <strong>{translateStatus(pedido.shipment.status)}</strong></p>
                                            {pedido.shipment.trackingCode ? (
                                                <div className="mt-2">
                                                    <span className="text-xs text-gray-500 uppercase font-bold">Código de Rastreio:</span>
                                                    <p className="font-mono text-xl text-[#1a365d] font-bold select-all">{pedido.shipment.trackingCode}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-yellow-600 flex items-center gap-1 mt-2 font-bold bg-yellow-50 px-2 py-1 rounded">
                                                    <Clock size={12} /> Aguardando geração do código...
                                                </span>
                                            )}
                                        </div>
                                        {pedido.shipment.trackingCode && (
                                            <a href={`https://rastreamento.correios.com.br/app/index.php?objetos=${pedido.shipment.trackingCode}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md w-full md:w-auto justify-center">
                                                Rastrear Objeto <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                ) : <p className="text-gray-500">Logística não iniciada.</p>}
                            </div>
                        </div>
                    )}

                    {/* --- ABA MANUAL --- */}
                    {activeTab === 'manual' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-extrabold text-[#1a365d] mb-6">Manual</h1>
                            <div className="grid gap-6">
                                {/* Card 1: Sobre o Kit */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-xl text-[#1a365d]"><Box size={28} /></div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1a365d] mb-2">Sobre o Kit de Robótica</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                                Seu kit contém todos os componentes necessários para os projetos da apostila "Robótica Educacional" que é um material didático de alto padrão, incluindo:
                                            </p>
                                            <ul className="text-gray-600 text-sm space-y-1 list-disc pl-4 mb-3">
                                                <li>Placa Arduino Uno R3 e Cabo USB.</li>
                                                <li>Protoboard, LEDs e Resistores.</li>
                                                <li>Sensores (LDR, NTC, Tilt) e Botões.</li>
                                                <li>Atuadores (Servo Motor e Buzzer).</li>
                                            </ul>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                <strong className="text-[#1a365d]">Rastreamento:</strong> Assim que seu pedido for despachado (em até 3 dias úteis após o pagamento), o código de rastreamento aparecerá automaticamente na aba "Visão Geral".
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Prazos e Avaliação */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-700"><Clock size={28} /></div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1a365d] mb-2">Prazos e Avaliação</h3>
                                            <ul className="text-gray-600 text-sm space-y-2 list-disc pl-4">
                                                <li><strong>Carência Pedagógica ({DIAS_CARENCIA_PROVA} dias):</strong> Para garantir que o(a) aluno(a) tenha tempo de receber o kit, estudar a apostila e montar os projetos, a avaliação final só é desbloqueada 20 dias após a confirmação da matrícula.</li>
                                                <li><strong>Nota Mínima:</strong> É necessário obter nota <strong>{NOTA_MINIMA.toFixed(1)}</strong> (70% de acerto) para obter aprovação.</li>
                                                <li><strong>Tentativas:</strong> Você tem <strong>{MAX_TENTATIVAS} tentativas</strong>. A cada nova tentativa, as perguntas são sorteadas novamente.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: Certificado */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-xl text-green-700"><Award size={28} /></div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1a365d] mb-2">Certificado de Conclusão</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                                Ao obter aprovação na avaliação, o certificado é gerado automaticamente em formato PDF de alta resolução, pronto para impressão.
                                            </p>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                O documento contém o nome do(a) aluno(a), a carga horária e um <strong>Código de Autenticidade</strong> exclusivo, que permite a qualquer pessoa validar a veracidade do certificado em nosso site. Sugerimos que imprima seu certificado e coloque em um quadro para valorizar conquista e incentivar a avançar cada vez mais!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ABA 4: AVALIAÇÃO (CERTIFICAÇÃO) --- */}
                    {activeTab === 'certificate' && (
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#1a365d] mb-6">Avaliação Final</h1>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                {score !== null && score >= NOTA_MINIMA ? (
                                    <div className="text-center animate-fade-in">
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50"><CheckCircle size={48} /></div>
                                        <h2 className="text-3xl font-extrabold text-green-700 mb-2">Aprovado!</h2>
                                        <p className="text-gray-600 mb-6 text-lg">Nota Final: <strong>{score.toFixed(1)}</strong></p>
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-6 max-w-lg mx-auto">
                                            <p className="text-sm text-gray-500 mb-2">Certificado emitido para:</p>
                                            <p className="text-xl font-bold text-[#1a365d]">{aluno?.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">Matrícula: {matricula?.code}</p>
                                        </div>
                                        {aluno && (
                                            <a href={`${API_URL}/api/certificado/${aluno.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a365d] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-900 transition shadow-xl transform hover:-translate-y-1 text-lg">
                                                <Award size={24} /> Baixar Certificado PDF
                                            </a>
                                        )}
                                    </div>
                                ) : score !== null && score < NOTA_MINIMA ? (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={40} /></div>
                                        <h2 className="text-2xl font-bold text-red-700">Nota Insuficiente</h2>
                                        <p className="text-gray-600 mb-4">Sua nota: <strong>{score.toFixed(1)}</strong>. Mínimo: <strong>{NOTA_MINIMA.toFixed(1)}</strong>.</p>
                                        {tentativas > 0 ? (
                                            <>
                                                <p className="text-sm text-gray-500 mb-6">Você tem mais <strong>{tentativas}</strong> tentativas.</p>
                                                <button onClick={startQuiz} className="bg-[#e53e3e] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 shadow-lg">Tentar Novamente</button>
                                            </>
                                        ) : (
                                            <div className="bg-red-50 p-4 rounded-xl text-red-800 font-bold border border-red-200">Tentativas esgotadas. Entre em contato com o suporte.</div>
                                        )}
                                    </div>
                                ) : !quizStarted ? (
                                    <div className="text-center">
                                        {quizStatus.allowed ? (
                                            <>
                                                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1a365d]"><FileText size={32} /></div>
                                                <h3 className="text-2xl font-bold text-[#1a365d] mb-2">Avaliação Final Disponível</h3>
                                                <p className="text-gray-500 max-w-md mx-auto mb-4">Responda ao questionário sobre Arduino e Eletrônica (baseado na apostila) para obter a certificação de <strong>{aluno?.name}</strong>.</p>
                                                {tentativas > 0 ? (
                                                    <>
                                                        <p className="text-sm text-blue-600 font-bold mb-6 bg-blue-50 inline-block px-4 py-1 rounded-full">{tentativas} tentativas restantes</p><br />
                                                        <button onClick={startQuiz} className="bg-[#1a365d] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg text-lg">Iniciar Avaliação Agora</button>
                                                    </>
                                                ) : (
                                                    <div className="bg-red-50 p-4 rounded-xl text-red-800 font-bold border border-red-200 max-w-md mx-auto">Tentativas esgotadas.</div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Lock size={32} /></div>
                                                <h3 className="text-xl font-bold text-gray-700 mb-2">{quizStatus.title}</h3>
                                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl max-w-md mx-auto mt-4 flex items-start gap-3 text-left">
                                                    <Clock className="text-yellow-600 shrink-0 mt-1" size={20} />
                                                    <div>
                                                        <p className="font-bold text-yellow-800 text-sm">{quizStatus.title}</p>
                                                        <p className="text-yellow-700 text-sm mt-1">{quizStatus.message}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto">
                                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                                            <span className="text-sm font-bold text-gray-400 uppercase">Questão {currentQuestion + 1}/{quizQuestions.length}</span>
                                            <button onClick={() => setQuizStarted(false)} className="text-xs text-red-500 font-bold hover:underline">CANCELAR</button>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1a365d] mb-8">{quizQuestions[currentQuestion].question}</h3>
                                        <div className="space-y-4">
                                            {quizQuestions[currentQuestion].options.map((opt, idx) => (
                                                <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-5 border-2 border-gray-100 rounded-xl hover:border-[#1a365d] hover:bg-blue-50 transition font-medium text-gray-700 text-lg">{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- ABA 5: SUPORTE --- */}
                    {activeTab === 'support' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-extrabold text-[#1a365d] mb-6">Central de Suporte</h1>
                            <p className="text-gray-600">Selecione abaixo o tipo de ajuda que você precisa:</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Suporte Técnico */}
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
                                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                        <Wrench size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Suporte Técnico</h3>
                                    <p className="text-gray-500 text-sm mb-6 min-h-[40px]">Problemas com acesso ao site, pagamentos, rastreamento ou conta.</p>

                                    <button onClick={() => openWhatsApp('tecnico')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition mb-3">
                                        <MessageCircle size={20} /> Falar no WhatsApp
                                    </button>

                                    <form onSubmit={(e) => handleSendSupport(e, 'tecnico')}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Ou digite sua dúvida aqui..."
                                                className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                                                value={supportMsg}
                                                onChange={(e) => setSupportMsg(e.target.value)}
                                            />
                                            <button type="submit" className="absolute right-2 top-2 text-blue-600 hover:text-blue-800 p-1"><Send size={16} /></button>
                                        </div>
                                    </form>
                                </div>

                                {/* Suporte Pedagógico */}
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-purple-300 transition">
                                    <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                                        <GraduationCap size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Suporte Pedagógico</h3>
                                    <p className="text-gray-500 text-sm mb-6 min-h-[40px]">Dúvidas sobre o conteúdo das aulas, montagem dos projetos ou código.</p>

                                    <button onClick={() => openWhatsApp('pedagogico')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition mb-3">
                                        <MessageCircle size={20} /> Falar com Professor
                                    </button>

                                    <form onSubmit={(e) => handleSendSupport(e, 'pedagogico')}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Ou digite sua dúvida aqui..."
                                                className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-purple-500 outline-none"
                                                value={supportMsg}
                                                onChange={(e) => setSupportMsg(e.target.value)}
                                            />
                                            <button type="submit" className="absolute right-2 top-2 text-purple-600 hover:text-purple-800 p-1"><Send size={16} /></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ABA 2: PERFIL --- */}
                    {activeTab === 'profile' && (
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#1a365d] mb-6">Meus Dados</h1>

                            <div className="grid gap-8">
                                {/* Formulário de Dados Pessoais */}
                                <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 border-b pb-2 flex items-center gap-2"><User size={16} /> Responsável</h3>
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1">Nome</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" /></div>
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">CPF <Lock size={12} /></label><input type="text" value={data.cpf || ''} readOnly disabled className="w-full p-3 bg-gray-100 rounded-xl text-gray-400 cursor-not-allowed" /></div>
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1">E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" /></div>
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" /></div>
                                        <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-500 mb-1">Endereço de Entrega</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" /></div>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 border-b pb-2 mt-8 flex items-center gap-2"><Baby size={16} /> Aluno(a)</h3>
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">Nome do(a) Aluno(a) <Lock size={12} /></label><input type="text" value={aluno ? aluno.name : ''} readOnly disabled className="w-full p-3 bg-gray-100 rounded-xl text-gray-500 font-bold" /></div>
                                        <div><label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">Idade <Lock size={12} /></label><input type="text" value={aluno ? `${aluno.age} anos` : ''} readOnly disabled className="w-full p-3 bg-gray-100 rounded-xl text-gray-500" /></div>
                                    </div>
                                    <div className="flex justify-end"><button type="submit" disabled={isSaving} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2"><Save size={18} /> {isSaving ? "Salvando..." : "Salvar Alterações"}</button></div>
                                </form>

                                {/* Área de Segurança (Nova Senha) */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 border-b pb-2 flex items-center gap-2">
                                        <Lock size={16} /> Segurança
                                    </h3>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-gray-800">Alterar Senha de Acesso</p>
                                            <p className="text-sm text-gray-500">Defina uma nova senha para acessar seu painel.</p>
                                        </div>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            const nova = e.target.senha.value;
                                            if (!nova) return;
                                            const token = localStorage.getItem('token');
                                            const res = await fetch(`${API_URL}/api/alterar-senha`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                body: JSON.stringify({ novaSenha: nova })
                                            });
                                            if (res.ok) { alert("Senha alterada com sucesso!"); e.target.reset(); }
                                            else alert("Erro ao alterar senha.");
                                        }} className="flex gap-2 w-full md:w-auto">
                                            <input name="senha" type="password" placeholder="Nova senha" minLength={6} className="p-3 border rounded-xl flex-1 md:w-64" />
                                            <button type="submit" className="bg-[#1a365d] text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-900">Alterar</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}