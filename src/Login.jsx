import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, ArrowLeft, HelpCircle } from 'lucide-react';
import { API_URL } from './config';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                // Redireciona para Admin se for admin, senão Dashboard
                if (data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(data.error || "Erro ao entrar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Por favor, digite seu e-mail no campo acima primeiro.");
            return;
        }
        if (!confirm(`Deseja resetar a senha para o e-mail: ${email}?`)) return;

        setForgotLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/esqueci-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const textData = await res.text();

            try {
                const data = JSON.parse(textData);
                if (data.success) {
                    alert("Sucesso: " + data.message);
                } else {
                    alert("Erro do Sistema: " + (data.error || "Desconhecido"));
                }
            } catch (jsonError) {
                console.error("Erro não-JSON recebido:", textData);
                alert(`Erro Crítico no Servidor: Código ${res.status}`);
            }

        } catch (e) {
            console.error(e);
            alert("O servidor parece estar desligado ou inacessível.");
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#152c4e] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-gray-100"
            >
                {/* ÁREA DA LOGO E TÍTULO */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        {/* Tenta carregar a logo, se não existir, mostra um ícone genérico ou nada */}
                        <img
                            src="/logo-curso.png"
                            alt="Logo ACNP"
                            className="h-24 w-auto object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">Acesso ao Sistema</h2>
                    <p className="text-gray-500 mt-2 text-sm">Bem-vindo(a)! Insira suas credenciais.</p>
                </div>

                {/* FORMULÁRIO */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">E-mail</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1a365d] transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium text-gray-700"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Senha</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1a365d] transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium text-gray-700"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a365d] text-white font-bold py-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <span className="animate-pulse">Entrando...</span>
                        ) : (
                            <>
                                <LogIn size={20} /> Entrar
                            </>
                        )}
                    </button>
                </form>

                {/* RODAPÉ DO CARD */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 text-center">
                    <button
                        onClick={handleForgotPassword}
                        disabled={forgotLoading}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                        <HelpCircle size={16} /> {forgotLoading ? "Enviando..." : "Esqueci minha senha"}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={16} /> Voltar para o site principal
                    </button>
                </div>
            </motion.div>
        </div>
    );
}