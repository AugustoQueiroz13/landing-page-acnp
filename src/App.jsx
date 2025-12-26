import React from 'react';
// AQUI ESTAVA O ERRO: Importamos do jeito certo agora
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação das Páginas
import LandingPage from './LandingPage';
import Login from './Login';
import Dashboard from './Dashboard';
import ConfirmationPage from './ConfirmationPage';
import AdminDashboard from './AdminDashboard';
import ValidarCertificado from './ValidarCertificado';

export default function App() {
    return (
        // O basename garante que o site entenda que roda em /educacional
        <BrowserRouter basename="/educacional">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/confirmacao" element={<ConfirmationPage />} />
                {/* <Route path="/validar" element={<ValidarCertificado />} /> */}

                {/* Rota para pegar qualquer link errado e voltar para o inicio */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    );
}