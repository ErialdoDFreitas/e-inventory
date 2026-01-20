// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/apiClient';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Rota padrão do SimpleJWT que você deve ter no Django
            const data: any = await apiClient.post('/token/', { username, password });
            login(data.access);
        } catch (err) {
            alert("Credenciais inválidas");
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '400px', margin: '100px auto' }}>
            <section>
                <h3>Login - E-Inventory</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Entrar</button>
                </form>
            </section>
        </div>
    );
};