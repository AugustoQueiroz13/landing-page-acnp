import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Recupera os dados passados pela LandingPage (link de pagamento e nome)
    const { paymentUrl, nome } = location.state || {};

    // Proteção: Se o usuário tentar acessar direto pela URL sem comprar, volta pra home
    if (!paymentUrl) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#1a365d] mb-4">Acesso Inválido</h1>
                    <p className="text-gray-600 mb-6">Você precisa preencher o formulário de matrícula primeiro.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 mx-auto text-[#e53e3e] font-bold hover:underline"
                    >
                        <ArrowLeft size={20} /> Voltar para o início
                    </button>
                </div>
            </div>
        );
    }

    // Pega apenas o primeiro nome para personalizar
    const primeiroNome = nome ? nome.split(' ')[0] : 'Visitante';

    return (
        <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 font-sans text-gray-800">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Cabeçalho Azul */}
                <div className="bg-[#1a365d] p-8 text-center relative overflow-hidden">
                    {/* Efeito de fundo sutil */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px]"></div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 border-4 border-[#1a365d]"
                    >
                        <CheckCircle size={40} className="text-white" />
                    </motion.div>

                    <h1 className="text-2xl font-extrabold text-white relative z-10">Pedido Recebido!</h1>
                    <p className="text-blue-200 mt-2 relative z-10 font-medium">Tudo certo com sua matrícula, {primeiroNome}.</p>
                </div>

                {/* Corpo da Página */}
                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                            Seus dados já estão seguros em nosso sistema e estamos processando sua matrícula.<br />
                            Para liberar o envio do Kit e o acesso ao Curso, <strong>finalize o pagamento abaixo:</strong>
                        </p>

                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#e53e3e] text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-red-600 hover:shadow-red-200 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Ir para Pagamento Seguro <ExternalLink size={20} />
                        </motion.a>

                        <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1 uppercase font-bold tracking-wide">
                            <ShieldCheck size={14} /> Processado via Asaas
                        </p>
                    </div>

                    {/* Card de Informação */}
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                        <h3 className="font-bold text-[#1a365d] mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Mail size={16} /> Próximos Passos
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-200 text-[#1a365d] w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                                <span>Você também recebeu este link no seu e-mail.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-200 text-[#1a365d] w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                                <span>Pagamento aprovado = Acesso liberado na hora.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-200 text-[#1a365d] w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                                <span>O código de rastreio do Kit chega no seu e-mail e também consegue acompanhar pelo seu painel.</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-8 w-full text-center text-gray-400 font-bold text-xs hover:text-[#1a365d] transition-colors"
                    >
                        Voltar para a página inicial
                    </button>
                </div>
            </motion.div>
        </div>
    );
}