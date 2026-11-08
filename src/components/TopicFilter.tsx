import type { CommunityTopic } from '../types/index.ts';
import { TOPIC_LIST } from '../utils/topics.ts';

interface TopicFilterProps {
  activeTopic: CommunityTopic | null;
  onSelectTopic: (topic: CommunityTopic | null) => void;
}

export function TopicFilter({ activeTopic, onSelectTopic }: TopicFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <button
        onClick={() => onSelectTopic(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
          activeTopic === null
            ? 'bg-secondary text-white border-secondary'
            : 'border-gray-200 text-gray-500 hover:border-gray-400'
        }`}
      >
        Todas
      </button>
      {TOPIC_LIST.map(([key, meta]) => (
        <button
          key={key}
          onClick={() => onSelectTopic(activeTopic === key ? null : key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            activeTopic === key
              ? `${meta.badgeCls} border-transparent`
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          <span>{meta.emoji}</span>
          {meta.label}
        </button>
      ))}
    </div>
  );
}
