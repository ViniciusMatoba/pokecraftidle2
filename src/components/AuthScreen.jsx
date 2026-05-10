import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence, getAuth } from 'firebase/auth';
import { APP_VERSION, APP_VERSION_DATE } from '../data/constants';
import RankingModal from './RankingModal';
import { checkRemoteVersion, forceAppRefresh } from '../utils/appUpdate';

const AuthScreen = ({ onAuthSuccess, installPrompt, handleInstallPWA, isIOS, isStandalone }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('poke_remember_me') === 'true';
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('idle'); // 'idle', 'checking', 'updated'
  const [showRanking, setShowRanking] = useState(false);

  const handleCheckUpdate = async () => {
    setUpdateStatus('checking');
    try {
      const data = await checkRemoteVersion();
      
      if ('serviceWorker' in navigator) {
        // Timeout de 3s para o SW ready, para nao travar o botao se o SW falhar
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout SW')), 3000))
        ]).catch(() => null);

        if (registration) {
          await registration.update();
        }
      }

      if (data.version !== APP_VERSION) {
        if (window.confirm(`Nova versao disponivel (${data.version})! Deseja atualizar agora?`)) {
          await forceAppRefresh({ reason: 'login-version-check' });
        }
      } else {
        setUpdateStatus('updated');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Update check failed:', err);
      setUpdateStatus('idle');
    }
  };

  // Pre-preenche e-mail salvo se lembrar login ativo
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
        'auth/invalid-email': 'E-mail invalido.',
        'auth/user-not-found': 'Usuario nao encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/email-already-in-use': 'E-mail ja cadastrado.',
        'auth/weak-password': 'Senha fraca (min. 6 caracteres).',
        'auth/invalid-credential': 'Credenciais invalidas.',
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
      {/* Pokebolas decorativas de fundo */}
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

        {/* Banner topo - vermelho como a Pokedex */}
        <div
          className="px-8 pt-8 pb-6 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(180deg, #CC0000 0%, #ff1a1a 100%)' }}
        >
          {/* Titulo POKECRAFT IDLE */}
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
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-pokeBlue/10 rounded-[2rem] flex items-center justify-center mb-4 shadow-inner border border-pokeBlue/5">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-12 h-12 animate-bounce" alt="Logo" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
              {isLogin ? 'Bem-vindo' : 'Novo Treinador'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              {isLogin ? 'Acesse sua conta mestra' : 'Comece sua jornada Pokemon'}
            </p>
          </div>
        </div>

        {/* Divider decorativo */}
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #FFCB05, #ffdf5e, #FFCB05)' }} />

        {/* Formulario */}
        <div className="px-8 py-6 space-y-4 bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            {/* Campo E-mail */}
            <div className="mb-2">
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
            <div className="mb-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all font-medium text-slate-800"
                  onFocus={e => e.target.style.borderColor = '#CC0000'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  placeholder="Senha"
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
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {showPassword ? (
                      <>
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a3 3 0 004.2 4.2" />
                        <path d="M9.9 5.3A10.5 10.5 0 0112 5c6.5 0 10 7 10 7a16.1 16.1 0 01-3.1 4.3" />
                        <path d="M6.1 6.7A16.2 16.2 0 002 12s3.5 7 10 7c1 0 1.9-.1 2.8-.4" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Toggle   Lembrar login */}
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
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wide">! {error}</p>
              </div>
            )}

            {/* Botao de login */}
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
                isLogin ? (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d="M13 2L4 14h7l-1 8 10-13h-7l1-7Z" />
                    </svg>
                    Entrar no Jogo
                  </>
                ) : (
                  <>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-4 h-4" alt="" />
                    Criar Conta Mestra
                  </>
                )
              )}
            </button>
          </form>

          {/* Botao de Verificacao de Versao */}
          <button
            onClick={handleCheckUpdate}
            disabled={updateStatus === 'checking'}
            className="w-full mt-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-2 shadow-md border-b-2"
            style={{ 
              background: updateStatus === 'updated' 
                ? 'linear-gradient(135deg, #166534 0%, #15803d 100%)' 
                : 'linear-gradient(135deg, #0f172a 0%, #166534 100%)',
              borderColor: updateStatus === 'updated' ? '#064e3b' : '#020617',
              color: 'white'
            }}
          >
            {updateStatus === 'checking' ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verificando...
              </>
            ) : updateStatus === 'updated' ? (
              <>
                <span className="w-4 h-4 rounded-full bg-emerald-300 text-emerald-950 flex items-center justify-center text-[9px] font-black">OK</span>
                Versao Atualizada!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 01-15.4 6.4L3 16" />
                  <path d="M3 16h6v6" />
                  <path d="M3 12a9 9 0 0115.4-6.4L21 8" />
                  <path d="M21 8h-6V2" />
                </svg>
                Verificar Atualizacoes
              </>
            )}
          </button>

          {/* Botao de Instalacao PWA */}
          {!isStandalone && (
            <button
              onClick={handleInstallPWA}
              className={`w-full mt-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg border-b-4 border-amber-700 ${installPrompt || isIOS ? 'animate-bounce' : ''}`}
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {isIOS ? 'Como Instalar (iOS)' : (installPrompt ? 'Instalar Aplicativo (PWA)' : 'Como instalar o app')}
            </button>
          )}

          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="w-full mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 transition-colors"
            onMouseEnter={e => e.target.style.color = '#CC0000'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            {isLogin ? 'Nao tem conta? Cadastre-se gratis ->' : '<- Ja possui conta? Faca Login'}
          </button>

          <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center">
            PokéCraft Idle v{APP_VERSION} - {APP_VERSION_DATE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
