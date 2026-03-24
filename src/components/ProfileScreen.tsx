import { useState } from "react";
import Icon from "@/components/ui/icon";
import SettingsScreen from "./SettingsScreen";

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
  onLogout?: () => void;
}

export default function ProfileScreen({ currentUser, onLogout }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState("📸 Фотограф | Путешественник\n✨ Живу ярко, делюсь смело");
  const [website, setWebsite] = useState("vibe.app");
  const [usernameError, setUsernameError] = useState("");
  const [shareToast, setShareToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSave = () => {
    if (username.trim().length < 3) {
      setUsernameError("Никнейм минимум 3 символа");
      return;
    }
    setUsernameError("");
    // Update in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("vibe_user") || "{}");
      localStorage.setItem("vibe_user", JSON.stringify({ ...stored, username: username.trim().toLowerCase(), name: name.trim() }));
    } catch (_e) { /* ignore */ }
    setEditMode(false);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?user=${username}`;
    if (navigator.share) {
      navigator.share({ title: `VIBE — @${username}`, url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vibe_user");
    onLogout?.();
    window.location.reload();
  };

  if (showSettings) {
    return <SettingsScreen currentUser={{ name, username }} onBack={() => setShowSettings(false)} onLogout={handleLogout} />;
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-bold">@{username}</h2>
        <div className="flex gap-2">
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
            <Icon name="Plus" size={18} className="text-white" />
          </button>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale relative"
          >
            <Icon name="Menu" size={18} className="text-white" />
          </button>
        </div>

        {/* 3-dot dropdown menu */}
        {menuOpen && (
          <div className="absolute top-14 right-4 glass-strong rounded-2xl overflow-hidden shadow-xl z-50 min-w-44 animate-scale-in">
            {[
              { icon: "Settings", label: "Настройки", action: () => { setMenuOpen(false); setShowSettings(true); } },
              { icon: "BookMarked", label: "Архив", action: () => setMenuOpen(false) },
              { icon: "Activity", label: "Активность", action: () => setMenuOpen(false) },
              { icon: "QrCode", label: "QR-код профиля", action: () => setMenuOpen(false) },
              { icon: "LogOut", label: "Выйти", action: handleLogout, red: true },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${item.red ? "text-red-400" : "text-white"}`}
              >
                <Icon name={item.icon} size={18} className={item.red ? "text-red-400" : "text-muted-foreground"} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay to close menu */}
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Share toast */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-strong px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-scale-in shadow-xl">
          <Icon name="Check" size={16} className="text-green-400" />
          <span className="text-white text-sm font-medium">Ссылка скопирована!</span>
        </div>
      )}

      {/* Profile info */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 story-ring animate-pulse-glow">
              <div className="w-full h-full rounded-full glass-strong flex items-center justify-center m-0.5">
                <span className="text-3xl font-bold grad-text">{name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 grad-btn rounded-full flex items-center justify-center border-2 border-background hover-scale">
              <Icon name="Plus" size={10} className="text-white" />
            </button>
          </div>

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
          {editMode ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Имя"
                className="w-full glass rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-vibe-pink/50"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vibe-pink font-bold text-sm">@</span>
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, "")); setUsernameError(""); }}
                  placeholder="никнейм"
                  className="w-full glass rounded-xl pl-7 pr-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-vibe-pink/50"
                />
              </div>
              {usernameError && <p className="text-red-400 text-xs">{usernameError}</p>}
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                className="w-full glass rounded-xl px-3 py-2 text-white text-sm outline-none resize-none focus:ring-2 focus:ring-vibe-pink/50"
              />
              <input
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="Сайт"
                className="w-full glass rounded-xl px-3 py-2 text-vibe-cyan text-sm outline-none focus:ring-2 focus:ring-vibe-pink/50"
              />
            </div>
          ) : (
            <>
              <p className="text-white font-bold text-base">{name}</p>
              <p className="text-white/80 text-sm mt-1 whitespace-pre-line leading-relaxed">{bio}</p>
              <p className="text-vibe-cyan text-sm mt-1 font-medium">{website}</p>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <button onClick={handleSave} className="flex-1 grad-btn text-white font-bold py-2 rounded-xl hover-scale shadow-md shadow-vibe-pink/20 text-sm">
                Сохранить
              </button>
              <button onClick={() => { setEditMode(false); setUsernameError(""); }} className="flex-1 glass text-white font-bold py-2 rounded-xl hover-scale text-sm">
                Отмена
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="flex-1 glass text-white font-semibold py-2 rounded-xl hover-scale text-sm border border-border/50">
                Редактировать
              </button>
              <button onClick={handleShare} className="flex-1 glass text-white font-semibold py-2 rounded-xl hover-scale text-sm border border-border/50">
                Поделиться
              </button>
              <button onClick={() => setShowSettings(true)} className="w-10 h-10 glass rounded-xl flex items-center justify-center hover-scale border border-border/50">
                <Icon name="Settings" size={18} className="text-white" />
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
            className={`flex-1 py-3 flex items-center justify-center transition-all ${activeTab === tab.id ? "border-b-2 border-vibe-pink" : ""}`}
          >
            <Icon name={tab.icon} size={20} className={activeTab === tab.id ? "text-white" : "text-muted-foreground"} />
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {PROFILE_POSTS.map((post, i) => (
          <div
            key={post.id}
            className="relative cursor-pointer overflow-hidden group animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <img
              src={post.img}
              alt="post"
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id + 20}/300/300`; }}
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
