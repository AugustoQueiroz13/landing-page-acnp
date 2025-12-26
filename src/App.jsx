import React from 'react';
// CORREÇÃO 1: Importamos direto o BrowserRouter sem mudar o nome
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação das Páginas
import LandingPage from './LandingPage';
import Login from './Login';
import Dashboard from './Dashboard';
import ValidarCertificado from './ValidarCertificado';
import ConfirmationPage from './ConfirmationPage';
import AdminDashboard from './AdminDashboard';

export default function App() {
    return (
        // CORREÇÃO 2: Removemos o <Router> externo duplicado.
        // Mantemos apenas ESTE BrowserRouter com o basename correto.
        <BrowserRouter basename="/educacional">
            <Routes>
                {/* Rota Raiz: Mostra o Site de Vendas */}
                <Route path="/" element={<LandingPage />} />

                {/* Rota para Validar Codigo do Certificado */}
                <Route path="/validar" element={<ValidarCertificado />} />

                {/* Rota de Login */}
                <Route path="/login" element={<Login />} />

                {/* Rota do Aluno (Protegida) */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Rota de Confirmação de Matrícula (Pós-Formulário) */}
                <Route path="/confirmacao" element={<ConfirmationPage />} />

                {/* Rota Admin */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Rota Curinga: Se digitar algo errado, volta pra Home */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    );
}