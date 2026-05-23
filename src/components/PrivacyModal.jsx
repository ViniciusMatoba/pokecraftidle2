import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const PrivacyModal = ({ onClose, initialTab = 'privacy' }) => {
  const [tab, setTab] = useState(initialTab);
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector('button');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose?.(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        style={{ maxHeight: '90dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 id="privacy-modal-title" className="text-white font-black uppercase italic tracking-tighter text-lg leading-none">
            {tab === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 text-white font-black flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
          {[
            { id: 'privacy', label: 'Privacidade' },
            { id: 'terms', label: 'Termos de Uso' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                tab === t.id
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto flex-1 px-6 py-5 text-slate-700 text-[12px] leading-relaxed space-y-4">
          {tab === 'privacy' ? (
            <>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Última atualização: maio de 2026</p>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">1. Dados Coletados</h3>
                <p>Coletamos apenas seu <strong>endereço de e-mail</strong> e a <strong>senha (armazenada de forma criptografada)</strong> para autenticação via Firebase Authentication. Não coletamos nome real, CPF, telefone ou qualquer outro dado pessoal sensível.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">2. Dados do Jogo</h3>
                <p>Seu progresso de jogo (pokémons capturados, insígnias, moedas, configurações) é salvo em nosso banco de dados (Firebase Firestore) vinculado ao seu e-mail. Dados públicos como nome do treinador e pontuação podem aparecer em rankings globais.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">3. Uso dos Dados</h3>
                <p>Seus dados são usados exclusivamente para:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Identificar e autenticar sua conta</li>
                  <li>Salvar e restaurar seu progresso</li>
                  <li>Exibir rankings públicos do jogo</li>
                </ul>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">4. Compartilhamento</h3>
                <p>Seus dados <strong>não são vendidos, alugados ou compartilhados</strong> com terceiros para fins comerciais. Utilizamos apenas os serviços do Google Firebase como infraestrutura.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">5. Seus Direitos (LGPD)</h3>
                <p>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li><strong>Acesso:</strong> consultar quais dados temos sobre você</li>
                  <li><strong>Correção:</strong> atualizar seu e-mail via configurações</li>
                  <li><strong>Exclusão:</strong> apagar completamente sua conta e todos os dados através do menu Configurações → Excluir Conta</li>
                  <li><strong>Portabilidade:</strong> solicitar seus dados via e-mail de contato</li>
                </ul>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">6. Retenção de Dados</h3>
                <p>Seus dados ficam armazenados enquanto sua conta estiver ativa. Ao excluir a conta, todos os dados são removidos permanentemente em até 30 dias.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">7. Contato</h3>
                <p>Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo repositório oficial do projeto no GitHub.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">8. Alterações</h3>
                <p>Esta política pode ser atualizada. Mudanças relevantes serão comunicadas na tela de login.</p>
              </section>
            </>
          ) : (
            <>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Última atualização: maio de 2026</p>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">1. Aceitação</h3>
                <p>Ao criar uma conta e jogar PokéCraft Idle, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">2. Conta do Usuário</h3>
                <p>Você é responsável por manter a confidencialidade da sua senha e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">3. Uso Aceitável</h3>
                <p>É <strong>proibido</strong>:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Usar bots, scripts ou qualquer automação externa</li>
                  <li>Manipular dados do jogo por meios não autorizados</li>
                  <li>Criar múltiplas contas para explorar o sistema de ranking</li>
                  <li>Realizar qualquer ação que prejudique outros jogadores</li>
                  <li>Tentar acessar dados de outros usuários</li>
                </ul>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">4. Propriedade Intelectual</h3>
                <p>PokéCraft Idle é um projeto <strong>fan-made sem fins lucrativos</strong>. Pokémon e personagens relacionados são propriedade da Nintendo / Game Freak / The Pokémon Company. Este projeto não possui afiliação oficial com essas empresas.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">5. Disponibilidade</h3>
                <p>O jogo é fornecido "como está", gratuitamente. Não garantimos disponibilidade ininterrupta. Podemos modificar ou encerrar o serviço a qualquer momento sem aviso prévio.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">6. Limitação de Responsabilidade</h3>
                <p>Não nos responsabilizamos por perda de progresso decorrente de falhas técnicas, manutenção ou encerramento do serviço. Recomendamos salvar o jogo regularmente.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">7. Suspensão de Conta</h3>
                <p>Contas que violem estes termos poderão ser suspensas ou encerradas sem aviso prévio.</p>
              </section>

              <section>
                <h3 className="font-black text-slate-900 uppercase text-[11px] mb-1">8. Legislação Aplicável</h3>
                <p>Estes termos são regidos pelas leis brasileiras, em especial o Código de Defesa do Consumidor e a LGPD (Lei 13.709/2018).</p>
              </section>
            </>
          )}
        </div>

        <div className="px-6 pb-6 pt-3 shrink-0 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-700 transition-all"
          >
            Entendi e Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrivacyModal;
