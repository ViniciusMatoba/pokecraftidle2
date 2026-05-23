import { Component } from 'react';
import { trackEvent } from '../firebase';

/**
 * ErrorBoundary — captura erros não tratados em qualquer componente filho.
 * Exibe uma UI amigável em vez de tela branca. Rastreia o crash no Analytics.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Crash capturado:', error, info);
    trackEvent('app_crash', {
      error_message: error?.message?.slice(0, 100) || 'unknown',
      component_stack: info?.componentStack?.slice(0, 200) || '',
    });
  }

  handleReload() {
    // Tenta preservar o save local antes de recarregar
    try {
      const saved = localStorage.getItem('poke_idle_save');
      if (saved) localStorage.setItem('poke_idle_save_crash_backup', saved);
    } catch { /* sem-op */ }
    window.location.reload();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900 p-6">
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border-b-8 border-red-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 px-6 pt-8 pb-6 text-center">
            <div className="text-5xl mb-3">😵</div>
            <h1 className="text-white font-black text-xl tracking-tight">Algo deu errado</h1>
            <p className="text-red-200 text-xs mt-1 font-medium">O jogo encontrou um erro inesperado</p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detalhes do erro</p>
              <p className="text-xs text-slate-600 font-mono break-words leading-relaxed">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200 flex items-start gap-3">
              <span className="text-green-600 text-lg flex-shrink-0">✅</span>
              <p className="text-xs text-green-700 font-bold leading-relaxed">
                Seu progresso está seguro. O save local foi preservado automaticamente.
              </p>
            </div>

            <button
              onClick={() => this.handleReload()}
              className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-200"
            >
              🔄 Recarregar o Jogo
            </button>

            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all"
            >
              Tentar continuar
            </button>

            <p className="text-[9px] text-slate-400 text-center font-bold leading-relaxed">
              Se o problema persistir, exporte seu backup em Menu → Configurações → Backup do Save
              e entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
