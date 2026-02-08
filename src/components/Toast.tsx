import { useToastStore } from '../store/toastStore';

export function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-app-surface border border-app-surfaceHover text-gray-50 px-4 py-3 rounded-xl shadow-lg flex justify-between items-center"
        >
          <span className="text-sm">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-300 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
