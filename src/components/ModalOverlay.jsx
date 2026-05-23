/**
 * ModalOverlay — UX-02
 * Wrapper acessível para todos os modais do PokéCraft Idle 2.
 *
 * Fornece automaticamente:
 * - role="dialog" + aria-modal="true" no painel interno
 * - aria-labelledby apontando para o título (passe labelId)
 * - Focus trap (Tab / Shift+Tab) mantém foco dentro do modal
 * - Fecha com Escape e clique no backdrop (quando onClose for passado)
 * - Foco automático no primeiro elemento focável ao abrir
 *
 * Uso:
 *   <ModalOverlay labelId="meu-titulo" onClose={fechar} zIndex="9999">
 *     <div role="dialog" ...> ... <h2 id="meu-titulo">Título</h2> ... </div>
 *   </ModalOverlay>
 */
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ModalOverlay({
  children,
  onClose,
  labelId,
  backdropClass = 'bg-black/60 backdrop-blur-sm',
  zIndex = '9999',
  animate = true,
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Foco no primeiro elemento focável ao abrir
    const focusable = panel.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusable[0];
    firstEl?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose?.(); return; }
      if (e.key !== 'Tab') return;

      const els = Array.from(panel.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);
      if (!els.length) return;

      const first = els[0];
      const last  = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const content = (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 ${backdropClass} ${animate ? 'animate-fadeIn' : ''}`}
      style={{ zIndex }}
      onClick={closeOnBackdrop ? (e) => { if (e.target === e.currentTarget) onClose?.(); } : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
