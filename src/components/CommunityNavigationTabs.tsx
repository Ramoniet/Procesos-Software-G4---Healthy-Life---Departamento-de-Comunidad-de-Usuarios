export type CommunityTab = 'posts' | 'members' | 'challenges';

interface CommunityNavigationTabsProps {
  activeTab: CommunityTab;
  onSelectTab: (tab: CommunityTab) => void;
  postsCount: number;
  membersCount: number;
  challengesCount: number;
}

export function CommunityNavigationTabs({
  activeTab,
  onSelectTab,
  postsCount,
  membersCount,
  challengesCount,
}: CommunityNavigationTabsProps) {
  return (
    <div className="flex border-b border-gray-200 gap-2 sm:gap-6">
      <button
        onClick={() => onSelectTab('posts')}
        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
          activeTab === 'posts'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-secondary'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        Publicaciones
        <span
          className={`rounded-full text-xs px-2 py-0.5 font-medium ${
            activeTab === 'posts'
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {postsCount}
        </span>
      </button>

      <button
        onClick={() => onSelectTab('members')}
        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
          activeTab === 'members'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-secondary'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Miembros
        <span
          className={`rounded-full text-xs px-2 py-0.5 font-medium ${
            activeTab === 'members'
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {membersCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('challenges')}
        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
          activeTab === 'challenges'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-secondary'
        }`}
      >
        <span aria-hidden="true">🏆</span>
        Retos
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            activeTab === 'challenges'
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {challengesCount}
        </span>
      </button>
    </div>
  );
}
