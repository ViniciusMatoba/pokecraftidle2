import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence, getAuth } from 'firebase/auth';
import { APP_VERSION, APP_VERSION_DATE } from '../data/constants';

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
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
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
        'auth/weak-password': 'Senha fraca (mín. 6 caracteres).',
        'auth/invalid-credential': 'Credenciais inválidas.',
      };
      setError(msgs[err.code] || 'Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a237e 0%, #0F2D3A 60%, #1a3a2a 100%)' }}
    >
      {/* Pokébolas decorativas de fundo */}
      <div className="pointer-events-none select-none">
        {/* grande - topo direito */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          className="absolute -top-8 -right-8 w-40 h-40 opacity-10 animate-spin-slow"
          alt=""
          style={{ filter: 'grayscale(1) brightness(2)' }}
        />
        {/* grande - baixo esquerdo */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 animate-float-slow"
          alt=""
          style={{ filter: 'grayscale(1) brightness(2)' }}
        />
        {/* pequena - topo esquerdo */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
          className="absolute top-12 left-4 w-10 h-10 opacity-20 animate-float-delayed"
          alt=""
        />
        {/* pequena - baixo direito */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png"
          className="absolute bottom-16 right-6 w-10 h-10 opacity-20 animate-float"
          alt=""
        />
      </div>

      {/* Card central - branco limpo, sem borda colorida */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden">

        {/* Banner topo - vermelho como a Pokédex */}
        <div
          className="px-8 pt-8 pb-6 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(180deg, #CC0000 0%, #ff1a1a 100%)' }}
        >
          {/* Título POKÉCRAFT IDLE — amarelo com contorno vermelho-escuro */}
          <h1
            className="text-4xl font-black italic uppercase tracking-tighter drop-shadow-lg"
            style={{
              color: '#FFCB05',
              WebkitTextStroke: '2px #7a0000',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            POKÉCRAFT IDLE
          </h1>

          {/* Snorlax flutuando */}
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png"
            className="w-28 h-28 mt-3 animate-float-slow drop-shadow-xl"
            style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
            alt="Snorlax"
          />

          {/* Subtítulo */}
          <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            {isLogin ? '✦ Bem-vindo de volta, Treinador! ✦' : '✦ Inicie sua Jornada Pokémon! ✦'}
          </p>
        </div>

        {/* Divider decorativo */}
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #FFCB05, #ffdf5e, #FFCB05)' }} />

        {/* Formulário */}
        <div className="px-8 py-6 space-y-4 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* E-mail */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all font-medium text-slate-800"
                style={{ '--tw-ring-color': '#CC0000' }}
                onFocus={e => e.target.style.borderColor = '#CC0000'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Senha + toggle mostrar */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all font-medium text-slate-800"
                  onFocus={e => e.target.style.borderColor = '#CC0000'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
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

            {/* Toggle — Lembrar login */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div
                  className="w-10 h-6 rounded-full transition-all duration-300"
                  style={{ background: rememberMe ? '#CC0000' : '#e2e8f0' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                    style={{ left: rememberMe ? '1.5rem' : '0.25rem' }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-700 transition-colors">
                Lembrar meu login
              </span>
            </label>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-center">
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wide">⚠️ {error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 border-b-4"
              style={{ background: '#CC0000', borderColor: '#7a0000' }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#aa0000'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#CC0000'; }}
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
            className="w-full mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 transition-colors"
            onMouseEnter={e => e.target.style.color = '#CC0000'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            {isLogin ? 'Não tem conta? Cadastre-se grátis →' : '← Já possui conta? Faça Login'}
          </button>

          <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center">
            PokéCraft Idle v{APP_VERSION} • {APP_VERSION_DATE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
