import React, { useState } from 'react';
import { ShieldCheck, Search, XCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

export default function ValidarCertificado() {
    const [codigo, setCodigo] = useState('');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerificar = async (e) => {
        e.preventDefault();
        if (!codigo) return;

        setLoading(true);
        setResultado(null);

        try {
            const response = await fetch(`${API_URL}/api/consultar-certificado/${codigo}`);
            const data = await response.json();
            setResultado(data);
        } catch (error) {
            setResultado({ valido: false, erro: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-[#1a365d] font-bold hover:underline">
                <ArrowLeft size={20} /> Voltar ao Site
            </button>

            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-gray-100 text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a365d]">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-2xl font-extrabold text-[#1a365d] mb-2">Autenticidade de Certificado</h1>
                <p className="text-gray-500 text-sm mb-8">Digite o código impresso no certificado para verificar sua validade.</p>

                <form onSubmit={handleVerificar} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="Ex: ACNP-X7Y9-ZM4P"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e53e3e] outline-none text-center font-mono uppercase tracking-widest font-bold"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#1a365d] text-white p-3 rounded-xl hover:bg-blue-900 transition flex items-center justify-center"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search size={24} />}
                    </button>
                </form>

                {/* RESULTADO VÁLIDO */}
                {resultado && resultado.valido && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-fade-in-up">
                        <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-4">
                            <CheckCircle size={24} /> Certificado Autêntico
                        </div>
                        <div className="text-left space-y-2 text-sm text-gray-700">
                            <p><strong>Aluno:</strong> {resultado.aluno}</p>
                            <p><strong>Curso:</strong> {resultado.curso}</p>
                            <p><strong>Data de Emissão:</strong> {new Date(resultado.dataEmissao).toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs text-gray-400 mt-2 text-center">Registro Nº: {resultado.codigo}</p>
                        </div>
                    </div>
                )}

                {/* RESULTADO INVÁLIDO */}
                {resultado && !resultado.valido && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 animate-shake">
                        <div className="flex items-center justify-center gap-2 text-red-700 font-bold mb-2">
                            <XCircle size={24} /> Certificado Inválido
                        </div>
                        <p className="text-sm text-red-600">O código informado não foi encontrado em nossa base de dados oficial.</p>
                    </div>
                )}
            </div>
        </div>
    );
}