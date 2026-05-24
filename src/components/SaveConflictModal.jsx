import React from 'react';

const fmt = (ts) => {
  if (!ts) return 'Desconhecido';
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const SaveCard = ({ label, save, savedAt, color, onChoose }) => {
  const badges = (save?.badges || []).length;
  const caught = Object.keys(save?.caughtData || {}).length;
  const trainer = save?.trainer?.name || 'Treinador';
  const region = save?.activeRegion || 'kanto';
  const pc = (save?.pc || []).length;
  const team = (save?.team || []).length;

  return (
    <div
      className={`flex-1 rounded-xl border-2 ${color} bg-gray-900/80 p-4 flex flex-col gap-3 cursor-pointer hover:brightness-110 transition-all`}
      onClick={onChoose}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</div>
      <div className="text-lg font-bold text-white">{trainer}</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Salvo em</span>
          <span className="text-yellow-300 font-mono text-xs">{fmt(savedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Insígnias</span>
          <span className="text-white font-bold">{badges}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Pokémon capturados</span>
          <span className="text-white font-bold">{caught}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Time / PC</span>
          <span className="text-white font-bold">{team} / {pc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Região</span>
          <span className="text-white font-bold capitalize">{region}</span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onChoose(); }}
        className={`mt-auto w-full py-2 rounded-lg font-bold text-sm text-white border ${color} hover:brightness-125 transition-all`}
      >
        Usar este save
      </button>
    </div>
  );
};

export default function SaveConflictModal({ cloudSave, cloudSavedAt, localSave, localSavedAt, onChoose }) {
  const diffMin = Math.round(Math.abs(localSavedAt - cloudSavedAt) / 60_000);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-950 rounded-2xl border border-yellow-500/40 shadow-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-2xl mb-1">⚠️ Conflito de Save</div>
          <p className="text-gray-300 text-sm">
            Encontramos dois saves diferentes para sua conta.
            <br />
            <span className="text-yellow-400 font-semibold">
              Diferença de {diffMin >= 60 ? `${Math.floor(diffMin / 60)}h ${diffMin % 60}min` : `${diffMin} minutos`}.
            </span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            O save não escolhido será perdido. Escolha com cuidado.
          </p>
        </div>

        {/* Cards */}
        <div className="flex gap-3">
          <SaveCard
            label="💾 Nuvem (outro dispositivo)"
            save={cloudSave}
            savedAt={cloudSavedAt}
            color="border-blue-500/60"
            onChoose={() => onChoose('cloud')}
          />
          <SaveCard
            label="📱 Este dispositivo (local)"
            save={localSave}
            savedAt={localSavedAt}
            color="border-green-500/60"
            onChoose={() => onChoose('local')}
          />
        </div>

        <p className="text-center text-gray-600 text-xs">
          Após escolher, o save selecionado será sincronizado com a nuvem automaticamente.
        </p>
      </div>
    </div>
  );
}
