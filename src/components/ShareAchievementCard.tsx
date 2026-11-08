interface ShareAchievementCardProps {
  userName: string;
  onClick: () => void;
}

export function ShareAchievementCard({ userName, onClick }: ShareAchievementCardProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-white border border-gray-200 hover:border-primary/40 rounded-xl p-4 shadow-sm cursor-pointer transition-all group"
    >
      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 bg-gray-100 group-hover:bg-gray-200/70 rounded-lg px-4 py-2.5 text-sm text-gray-500 transition-colors">
        Comparte un logro con la comunidad…
      </div>
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg group-hover:bg-primary/85 transition-colors cursor-pointer"
      >
        Publicar logro
      </button>
    </div>
  );
}
