import { useState } from "react";
import Icon from "@/components/ui/icon";

const MOCK_STORIES = [
  { id: 1, user: "alex_v", name: "Алекс", viewed: false, color: "from-vibe-pink to-vibe-orange" },
  { id: 2, user: "masha_k", name: "Маша", viewed: false, color: "from-vibe-purple to-vibe-cyan" },
  { id: 3, user: "dima_pro", name: "Дима", viewed: true, color: "from-vibe-blue to-vibe-purple" },
  { id: 4, user: "kate_life", name: "Катя", viewed: false, color: "from-vibe-cyan to-vibe-blue" },
  { id: 5, user: "ivan_g", name: "Иван", viewed: true, color: "from-vibe-orange to-vibe-pink" },
  { id: 6, user: "yana_art", name: "Яна", viewed: false, color: "from-vibe-pink to-vibe-purple" },
  { id: 7, user: "roma_s", name: "Рома", viewed: true, color: "from-vibe-purple to-vibe-pink" },
];

const STORY_COLORS = [
  "from-pink-500 via-purple-500 to-cyan-400",
  "from-orange-400 via-pink-500 to-purple-600",
  "from-cyan-400 via-blue-500 to-purple-600",
  "from-purple-500 via-pink-500 to-orange-400",
];

interface StoriesBarProps {
  currentUser: { name: string; username: string };
}

export default function StoriesBar({ currentUser }: StoriesBarProps) {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const openStory = (id: number) => {
    setActiveStory(id);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setActiveStory(null);
          return 0;
        }
        return p + 2;
      });
    }, 80);
  };

  const story = MOCK_STORIES.find(s => s.id === activeStory);

  return (
    <>
      {/* Stories list */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {/* Add story button */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center hover-scale cursor-pointer">
              <div className="w-14 h-14 rounded-full grad-btn flex items-center justify-center">
                <span className="text-white font-bold text-xl">{currentUser.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 grad-btn rounded-full flex items-center justify-center border-2 border-background">
              <Icon name="Plus" size={10} className="text-white" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground text-center w-16 truncate">Добавить</span>
        </div>

        {/* Friend stories */}
        {MOCK_STORIES.map((story, i) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
            onClick={() => openStory(story.id)}
          >
            <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? "bg-muted" : `bg-gradient-to-br ${STORY_COLORS[i % STORY_COLORS.length]}`}`}>
              <div className="w-full h-full rounded-full glass-strong flex items-center justify-center border-2 border-background">
                <span className="text-white font-bold text-lg">{story.name.charAt(0)}</span>
              </div>
            </div>
            <span className="text-xs text-white/80 text-center w-16 truncate">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Story viewer overlay */}
      {activeStory && story && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={() => setActiveStory(null)}
        >
          <div className="relative w-full max-w-sm h-[85vh] rounded-2xl overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}>
            {/* Story background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${STORY_COLORS[MOCK_STORIES.findIndex(s => s.id === activeStory) % STORY_COLORS.length]}`} />

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">{story.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{story.name}</p>
                  <p className="text-white/60 text-xs">2 мин назад</p>
                </div>
              </div>
              <button onClick={() => setActiveStory(null)} className="text-white/80 hover:text-white">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-display text-white text-5xl text-center px-8 opacity-80">
                Живи ярко! ✨
              </p>
            </div>

            {/* Reply */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
              <input
                className="flex-1 glass rounded-full px-4 py-2 text-white text-sm placeholder-white/50 outline-none"
                placeholder="Ответить..."
              />
              <button className="w-10 h-10 grad-btn rounded-full flex items-center justify-center">
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
