import React from 'react';

const META = {
  confirm: {
    title: 'Confirmacao',
    subtitle: 'Revise sua acao',
    color: '#2563eb',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png',
  },
  alert: {
    title: 'Aviso',
    subtitle: 'Informacao importante',
    color: '#2563eb',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png',
  },
  danger: {
    title: 'Atencao',
    subtitle: 'Acao delicada',
    color: '#dc2626',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/red-card.png',
  },
  success: {
    title: 'Sucesso',
    subtitle: 'Tudo certo',
    color: '#16a34a',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png',
  },
  error: {
    title: 'Erro',
    subtitle: 'Algo precisa de atencao',
    color: '#dc2626',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png',
  },
};

const ConfirmModal = ({
  type = 'confirm',
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const isDanger = type === 'danger';
  const isAlert = type === 'alert';
  const meta = META[type] || META.confirm;
  const closeAction = onCancel || onConfirm;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="modal-panel-mobile bg-white overflow-hidden shadow-2xl animate-slideInUp flex flex-col border-b-[8px] border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between gap-3 shrink-0" style={{ background: meta.color }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <img src={meta.icon} className="w-9 h-9 object-contain" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{meta.subtitle}</p>
              <h3 className="text-white text-lg font-black uppercase italic leading-tight truncate">
                {title || meta.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeAction}
            className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
            aria-label="Fechar"
          >
            x
          </button>
        </div>

        {message && (
          <div className="modal-scroll-content p-5">
            <p className="text-slate-600 text-sm text-center leading-relaxed font-bold">{message}</p>
          </div>
        )}

        <div className="px-5 pt-3 pb-6 border-t border-slate-100 flex gap-3 shrink-0">
          {!isAlert && (
            <button
              onClick={onCancel}
              className="flex-1 min-h-[52px] rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase"
            >
              {cancelLabel || 'Cancelar'}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 min-h-[52px] rounded-2xl text-white font-black text-sm uppercase shadow-lg ${
              isDanger ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'
            }`}
          >
            {confirmLabel || (isAlert ? 'OK' : 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
