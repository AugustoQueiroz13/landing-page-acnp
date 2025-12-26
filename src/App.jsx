import React from 'react';
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
        <BrowserRouter basename="/educacional">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/confirmacao" element={<ConfirmationPage />} />
                <Route path="/validar" element={<ValidarCertificado />} />

                <Route path="*" element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    );
}