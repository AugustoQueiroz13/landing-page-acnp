import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import {
    LayoutDashboard, Package, Users, LogOut,
    Truck, CheckCircle, Search, Edit, X, Save,
    ExternalLink, AlertCircle
} from 'lucide-react';

const translateStatus = (status) => {
    const map = {
        'PENDING': 'Pendente',
        'PAID': 'Pago',
        'PREPARING': 'Em Preparação',
        'SHIPPED': 'Enviado',
        'DELIVERED': 'Entregue',
        'CANCELED': 'Cancelado'
    };
    return map[status] || status;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [data, setData] = useState({ orders: [], students: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal de Rastreio
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingData, setTrackingData] = useState({ code: '', carrier: 'Correios', url: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            const res = await fetch(`${API_URL}/api/admin/dashboard-data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                alert("Acesso negado. Área restrita a administradores.");
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTracking = async (e) => {
        e.preventDefault();
        if (!selectedOrder) return;

        const token = localStorage.getItem('token');

        // Gera link automático se for Correios e não tiver link manual
        let finalUrl = trackingData.url;
        if (!finalUrl && trackingData.carrier === 'Correios' && trackingData.code) {
            finalUrl = `https://rastreamento.correios.com.br/app/index.php?objetos=${trackingData.code}`;
        }

        try {
            const res = await fetch(`${API_URL}/api/admin/atualizar-rastreio`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    orderId: selectedOrder.id,
                    trackingCode: trackingData.code,
                    carrier: trackingData.carrier,
                    trackingUrl: finalUrl
                })
            });

            if (res.ok) {
                alert("Rastreio atualizado com sucesso!");
                setSelectedOrder(null);
                fetchData(); // Recarrega a lista
            } else {
                alert("Erro ao atualizar.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    };

    const handleSimulatePayment = async (email) => {
        if (!window.confirm(`Tem certeza que deseja simular o pagamento para ${email}? (Apenas para Testes)`)) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/simular-pagamento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const json = await res.json();
            if (json.success) {
                alert(json.message);
                fetchData();
            } else {
                alert("Erro: " + json.error);
            }
        } catch (error) {
            alert("Erro ao simular.");
        }
    };

    const filteredOrders = data.orders.filter(o =>
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudents = data.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">Carregando Painel Admin...</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex">

            {/* SIDEBAR ADMIN */}
            <aside className="w-64 bg-[#111827] text-gray-300 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl tracking-wide">ACNP Admin</h2>
                    <span className="text-xs text-gray-500 uppercase">Painel Master</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}>
                        <Package size={20} /> Pedidos e Envios
                    </button>
                    <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'students' ? 'bg-[#e53e3e] text-white' : 'hover:bg-gray-800'}`}>
                        <Users size={20} /> Alunos e Notas
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-4">
                        <LogOut size={16} /> Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {activeTab === 'orders' ? 'Gestão de Pedidos' : 'Gestão de Alunos'}
                    </h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou ID..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-[#e53e3e] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </header>

                {/* TABELA DE PEDIDOS */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID / Data</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status Pagto</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status Envio</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <p className="font-mono text-xs text-gray-500">{order.id.substring(0, 8)}...</p>
                                            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-800">{order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {translateStatus(order.status)}
                                            </span>
                                            {order.status === 'PENDING' && (
                                                <button onClick={() => handleSimulatePayment(order.user.email)} className="block mt-1 text-[10px] text-blue-600 hover:underline">
                                                    Simular Pagto (Teste)
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {order.shipment ? (
                                                <div>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.shipment.status === 'SHIPPED' || order.shipment.status === 'DELIVERED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {translateStatus(order.shipment.status)}
                                                    </span>
                                                    {order.shipment.trackingCode && <p className="text-xs font-mono mt-1 text-gray-500">{order.shipment.trackingCode}</p>}
                                                </div>
                                            ) : <span className="text-xs text-gray-400">-</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            {order.status === 'PAID' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setTrackingData({
                                                            code: order.shipment?.trackingCode || '',
                                                            carrier: order.shipment?.carrier || 'Correios',
                                                            url: order.shipment?.trackingUrl || ''
                                                        });
                                                    }}
                                                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition"
                                                    title="Atualizar Envio"
                                                >
                                                    <Truck size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TABELA DE ALUNOS */}
                {activeTab === 'students' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Aluno</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Responsável</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Matrícula</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Progresso / Nota</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Certificado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map(student => {
                                    const enrollment = student.enrollments[0];
                                    const bestAttempt = enrollment?.examAttempts?.find(a => a.passed);
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-gray-800">{student.name}</td>
                                            <td className="p-4">
                                                <p className="text-sm text-gray-600">{student.user?.name}</p>
                                                <p className="text-xs text-gray-400">{student.user?.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-mono text-xs text-[#1a365d] bg-blue-50 px-2 py-1 rounded inline-block">{enrollment?.code || '-'}</p>
                                                <p className="text-xs text-gray-400 mt-1">{translateStatus(enrollment?.status)}</p>
                                            </td>
                                            <td className="p-4">
                                                {bestAttempt ? (
                                                    <span className="text-green-600 font-bold text-sm">Aprovado (Nota: {bestAttempt.score})</span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Em andamento</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {enrollment?.certificate ? (
                                                    <a href={`${API_URL}/api/certificado/${student.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                                        <CheckCircle size={14} /> Baixar PDF
                                                    </a>
                                                ) : <span className="text-gray-300 text-xs">Pendente</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>

            {/* MODAL DE ATUALIZAÇÃO DE RASTREIO */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Atualizar Envio</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleUpdateTracking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Código de Rastreio</label>
                                <input
                                    type="text"
                                    value={trackingData.code}
                                    onChange={e => setTrackingData({ ...trackingData, code: e.target.value })}
                                    className="w-full p-3 border rounded-xl font-mono text-lg uppercase"
                                    placeholder="Ex: AA123456789BR"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Transportadora</label>
                                <select
                                    value={trackingData.carrier}
                                    onChange={e => setTrackingData({ ...trackingData, carrier: e.target.value })}
                                    className="w-full p-3 border rounded-xl bg-white"
                                >
                                    <option value="Correios">Correios</option>
                                    <option value="Jadlog">Jadlog</option>
                                    <option value="Azul Cargo">Azul Cargo</option>
                                    <option value="Motoboy">Motoboy (Local)</option>
                                    <option value="Retirada">Retirada na Escola</option>
                                </select>
                            </div>

                            {/* Campo de URL Manual (Opcional) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Link de Rastreio (Opcional)</label>
                                <input
                                    type="url"
                                    value={trackingData.url}
                                    onChange={e => setTrackingData({ ...trackingData, url: e.target.value })}
                                    className="w-full p-3 border rounded-xl text-sm"
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-gray-400 mt-1">Se vazio, gera automático para Correios.</p>
                            </div>

                            <button type="submit" className="w-full bg-[#1a365d] text-white font-bold py-3 rounded-xl hover:bg-blue-900 flex items-center justify-center gap-2 mt-4">
                                <Save size={18} /> Salvar e Notificar Cliente
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}