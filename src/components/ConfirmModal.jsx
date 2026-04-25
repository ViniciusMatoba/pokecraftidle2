{/* ⛔ PROTECTED: ConfirmModal — NÃO ALTERAR ESPAÇAMENTOS E BOTÕES SEM AUTORIZAÇÃO */}
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

        {/* Ícone — mais espaço */}
        <div className={`pt-10 pb-6 flex flex-col items-center gap-4 ${isDanger ? 'bg-red-50' : 'bg-slate-50'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
            isDanger ? 'bg-red-100' : isAlert ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            {icon}
          </div>
          {title && (
            <h3 className={`font-black text-lg uppercase italic text-center px-6 ${
              isDanger ? 'text-red-800' : 'text-slate-800'
            }`}>
              {title}
            </h3>
          )}
        </div>

        {/* Mensagem */}
        {message && (
          <div style={{padding: '20px 24px 24px 24px'}}>
            <p style={{color:'#475569', fontSize:'14px', textAlign:'center', lineHeight:'1.6'}}>
              {message}
            </p>
          </div>
        )}

        {/* Botões — com margem das bordas */}
        <div style={{
          padding: '0 20px 28px 20px',
          display: 'flex',
          gap: '12px',
          justifyContent: isAlert ? 'center' : 'stretch'
        }}>
          {!isAlert && (
            <button
              onClick={onCancel}
              style={{flex:1, padding:'16px 8px', borderRadius:'16px', fontWeight:900, fontSize:'14px', textTransform:'uppercase', background:'#f1f5f9', color:'#475569', border:'none', cursor:'pointer'}}
            >
              {cancelLabel || 'Cancelar'}
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{flex:1, padding:'16px 8px', borderRadius:'16px', fontWeight:900, fontSize:'14px', textTransform:'uppercase', background: isDanger ? '#dc2626' : '#2563eb', color:'white', border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}
          >
            {confirmLabel || (isAlert ? 'OK' : 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
