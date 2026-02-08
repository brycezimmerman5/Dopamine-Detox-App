import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  ctaText: string;
  ctaTo?: string;
  compact?: boolean;
}

export function EmptyState({ icon = '📊', title, message, ctaText, ctaTo = '/urge', compact }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-6' : 'py-8'}`}>
      <span className={`${compact ? 'text-3xl' : 'text-4xl'} mb-3`}>{icon}</span>
      <p className="font-semibold text-gray-50 mb-1">{title}</p>
      <p className="text-gray-400 text-sm mb-4 max-w-xs">{message}</p>
      <Link
        to={ctaTo}
        className="bg-app-accent hover:opacity-90 text-gray-900 font-semibold px-6 py-2.5 rounded-xl transition"
      >
        {ctaText}
      </Link>
    </div>
  );
}
