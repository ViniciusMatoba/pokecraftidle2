import React from 'react';

/**
 * DecisionModal
 * 
 * Um modal premium para resoluçao de conflitos e decisoes pos-nocaute.
 * Design alinhado com o sistema de orquestraçao do AppRoot.
 */
const DecisionModal = ({ 
  title = "Decisao Necessaria",
  subtitle = "Escolha sua açao",
  options = [], // { id, label, icon, color, onClick, desc }
  onClose,
  showClose = false
}) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="modal-panel-mobile bg-white overflow-hidden shadow-2xl animate-slideInUp flex flex-col border-b-[8px] border-slate-200 w-full max-w-sm">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png" 
                className="w-8 h-8 object-contain" 
                alt="Icon" 
              />
            </div>
            <div className="min-w-0">
              <p className="text-pokeBlue text-[10px] font-black uppercase tracking-[0.2em] mb-1">{subtitle}</p>
              <h3 className="text-white text-xl font-black uppercase italic leading-tight truncate">
                {title}
              </h3>
            </div>
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 text-white font-black flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
            >
              x
            </button>
          )}
        </div>

        {/* Content - Options List */}
        <div className="modal-scroll-content p-6 flex flex-col gap-3 bg-slate-50">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={opt.onClick}
              className="group relative flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border-2 border-slate-100 hover:border-pokeBlue hover:shadow-xl hover:shadow-blue-900/5 transition-all active:scale-[0.97] text-left overflow-hidden"
            >
              {/* Option Icon */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform"
                style={{ backgroundColor: opt.color || '#3b82f6' }}
              >
                {opt.icon && (
                   <img src={opt.icon} className="w-8 h-8 object-contain brightness-0 invert" alt="" />
                )}
              </div>

              {/* Option Text */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-black uppercase italic tracking-tight text-sm group-hover:text-pokeBlue transition-colors">
                  {opt.label}
                </p>
                {opt.desc && (
                  <p className="text-slate-400 text-[10px] font-bold mt-0.5 leading-tight uppercase tracking-widest opacity-70">
                    {opt.desc}
                  </p>
                )}
              </div>

              {/* Arrow Indicator */}
              <div className="text-slate-200 group-hover:text-pokeBlue transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer (Decorative) */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center">
          <div className="flex gap-1">
             {[1,2,3].map(i => (
               <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
