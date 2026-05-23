import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { APP_VERSION } from '../constants/version';
import NotificationSystem, { notify } from './NotificationSystem';

export default function BugReportModal({ isOpen, onClose, gameState, currentView, user }) {
  const [category, setCategory] = useState('combat');
  const [description, setDescription] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const diagnostics = {
    userAgent: navigator.userAgent,
    currentView: currentView || 'unknown',
    currentRoute: gameState?.currentRoute || 'unknown',
    teamCount: gameState?.team?.length || 0,
    pcCount: gameState?.pc?.length || 0,
    currency: gameState?.currency || 0,
    playTimeMs: gameState?.playerStats?.playTimeMs || 0,
    badges: (gameState?.badges || []).length,
    version: APP_VERSION || 'unknown',
    isSaveTampered: window.isSaveTampered || false,
    timestamp: Date.now()
  };

  const categories = [
    { id: 'combat', name: '⚔️ Combate e Batalhas' },
    { id: 'save', name: '💾 Salvamento e Contas' },
    { id: 'travel', name: '🗺️ Viagem e Requisitos' },
    { id: 'interface', name: '📱 Interface e Layout' },
    { id: 'visual', name: '🎨 Erro Visual / Textos' },
    { id: 'other', name: '📦 Outros Problemas' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      notify('Por favor, descreva o problema antes de enviar!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        uid: user?.uid || 'anonimo',
        email: user?.email || 'anonimo',
        category,
        description,
        timestamp: serverTimestamp(),
        diagnostics: includeDiagnostics ? diagnostics : { version: APP_VERSION }
      };

      await addDoc(collection(db, 'bugReports'), reportData);
      setSubmitted(true);
      notify('✅ Relatório enviado com sucesso! Obrigado pelo apoio.', 'success');
    } catch (err) {
      console.error('Falha ao enviar relatório de bug:', err);
      notify('⚠️ Erro ao enviar relatório. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-[2.5rem] bg-white border-4 border-red-500 shadow-2xl overflow-hidden animate-slideUp relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {/* Barra superior de design */}
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shrink-0" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0 flex justify-between items-center bg-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">BETA TESTING</p>
            <h2 className="text-xl font-black text-slate-800 uppercase italic mt-1">🐛 Reportar Bug / Sugestão</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black text-sm active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
              <span className="text-6xl mb-4">🎉</span>
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Muito Obrigado!</h3>
              <p className="text-sm text-slate-500 font-bold mt-2 max-w-xs">
                Seu relatório foi registrado na nossa base de desenvolvimento. Sua colaboração é vital para blindar o PokéCraft!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDescription('');
                  onClose();
                }}
                className="mt-6 px-8 py-3.5 rounded-2xl bg-slate-800 text-white font-black uppercase text-xs tracking-widest shadow-lg hover:bg-slate-700 active:scale-95 transition-all border-b-4 border-slate-950"
              >
                Fechar Painel
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Categoria do Problema
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-2xl border-2 text-left text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                        category === cat.id
                          ? 'bg-red-500 border-red-600 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  O que aconteceu? (Descrição do erro)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Por favor, descreva detalhadamente o problema ou sugestão. O que você estava fazendo quando o erro ocorreu?"
                  rows={4}
                  required
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:border-red-400 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDiagnostics}
                    onChange={e => setIncludeDiagnostics(e.target.checked)}
                    className="w-4 h-4 rounded text-red-500 focus:ring-red-400 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600 select-none">
                    Anexar dados de diagnóstico automático
                  </span>
                </label>
                {includeDiagnostics && (
                  <div className="text-[9px] font-mono text-slate-400 bg-white p-2 rounded-xl border border-slate-100 max-h-24 overflow-y-auto leading-normal">
                    <strong>Versão:</strong> {diagnostics.version}<br />
                    <strong>Tela/Rota:</strong> {diagnostics.currentView} / {diagnostics.currentRoute}<br />
                    <strong>Navegador:</strong> {diagnostics.userAgent.substring(0, 70)}...<br />
                    <strong>Time/PC:</strong> {diagnostics.teamCount} / {diagnostics.pcCount} pokes<br />
                    <strong>Integridade:</strong> {diagnostics.isSaveTampered ? '⚠️ VIOLADA' : '✅ VÁLIDA'}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-black uppercase text-xs tracking-widest shadow-lg hover:from-red-600 hover:to-orange-600 active:scale-95 transition-all border-b-4 border-red-700 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    '🚀 Enviar Relatório'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
