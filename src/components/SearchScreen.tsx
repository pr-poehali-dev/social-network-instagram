import { useState } from "react";
import Icon from "@/components/ui/icon";

const USERS = [
  { id: 1, username: "alex_v", name: "Алекс Волков", followers: "12.4K", avatar: "А", grad: "from-orange-400 to-pink-500", following: false },
  { id: 2, username: "masha_k", name: "Маша Кириллова", followers: "8.9K", avatar: "М", grad: "from-purple-500 to-cyan-400", following: true },
  { id: 3, username: "dima_pro", name: "Дима Прохоров", followers: "34.2K", avatar: "Д", grad: "from-blue-500 to-purple-500", following: false },
  { id: 4, username: "kate_life", name: "Катя Лебедева", followers: "5.7K", avatar: "К", grad: "from-cyan-400 to-blue-500", following: false },
  { id: 5, username: "ivan_g", name: "Иван Громов", followers: "21.8K", avatar: "И", grad: "from-pink-500 to-orange-400", following: true },
  { id: 6, username: "yana_art", name: "Яна Артемьева", followers: "67.1K", avatar: "Я", grad: "from-vibe-pink to-purple-600", following: false },
];

const TRENDING = ["#природа", "#городскойвайб", "#фото", "#путешествия", "#арт", "#мода", "#музыка", "#спорт"];

const EXPLORE_IMAGES = [
  "https://images.unsplash.com/photo-1682687220945-922198770538?w=300&q=70",
  "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=300&q=70",
  "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=300&q=70",
  "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=300&q=70",
  "https://images.unsplash.com/photo-1682687220015-186f63b8850a?w=300&q=70",
  "https://images.unsplash.com/photo-1682687220866-c856f566f1bd?w=300&q=70",
  "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&q=70",
  "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=300&q=70",
  "https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=300&q=70",
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(USERS);
  const [tab, setTab] = useState<"all" | "people">("all");

  const filtered = query
    ? users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const toggleFollow = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, following: !u.following } : u));
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 pt-4 pb-3">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск людей, тегов..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all text-sm"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {query ? (
        <div className="px-4 pt-4 space-y-3 animate-fade-in">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          ) : (
            filtered.map(user => (
              <div key={user.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 hover-scale">
                <div className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-br ${user.grad}`}>
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-white font-bold">{user.avatar}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-muted-foreground text-xs">@{user.username} · {user.followers} подписчиков</p>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover-scale ${
                    user.following
                      ? "glass text-white border border-border"
                      : "grad-btn text-white shadow-md shadow-vibe-pink/20"
                  }`}
                >
                  {user.following ? "Вы подписаны" : "Подписаться"}
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {/* Trending tags */}
          <div className="px-4 pt-4 mb-4">
            <h3 className="text-white font-bold mb-3">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="glass px-3 py-1.5 rounded-full text-sm text-white/80 hover:text-white hover-scale transition-all border border-border/50 hover:border-vibe-pink/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Explore grid */}
          <div className="px-4 mb-4">
            <h3 className="text-white font-bold mb-3">Explore</h3>
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
              {EXPLORE_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className={`relative cursor-pointer overflow-hidden hover-scale ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                  style={{ aspectRatio: i === 0 ? "1/1" : "1/1" }}
                >
                  <img
                    src={src}
                    alt="explore"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    style={{ aspectRatio: "1/1" }}
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${i + 10}/300/300`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested users */}
          <div className="px-4">
            <h3 className="text-white font-bold mb-3">Рекомендуем</h3>
            <div className="space-y-3">
              {users.slice(0, 4).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full p-0.5 bg-gradient-to-br ${user.grad}`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-muted-foreground text-xs">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover-scale ${
                      user.following
                        ? "glass text-muted-foreground border border-border"
                        : "grad-btn text-white"
                    }`}
                  >
                    {user.following ? "Подписан" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
