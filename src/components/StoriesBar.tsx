import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const UPLOAD_URL = "https://functions.poehali.dev/aed84985-58a0-42a9-9a86-68ed185d1b8f";

const MOCK_STORIES = [
  { id: 1, user: "alex_v", name: "Алекс", viewed: false },
  { id: 2, user: "masha_k", name: "Маша", viewed: false },
  { id: 3, user: "dima_pro", name: "Дима", viewed: true },
  { id: 4, user: "kate_life", name: "Катя", viewed: false },
  { id: 5, user: "ivan_g", name: "Иван", viewed: true },
  { id: 6, user: "yana_art", name: "Яна", viewed: false },
];

const STORY_COLORS = [
  "from-pink-500 via-purple-500 to-cyan-400",
  "from-orange-400 via-pink-500 to-purple-600",
  "from-cyan-400 via-blue-500 to-purple-600",
  "from-purple-500 via-pink-500 to-orange-400",
];

interface StoryItem {
  id: number;
  name: string;
  viewed: boolean;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  isOwn?: boolean;
}

interface StoriesBarProps {
  currentUser: { name: string; username: string };
}

export default function StoriesBar({ currentUser }: StoriesBarProps) {
  const [stories, setStories] = useState<StoryItem[]>(MOCK_STORIES);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);
  const [myStory, setMyStory] = useState<StoryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const openStory = (story: StoryItem) => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setActiveStory(story);
    setProgress(0);
    progressTimer.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer.current!);
          setActiveStory(null);
          return 0;
        }
        return p + 2;
      });
    }, 80);
  };

  const closeStory = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setActiveStory(null);
    setProgress(0);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setShowAddOptions(false);

    const reader = new FileReader();
    reader.onload = async ev => {
      const base64 = ev.target?.result as string;
      let mediaUrl = base64;

      try {
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, type: file.type, folder: "stories" }),
        });
        const data = await res.json();
        if (data.url) mediaUrl = data.url;
      } catch { /* use local */ }

      const newStory: StoryItem = {
        id: 0,
        name: currentUser.name,
        viewed: false,
        mediaUrl,
        mediaType: type,
        isOwn: true,
      };
      setMyStory(newStory);
      setUploading(false);
      openStory(newStory);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const storyColorIndex = (i: number) => STORY_COLORS[i % STORY_COLORS.length];

  return (
    <>
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e, "image")} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => handleFileSelect(e, "video")} />

      <div className="flex gap-3 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {/* My story / add button */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            {myStory ? (
              <button
                onClick={() => openStory(myStory)}
                className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-br ${storyColorIndex(0)}`}
              >
                <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                  {myStory.mediaType === "video" ? (
                    <video src={myStory.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={myStory.mediaUrl} alt="my story" className="w-full h-full object-cover" />
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowAddOptions(true)}
                disabled={uploading}
                className="w-16 h-16 rounded-full glass-strong flex items-center justify-center hover-scale disabled:opacity-60"
              >
                <div className="w-14 h-14 rounded-full grad-btn flex items-center justify-center">
                  {uploading ? (
                    <Icon name="Loader" size={20} className="text-white animate-spin" />
                  ) : (
                    <span className="text-white font-bold text-xl">{currentUser.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </button>
            )}
            <button
              onClick={() => setShowAddOptions(true)}
              className="absolute bottom-0 right-0 w-5 h-5 grad-btn rounded-full flex items-center justify-center border-2 border-background hover-scale"
            >
              <Icon name="Plus" size={10} className="text-white" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground text-center w-16 truncate">
            {uploading ? "Загрузка..." : "Добавить"}
          </span>
        </div>

        {/* Friends stories */}
        {stories.map((story, i) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
            onClick={() => openStory(story)}
          >
            <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? "bg-muted" : `bg-gradient-to-br ${storyColorIndex(i)}`}`}>
              <div className="w-full h-full rounded-full glass-strong flex items-center justify-center border-2 border-background">
                <span className="text-white font-bold text-lg">{story.name.charAt(0)}</span>
              </div>
            </div>
            <span className="text-xs text-white/80 text-center w-16 truncate">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Add story options */}
      {showAddOptions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowAddOptions(false)}>
          <div className="w-full max-w-lg glass-strong rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
            <h3 className="text-white font-bold text-xl mb-5">Добавить историю</h3>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAddOptions(false); photoRef.current?.click(); }}
                className="flex-1 glass rounded-2xl p-5 flex flex-col items-center gap-2 hover-scale border border-border hover:border-vibe-pink transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl grad-btn flex items-center justify-center">
                  <Icon name="Camera" size={26} className="text-white" />
                </div>
                <span className="text-white font-semibold">Фото</span>
              </button>
              <button
                onClick={() => { setShowAddOptions(false); videoRef.current?.click(); }}
                className="flex-1 glass rounded-2xl p-5 flex flex-col items-center gap-2 hover-scale border border-border hover:border-vibe-cyan transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl" style={{ background: "linear-gradient(135deg, #4cc9f0, #7209b7)" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Video" size={26} className="text-white" />
                  </div>
                </div>
                <span className="text-white font-semibold">Видео</span>
              </button>
            </div>
            <button onClick={() => setShowAddOptions(false)} className="w-full mt-4 text-muted-foreground text-sm py-2">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Story viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in" onClick={closeStory}>
          <div
            className="relative w-full max-w-sm h-[88vh] rounded-2xl overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Background / media */}
            {activeStory.mediaUrl ? (
              activeStory.mediaType === "video" ? (
                <video src={activeStory.mediaUrl} className="absolute inset-0 w-full h-full object-cover" autoPlay loop playsInline muted />
              ) : (
                <img src={activeStory.mediaUrl} alt="story" className="absolute inset-0 w-full h-full object-cover" />
              )
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${storyColorIndex(stories.findIndex(s => s.id === activeStory.id))}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-display text-white text-5xl text-center px-8 opacity-80">Живи ярко! ✨</p>
                </div>
              </div>
            )}

            {/* Dim overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />

            {/* Progress */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10 m-2 rounded-full">
              <div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>

            {/* Header */}
            <div className="absolute top-5 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{activeStory.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{activeStory.name}</p>
                  <p className="text-white/60 text-xs">только что</p>
                </div>
              </div>
              <button onClick={closeStory} className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Reply */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
              <input
                className="flex-1 glass rounded-full px-4 py-2.5 text-white text-sm placeholder-white/50 outline-none"
                placeholder="Ответить..."
                onClick={e => e.stopPropagation()}
              />
              <button className="w-10 h-10 grad-btn rounded-full flex items-center justify-center hover-scale">
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
