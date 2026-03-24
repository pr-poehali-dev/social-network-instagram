import { useState } from "react";
import Icon from "@/components/ui/icon";

const PROFILE_POSTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1682687220945-922198770538?w=300&q=70", likes: 847 },
  { id: 2, img: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=300&q=70", likes: 1243 },
  { id: 3, img: "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=300&q=70", likes: 2891 },
  { id: 4, img: "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=300&q=70", likes: 567 },
  { id: 5, img: "https://images.unsplash.com/photo-1682687220015-186f63b8850a?w=300&q=70", likes: 1890 },
  { id: 6, img: "https://images.unsplash.com/photo-1682687220866-c856f566f1bd?w=300&q=70", likes: 432 },
];

interface ProfileScreenProps {
  currentUser: { name: string; username: string };
}

export default function ProfileScreen({ currentUser }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("📸 Фотограф | Путешественник\n✨ Живу ярко, делюсь смело");
  const [website, setWebsite] = useState("vibe.app");

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-bold">@{currentUser.username}</h2>
        <div className="flex gap-2">
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
            <Icon name="Plus" size={18} className="text-white" />
          </button>
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
            <Icon name="Menu" size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 story-ring animate-pulse-glow">
              <div className="w-full h-full rounded-full glass-strong flex items-center justify-center m-0.5">
                <span className="text-3xl font-bold grad-text">{currentUser.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 grad-btn rounded-full flex items-center justify-center border-2 border-background">
              <Icon name="Plus" size={10} className="text-white" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-5 pt-2">
            {[
              { label: "публикаций", value: "24" },
              { label: "подписчиков", value: "1.2K" },
              { label: "подписок", value: "348" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-white text-xl font-bold leading-tight">{stat.value}</p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Name & bio */}
        <div className="mt-4">
          <p className="text-white font-bold text-base">{currentUser.name}</p>
          {editMode ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-white text-sm mt-1 outline-none resize-none focus:ring-2 focus:ring-vibe-pink/50"
              rows={2}
            />
          ) : (
            <p className="text-white/80 text-sm mt-1 whitespace-pre-line leading-relaxed">{bio}</p>
          )}
          {editMode ? (
            <input
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-vibe-cyan text-sm mt-2 outline-none focus:ring-2 focus:ring-vibe-pink/50"
            />
          ) : (
            <p className="text-vibe-cyan text-sm mt-1 font-medium">{website}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 grad-btn text-white font-bold py-2 rounded-xl hover-scale shadow-md shadow-vibe-pink/20 text-sm"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 glass text-white font-bold py-2 rounded-xl hover-scale text-sm"
              >
                Отмена
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 glass text-white font-semibold py-2 rounded-xl hover-scale text-sm border border-border/50"
              >
                Редактировать
              </button>
              <button className="flex-1 glass text-white font-semibold py-2 rounded-xl hover-scale text-sm border border-border/50">
                Поделиться
              </button>
              <button className="w-10 h-10 glass rounded-xl flex items-center justify-center hover-scale border border-border/50">
                <Icon name="UserPlus" size={18} className="text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        {[
          { id: "posts", icon: "Grid3X3" },
          { id: "saved", icon: "Bookmark" },
          { id: "tagged", icon: "Tag" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 flex items-center justify-center transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-vibe-pink"
                : "text-muted-foreground"
            }`}
          >
            <Icon name={tab.icon} size={20} className={activeTab === tab.id ? "text-white" : "text-muted-foreground"} />
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {PROFILE_POSTS.map((post, i) => (
          <div key={post.id} className="relative cursor-pointer overflow-hidden group animate-fade-in" style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}>
            <img
              src={post.img}
              alt="post"
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id + 20}/300/300`;
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-bold text-sm">
                <Icon name="Heart" size={16} className="fill-white text-white" />
                {post.likes.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
