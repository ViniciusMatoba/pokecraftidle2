import React from 'react';

// Modal reutilizável para substituir window.confirm e window.alert
// Uso:
// <ConfirmModal
//   type="confirm"         → mostra Cancelar + Confirmar
//   type="alert"           → mostra só OK
//   type="danger"          → confirmar em vermelho (ações destrutivas)
//   title="Título"
//   message="Mensagem"
//   confirmLabel="Sim"     → opcional, padrão "Confirmar"
//   cancelLabel="Não"      → opcional, padrão "Cancelar"
//   onConfirm={() => {}}
//   onCancel={() => {}}    → opcional para type="alert"
// />

const ICONS = {
  confirm: '❓',
  alert:   'ℹ️',
  danger:  '⚠️',
  success: '✅',
  error:   '❌',
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
  const icon         = ICONS[type] || ICONS.confirm;
  const isDanger     = type === 'danger';
  const isAlert      = type === 'alert';
  const confirmColor = isDanger
    ? 'bg-red-600 hover:bg-red-500 text-white'
    : 'bg-blue-600 hover:bg-blue-500 text-white';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-slideInUp">

        {/* Ícone */}
        <div className={`pt-8 pb-4 flex flex-col items-center gap-3 ${isDanger ? 'bg-red-50' : 'bg-slate-50'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
            isDanger ? 'bg-red-100' : isAlert ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            {icon}
          </div>
          {title && (
            <h3 className={`font-black text-base uppercase italic text-center px-6 ${
              isDanger ? 'text-red-800' : 'text-slate-800'
            }`}>
              {title}
            </h3>
          )}
        </div>

        {/* Mensagem */}
        {message && (
          <div className="px-6 py-4">
            <p className="text-slate-600 text-sm text-center leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {/* Botões */}
        <div className={`px-6 pb-6 flex gap-3 ${isAlert ? 'justify-center' : ''}`}>
          {!isAlert && (
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-200 transition-all active:scale-95"
            >
              {cancelLabel || 'Cancelar'}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 rounded-2xl font-black uppercase text-sm shadow-lg transition-all active:scale-95 ${confirmColor}`}
          >
            {confirmLabel || (isAlert ? 'OK' : 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
