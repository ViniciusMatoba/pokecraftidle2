import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence, getAuth } from 'firebase/auth';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('poke_remember_me') === 'true';
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pré-preenche e-mail salvo se lembrar login ativo
  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem('poke_saved_email') || '';
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = getAuth();
      // Aplica persistência baseada no checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }

      // Salva preferência de lembrar login
      localStorage.setItem('poke_remember_me', rememberMe ? 'true' : 'false');
      if (rememberMe) {
        localStorage.setItem('poke_saved_email', email);
      } else {
        localStorage.removeItem('poke_saved_email');
      }

      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      const msgs = {
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/email-already-in-use': 'E-mail já cadastrado.',
        'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
        'auth/invalid-credential': 'Credenciais inválidas. Verifique e-mail e senha.',
      };
      setError(msgs[err.code] || 'Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0F2D3A] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full border-[60px] border-white/5 absolute -top-32 -right-32" />
        <div className="w-[300px] h-[300px] rounded-full border-[40px] border-white/5 absolute -bottom-20 -left-20" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border-b-8 border-[#1DB954] relative z-10">
        {/* Header */}
        <div className="bg-[#0F2D3A] rounded-t-[2rem] px-8 pt-8 pb-6 flex flex-col items-center text-center">
          <h1 
            className="text-4xl font-black italic uppercase tracking-tighter drop-shadow-md text-[#FFCB05]"
            style={{ WebkitTextStroke: '2px #CC0000' }}
          >
            POKÉCRAFT <span className="text-white" style={{ WebkitTextStroke: '0px' }}>IDLE</span>
          </h1>
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" 
            className="w-24 h-24 mt-2 animate-float-slow drop-shadow-xl" 
            alt="Snorlax" 
          />
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">
            {isLogin ? 'Bem-vindo de volta, Treinador!' : 'Inicie sua jornada Pokémon!'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1DB954] outline-none transition-all font-medium text-slate-800"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Senha com toggle */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha</label>
              <div className="relative mt-1">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1DB954] outline-none transition-all font-medium text-slate-800"
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors text-xl select-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Toggle Lembrar login */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-all duration-300 ${rememberMe ? 'bg-[#1DB954]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${rememberMe ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-wide">
                Lembrar meu login
              </span>
            </label>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-center">
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wide">{error}</p>
              </div>
            )}

            {/* Botão Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2D3A] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-[#1DB954] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Conectando...
                </>
              ) : (
                isLogin ? '⚡ Entrar no Jogo' : '🌟 Criar Conta Mestra'
              )}
            </button>
          </form>

          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="w-full mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1DB954] transition-colors py-2"
          >
            {isLogin ? 'Não tem conta? Cadastre-se grátis →' : '← Já possui conta? Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
