import React, { useState } from 'react';
import { loginUser, registerUser } from '../auth'; // Importe as funções que criamos

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
      // O monitorAuthState no App.jsx detectará o login automaticamente
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      setError('Erro: Verifique suas credenciais ou conexão.');
    }
  };

  return (
    <div className="w-full h-full bg-[#0F2D3A] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border-b-8 border-[#1DB954] relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 
            className="text-4xl font-black italic uppercase tracking-tighter drop-shadow-md text-[#FFCB05]"
            style={{ WebkitTextStroke: '2px #CC0000' }}
          >
            POKÉCRAFT <span className="text-slate-800" style={{ WebkitTextStroke: '0px' }}>IDLE</span>
          </h1>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" className="w-24 h-24 mt-2 animate-float-slow drop-shadow-xl" alt="Snorlax" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1DB954] outline-none transition-all font-medium"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1DB954] outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[#0F2D3A] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            {isLogin ? 'Entrar no Jogo' : 'Criar Conta Mestra'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1DB954]"
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já possui conta? Faça Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
