import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import {
    LayoutDashboard, Package, Users, LogOut,
    Truck, CheckCircle, Search, Edit, X, Save,
    ExternalLink, AlertCircle, Key, UserPlus, Eye,
    BarChart2, Tag, Shield, Mail, Activity, EyeOff, Send,
    DollarSign, TrendingUp, ShoppingBag, Clock
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// Cores Modernas
const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6366F1'];

const translateStatus = (status) => {
    const map = {
        'PENDING': 'Pendente', 'PAID': 'Pago / Confirmado', 'PREPARING': 'Em Preparação',
        'SHIPPED': 'Enviado', 'DELIVERED': 'Entregue', 'CANCELED': 'Cancelado'
    };
    return map[status] || status;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR') + ' ' + new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Componente Card de KPI (Novo)
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{value}</h3>
            {subtext && <p className={`text-xs mt-2 font-medium ${subtext.includes('+') ? 'text-green-500' : 'text-gray-400'}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
            <Icon size={24} />
        </div>
    </div>
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('metrics');
    const [data, setData] = useState({ orders: [], students: [] });

    // ESTADO ATUALIZADO PARA O NOVO FORMATO DE DADOS (KPIs + Charts)
    const [metrics, setMetrics] = useState({
        kpis: { revenue: 0, students: 0, pending: 0, ticket: 0, conversion: 0 },
        charts: { sales: [], status: [] },
        recent: []
    });

    const [logs, setLogs] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- MODAIS & ESTADOS ---
    const [modalType, setModalType] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Forms
    const [trackingData, setTrackingData] = useState({ code: '', carrier: 'Correios', customCarrier: '', url: '' });
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
    const [newPassword, setNewPassword] = useState('');
    const [couponData, setCouponData] = useState({ code: '', discount: '' });
    const [emailData, setEmailData] = useState({ subject: '', message: '' });
    const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });
    const [newStudentData, setNewStudentData] = useState({ name: '', email: '', cpf: '', phone: '', age: '', parentName: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            // 1. Dados Básicos
            const res = await fetch(`${API_URL}/api/admin/dashboard-data`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.status === 401 || res.status === 403) { localStorage.removeItem('token'); navigate('/login'); return; }
            setData(await res.json());

            // 2. Métricas (Agora busca os dados avançados)
            const resMetrics = await fetch(`${API_URL}/api/admin/metrics`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (resMetrics.ok) setMetrics(await resMetrics.json());

            // 3. Logs
            const resLogs = await fetch(`${API_URL}/api/admin/logs`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (resLogs.ok) setLogs(await resLogs.json());

            // 4. Cupons
            const resCoupons = await fetch(`${API_URL}/api/admin/coupons`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (resCoupons.ok) setCoupons(await resCoupons.json());

        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    // --- AÇÕES DO SISTEMA ---

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/coupons`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(couponData)
        });
        if (res.ok) { alert("Cupom Criado!"); setModalType(null); fetchData(); }
        else alert("Erro ao criar cupom.");
    };

    const handleSendMassEmail = async (e) => {
        e.preventDefault();
        if (!confirm(`Tem certeza que deseja enviar este e-mail para TODOS os alunos?`)) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/mass-email`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(emailData)
        });
        if (res.ok) { alert("E-mails enviados!"); setModalType(null); fetchData(); }
        else alert("Erro no envio.");
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/create-admin`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newAdminData)
        });
        const json = await res.json();
        if (res.ok) { alert("Novo Admin criado com sucesso!"); setModalType(null); fetchData(); }
        else alert("Erro: " + json.error);
    };

    const handleApprovePayment = async (email) => {
        if (!window.confirm(`Confirmar pagamento para ${email}?`)) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/simular-pagamento`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ email })
        });
        if (res.ok) { alert("Curso Liberado!"); fetchData(); } else { alert("Erro."); }
    };

    const handleUpdateTracking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        // Lógica de transportadora manual
        const finalCarrier = trackingData.carrier === 'Outra' ? trackingData.customCarrier : trackingData.carrier;
        let finalUrl = trackingData.url;
        if (!finalUrl && finalCarrier === 'Correios' && trackingData.code) finalUrl = `https://rastreamento.correios.com.br/app/index.php?objetos=${trackingData.code}`;

        const res = await fetch(`${API_URL}/api/admin/atualizar-rastreio`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ orderId: selectedItem.id, trackingCode: trackingData.code, carrier: finalCarrier, trackingUrl: finalUrl })
        });
        if (res.ok) { alert("Salvo!"); setModalType(null); fetchData(); } else { alert("Erro."); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        alert("Dados capturados!\n\n(Requer implementação da rota '/api/admin/create-student' no backend para persistência real).");
        setModalType(null);
    };

    // --- FUNÇÃO IMPERSONATE REAL (CORRIGIDA) ---
    const handleImpersonate = async (student) => {
        if (!confirm(`Deseja acessar o sistema como o aluno ${student.name}?`)) return;

        const token = localStorage.getItem('token'); // Token do Admin
        try {
            const res = await fetch(`${API_URL}/api/admin/impersonate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId: student.user.id })
            });

            const json = await res.json();

            if (json.success) {
                localStorage.setItem('token', json.token); // Salva token do aluno
                alert(`Acesso concedido! Redirecionando para o painel de ${student.name}...`);
                navigate('/dashboard'); // Vai para o painel do aluno
                window.location.reload(); // Recarrega para aplicar
            } else {
                alert("Erro: " + json.error);
            }
        } catch (error) {
            alert("Erro ao conectar.");
        }
    };

    const filteredOrders = data.orders.filter(o => o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredStudents = data.students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#1a365d]">Carregando Painel Master...</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#111827] text-gray-300 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl tracking-wide">ACNP Admin</h2>
                    <span className="text-xs text-[#e53e3e] font-bold uppercase">Master Panel</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('metrics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'metrics' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><BarChart2 size={20} /> Dashboard</button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Package size={20} /> Pedidos</button>
                    <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'students' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Users size={20} /> Alunos</button>
                    <button onClick={() => setActiveTab('coupons')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'coupons' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Tag size={20} /> Cupons</button>
                    <button onClick={() => setActiveTab('email')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'email' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Mail size={20} /> Mensagens</button>
                    <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Shield size={20} /> Segurança</button>
                    <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}><Activity size={20} /> Auditoria</button>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-4"><LogOut size={16} /> Sair</button>
                </div>
            </aside>

            {/* CONTEÚDO */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* --- ABA 1: MÉTRICAS (DASHBOARD NASA ATUALIZADO) --- */}
                {activeTab === 'metrics' && (
                    <div className="space-y-8 animate-fade-in">
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
                                <p className="text-gray-500 text-sm mt-1">Visão geral do desempenho da escola.</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Sistema Operante</span>
                            </div>
                        </header>

                        {/* KPIS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Faturamento Total" value={formatCurrency(metrics.kpis.revenue)} icon={DollarSign} color="bg-green-500" subtext="+ Crescimento contínuo" />
                            <StatCard title="Alunos Ativos" value={metrics.kpis.students} icon={Users} color="bg-blue-500" subtext="Matrículas ativas" />
                            <StatCard title="Pedidos Pendentes" value={metrics.kpis.pending} icon={Clock} color="bg-orange-500" subtext="Aguardando ação" />
                            <StatCard title="Ticket Médio" value={formatCurrency(metrics.kpis.ticket)} icon={ShoppingBag} color="bg-purple-500" subtext={`Conv: ${metrics.kpis.conversion}%`} />
                        </div>

                        {/* GRÁFICOS */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* GRÁFICO DE ÁREA (FATURAMENTO) */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-[#1a365d]" /> Evolução de Faturamento</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={metrics.charts.sales}>
                                            <defs>
                                                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1a365d" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#1a365d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="vendas" stroke="#1a365d" fillOpacity={1} fill="url(#colorVendas)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* GRÁFICO DE DONUT (STATUS) */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-700 mb-6">Status dos Pedidos</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={metrics.charts.status} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {metrics.charts.status.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* LISTA DE ÚLTIMAS VENDAS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-700">Últimas Transações Confirmadas</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                    <tr><th className="p-4">Data</th><th className="p-4">Cliente</th><th className="p-4 text-right">Valor</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {metrics.recent.map((sale, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-600">{formatDate(sale.createdAt)}</td>
                                            <td className="p-4 font-bold text-gray-800">{sale.user?.name}</td>
                                            <td className="p-4 text-right font-mono text-green-600 font-bold">{formatCurrency(sale.total)}</td>
                                        </tr>
                                    ))}
                                    {metrics.recent.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-gray-400">Nenhuma venda recente.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ABA 2: PEDIDOS --- */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in">
                        <header className="flex justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
                            <input type="text" placeholder="Buscar..." className="p-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </header>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b"><tr><th className="p-4">Data</th><th className="p-4">Cliente</th><th className="p-4">Status</th><th className="p-4">Envio</th><th className="p-4 text-right">Ação</th></tr></thead>
                                <tbody>
                                    {filteredOrders.map(o => (
                                        <tr key={o.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-sm">{formatDate(o.createdAt)}</td>
                                            <td className="p-4">{o.user?.name}<br /><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{translateStatus(o.status)}</span></td>
                                            <td className="p-4 text-xs text-gray-600">{o.shipment ? <span><span className="font-bold">{o.shipment.carrier}</span><br />{o.shipment.trackingCode}</span> : '-'}</td>
                                            <td className="p-4 text-right">
                                                {o.status === 'PENDING' && <button onClick={() => handleApprovePayment(o.user.email)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Liberar</button>}
                                                {o.status === 'PAID' && <button onClick={() => { setSelectedItem(o); setModalType('TRACKING'); setTrackingData({ code: o.shipment?.trackingCode || '', carrier: ['Correios', 'Jadlog', 'Azul Cargo', 'Motoboy', 'Retirada'].includes(o.shipment?.carrier) ? o.shipment?.carrier : 'Outra', customCarrier: o.shipment?.carrier || '', url: o.shipment?.trackingUrl || '' }); }} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">Envio</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ABA 3: ALUNOS --- */}
                {activeTab === 'students' && (
                    <div className="animate-fade-in">
                        <header className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Alunos</h1>
                            <div className="flex gap-4">
                                <button onClick={() => setModalType('NEW_USER')} className="bg-[#1a365d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"><UserPlus size={16} /> Novo Aluno</button>
                                <input type="text" placeholder="Buscar..." className="p-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </header>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b"><tr><th className="p-4">Aluno</th><th className="p-4">Responsável</th><th className="p-4">Matrícula</th><th className="p-4 text-right">Ações</th></tr></thead>
                                <tbody>
                                    {filteredStudents.map(s => (
                                        <tr key={s.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-bold">{s.name}</td>
                                            <td className="p-4">{s.user?.name}<br /><span className="text-xs text-gray-500">{s.user?.email}</span></td>
                                            <td className="p-4"><span className="bg-blue-50 text-[#1a365d] px-2 py-1 rounded font-mono text-xs">{s.enrollments?.[0]?.code || '-'}</span></td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleImpersonate(s)} className="text-gray-500 bg-gray-50 p-2 rounded hover:bg-gray-200" title="Ver como Aluno"><Eye size={16} /></button>
                                                <button onClick={() => { setSelectedItem(s.user); setUserData({ name: s.user?.name, email: s.user?.email, phone: s.user?.phone || '' }); setModalType('EDIT_USER'); }} className="text-blue-600 bg-blue-50 p-2 rounded hover:bg-blue-100" title="Editar"><Edit size={16} /></button>
                                                <button onClick={() => { setSelectedItem(s.user); setModalType('CHANGE_PASSWORD'); }} className="text-yellow-600 bg-yellow-50 p-2 rounded hover:bg-yellow-100" title="Senha"><Key size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ABA 4: CUPONS --- */}
                {activeTab === 'coupons' && (
                    <div className="animate-fade-in">
                        <header className="flex justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Cupons de Desconto</h1>
                            <button onClick={() => setModalType('NEW_COUPON')} className="bg-[#1a365d] text-white px-4 py-2 rounded-lg flex items-center gap-2"><Tag size={16} /> Criar Cupom</button>
                        </header>
                        <div className="grid gap-4 md:grid-cols-3">
                            {coupons.map(c => (
                                <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="text-2xl font-bold text-[#e53e3e]">{c.code}</h3>
                                    <p className="text-gray-600">{c.discount}% de Desconto</p>
                                    <p className="text-xs text-gray-400 mt-2">{c.active ? 'Ativo' : 'Inativo'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- ABA 5: SEGURANÇA --- */}
                {activeTab === 'security' && (
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Acesso</h1>
                        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-6">
                            <h3 className="font-bold text-yellow-800 flex items-center gap-2"><Shield size={20} /> Área Restrita (Master)</h3>
                            <p className="text-sm text-yellow-700 mt-2">Adicione novos administradores para ajudar na gestão. Eles terão acesso a tudo, exceto criar novos admins.</p>
                            <button onClick={() => setModalType('NEW_ADMIN')} className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Adicionar Novo Admin</button>
                        </div>
                    </div>
                )}

                {/* --- ABA 6: E-MAIL --- */}
                {activeTab === 'email' && (
                    <div className="animate-fade-in max-w-2xl">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Comunicar com Alunos</h1>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Assunto do E-mail</label>
                            <input type="text" className="w-full p-3 border rounded-xl mb-4" placeholder="Ex: Novidades no Curso!" value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} />

                            <label className="block text-sm font-bold text-gray-600 mb-2">Mensagem</label>
                            <textarea rows="6" className="w-full p-3 border rounded-xl mb-4" placeholder="Escreva sua mensagem..." value={emailData.message} onChange={e => setEmailData({ ...emailData, message: e.target.value })}></textarea>

                            <button onClick={() => setModalType('CONFIRM_EMAIL')} className="w-full bg-[#1a365d] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Send size={18} /> Enviar para Todos</button>
                        </div>
                    </div>
                )}

                {/* --- ABA 7: AUDITORIA --- */}
                {activeTab === 'logs' && (
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Logs do Sistema</h1>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <ul className="space-y-4">
                                {logs.map(log => (
                                    <li key={log.id} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-[#1a365d]">{log.action}</span>
                                            <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.details}</p>
                                        <p className="text-xs text-gray-400 mt-1">Admin: {log.admin?.name || 'Sistema'}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

            </main>

            {/* --- MODAIS GERAIS --- */}
            {modalType && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>

                        {/* 1. RASTREIO */}
                        {modalType === 'TRACKING' && (
                            <form onSubmit={handleUpdateTracking} className="space-y-4">
                                <h3 className="font-bold text-lg">Atualizar Envio</h3>
                                <input type="text" placeholder="Código" className="w-full p-3 border rounded-xl uppercase" value={trackingData.code} onChange={e => setTrackingData({ ...trackingData, code: e.target.value })} />
                                <select className="w-full p-3 border rounded-xl bg-white" value={trackingData.carrier} onChange={e => setTrackingData({ ...trackingData, carrier: e.target.value })}>
                                    <option value="Correios">Correios</option><option value="Jadlog">Jadlog</option><option value="Azul Cargo">Azul Cargo</option><option value="Motoboy">Motoboy</option><option value="Retirada">Retirada</option><option value="Outra">Outra</option>
                                </select>
                                {trackingData.carrier === 'Outra' && <input type="text" placeholder="Nome da Transportadora" className="w-full p-3 border rounded-xl" value={trackingData.customCarrier} onChange={e => setTrackingData({ ...trackingData, customCarrier: e.target.value })} />}
                                <button className="w-full bg-[#1a365d] text-white py-3 rounded-xl font-bold">Salvar</button>
                            </form>
                        )}

                        {/* 2. NOVO ALUNO */}
                        {modalType === 'NEW_USER' && (
                            <form onSubmit={handleCreateUser} className="space-y-3">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><UserPlus className="text-[#1a365d]" /> Cadastrar Aluno Manual</h3>
                                <input type="text" placeholder="Nome Responsável" className="w-full p-3 border rounded-xl" value={newStudentData.parentName} onChange={e => setNewStudentData({ ...newStudentData, parentName: e.target.value })} />
                                <input type="email" placeholder="E-mail" className="w-full p-3 border rounded-xl" value={newStudentData.email} onChange={e => setNewStudentData({ ...newStudentData, email: e.target.value })} />
                                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 mt-2">Salvar Cadastro</button>
                            </form>
                        )}

                        {/* 3. NOVO CUPOM */}
                        {modalType === 'NEW_COUPON' && (
                            <form onSubmit={handleCreateCoupon} className="space-y-4">
                                <h3 className="font-bold text-lg">Novo Cupom</h3>
                                <input type="text" placeholder="CÓDIGO (ex: ALUNO10)" className="w-full p-3 border rounded-xl uppercase" onChange={e => setCouponData({ ...couponData, code: e.target.value })} />
                                <input type="number" placeholder="% Desconto (ex: 10)" className="w-full p-3 border rounded-xl" onChange={e => setCouponData({ ...couponData, discount: e.target.value })} />
                                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Criar Cupom</button>
                            </form>
                        )}

                        {/* 4. NOVO ADMIN */}
                        {modalType === 'NEW_ADMIN' && (
                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <h3 className="font-bold text-lg">Novo Administrador</h3>
                                <input type="text" placeholder="Nome" className="w-full p-3 border rounded-xl" onChange={e => setNewAdminData({ ...newAdminData, name: e.target.value })} />
                                <input type="email" placeholder="E-mail" className="w-full p-3 border rounded-xl" onChange={e => setNewAdminData({ ...newAdminData, email: e.target.value })} />
                                <input type="password" placeholder="Senha" className="w-full p-3 border rounded-xl" onChange={e => setNewAdminData({ ...newAdminData, password: e.target.value })} />
                                <button className="w-full bg-yellow-600 text-white py-3 rounded-xl font-bold">Criar Acesso</button>
                            </form>
                        )}

                        {/* 5. CONFIRMAR EMAIL */}
                        {modalType === 'CONFIRM_EMAIL' && (
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-2">Confirmar Envio?</h3>
                                <p className="text-sm text-gray-600 mb-4">Isso enviará um e-mail para TODOS os alunos cadastrados.</p>
                                <button onClick={handleSendMassEmail} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Sim, Enviar Agora</button>
                            </div>
                        )}

                        {/* 6. EDITAR USUÁRIO */}
                        {modalType === 'EDIT_USER' && (
                            <form onSubmit={() => { alert('Funcionalidade visual.'); setModalType(null); }} className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Edit className="text-blue-600" /> Editar Dados</h3>
                                <p className="text-xs text-gray-500 mb-4">Editando: {selectedItem?.name}</p>
                                <div><label className="block text-sm font-bold text-gray-600 mb-1">Nome Completo</label><input type="text" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} className="w-full p-3 border rounded-xl" /></div>
                                <div><label className="block text-sm font-bold text-gray-600 mb-1">E-mail</label><input type="email" value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })} className="w-full p-3 border rounded-xl" /></div>
                                <div><label className="block text-sm font-bold text-gray-600 mb-1">Telefone</label><input type="text" value={userData.phone} onChange={e => setUserData({ ...userData, phone: e.target.value })} className="w-full p-3 border rounded-xl" /></div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 mt-4">Salvar Alterações</button>
                            </form>
                        )}

                        {/* 7. TROCAR SENHA */}
                        {modalType === 'CHANGE_PASSWORD' && (
                            <form onSubmit={() => { alert('Funcionalidade visual.'); setModalType(null); }} className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Key className="text-yellow-600" /> Trocar Senha</h3>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 mb-2"><AlertCircle size={14} className="inline mr-1" /> Cuidado: O usuário será desconectado e precisará usar esta nova senha.</div>
                                <div><label className="block text-sm font-bold text-gray-600 mb-1">Nova Senha</label><input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Digite a nova senha..." /></div>
                                <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl hover:bg-yellow-700 mt-4">Confirmar Troca</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}