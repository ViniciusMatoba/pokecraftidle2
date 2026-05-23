import React from 'react';
import { CHANGELOG, APP_VERSION, APP_VERSION_DATE } from '../constants/version';

export default function ChangelogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-[2.5rem] bg-[#0F2D3A] border-4 border-[#FFD700] shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[85vh] text-left"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 shrink-0 flex justify-between items-center bg-black/20">
          <div>
            <p className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.25em] leading-none">POKÉCRAFT IDLE 2</p>
            <h2 className="text-xl font-black text-white uppercase italic mt-1.5">📜 Histórico de Atualizações</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center font-black text-sm active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Corpo do Histórico */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-white/90">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0">
            <p className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">Versão Atual</p>
            <p className="text-xl font-black italic mt-1">v{APP_VERSION}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Lançamento: {APP_VERSION_DATE}</p>
          </div>

          <div className="flex flex-col gap-6">
            {CHANGELOG.map((line, idx) => {
              if (line.startsWith('## ')) {
                // Título de Versão
                const versionTitle = line.substring(3).trim();
                return (
                  <div key={idx} className="border-b border-white/10 pb-2 mt-2 shrink-0">
                    <h3 className="text-base font-black text-[#FFD700] uppercase italic tracking-wide">
                      {versionTitle}
                    </h3>
                  </div>
                );
              }
              if (line.startsWith('### ')) {
                // Subtítulo de Categoria
                const categoryTitle = line.substring(4).trim();
                return (
                  <h4 key={idx} className="text-xs font-black text-white/90 uppercase tracking-widest leading-none mt-2 shrink-0">
                    {categoryTitle}
                  </h4>
                );
              }
              if (line.startsWith('- ')) {
                // Item de marcador
                const itemText = line.substring(2).trim();
                // Destacar partes em negrito markdown
                const parts = itemText.split('**');
                return (
                  <div key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                    <span className="text-[#FFD700] shrink-0">•</span>
                    <p>
                      {parts.map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-extrabold">{part}</strong> : part
                      )}
                    </p>
                  </div>
                );
              }
              // Linha vazia ou parágrafo comum
              return null;
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 shrink-0 bg-black/20 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#FFD700] hover:bg-[#FFE866] text-[#0F2D3A] font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-[#FFD700]/10 border-none"
          >
            Fechar Histórico
          </button>
        </div>
      </div>
    </div>
  );
}
