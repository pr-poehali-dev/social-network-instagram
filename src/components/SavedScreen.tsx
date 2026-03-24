import { useState } from "react";
import Icon from "@/components/ui/icon";

const COLLECTIONS = [
  { id: 1, name: "Все", count: 12, cover: "https://images.unsplash.com/photo-1682687220945-922198770538?w=200&q=60" },
  { id: 2, name: "Природа", count: 4, cover: "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=200&q=60" },
  { id: 3, name: "Путешествия", count: 5, cover: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=200&q=60" },
  { id: 4, name: "Идеи", count: 3, cover: "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=200&q=60" },
];

const SAVED_POSTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1682687220945-922198770538?w=300&q=70", user: "alex_v" },
  { id: 2, img: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=300&q=70", user: "masha_k" },
  { id: 3, img: "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=300&q=70", user: "dima_pro" },
  { id: 4, img: "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=300&q=70", user: "kate_life" },
  { id: 5, img: "https://images.unsplash.com/photo-1682687220015-186f63b8850a?w=300&q=70", user: "ivan_g" },
  { id: 6, img: "https://images.unsplash.com/photo-1682687220866-c856f566f1bd?w=300&q=70", user: "yana_art" },
  { id: 7, img: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&q=70", user: "roma_s" },
  { id: 8, img: "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=300&q=70", user: "alex_v" },
  { id: 9, img: "https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=300&q=70", user: "masha_k" },
  { id: 10, img: "https://images.unsplash.com/photo-1682687220015-186f63b8850a?w=300&q=70", user: "dima_pro" },
  { id: 11, img: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&q=70", user: "ivan_g" },
  { id: 12, img: "https://images.unsplash.com/photo-1682687220866-c856f566f1bd?w=300&q=70", user: "kate_life" },
];

export default function SavedScreen() {
  const [view, setView] = useState<"collections" | "grid">("collections");
  const [activeCollection, setActiveCollection] = useState("Все");

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Сохранённое</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setView("collections")}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${view === "collections" ? "grad-btn" : "glass"}`}
            >
              <Icon name="LayoutGrid" size={18} className="text-white" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${view === "grid" ? "grad-btn" : "glass"}`}
            >
              <Icon name="Grid3X3" size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {view === "collections" ? (
        <div className="px-4 pt-5 space-y-4 animate-fade-in">
          {/* New collection */}
          <button className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover-scale border-2 border-dashed border-border hover:border-vibe-pink/50 transition-all">
            <div className="w-14 h-14 grad-btn rounded-xl flex items-center justify-center">
              <Icon name="Plus" size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Новая коллекция</p>
              <p className="text-muted-foreground text-sm">Создать подборку</p>
            </div>
          </button>

          {/* Collections */}
          {COLLECTIONS.map((col, i) => (
            <button
              key={col.id}
              onClick={() => { setActiveCollection(col.name); setView("grid"); }}
              className="w-full glass rounded-2xl overflow-hidden flex gap-3 hover-scale transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              <img
                src={col.cover}
                alt={col.name}
                className="w-20 h-20 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${col.id + 30}/200/200`;
                }}
              />
              <div className="flex-1 flex flex-col justify-center text-left p-2">
                <p className="text-white font-semibold">{col.name}</p>
                <p className="text-muted-foreground text-sm">{col.count} публикаций</p>
              </div>
              <div className="flex items-center pr-4">
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="px-4 py-3 flex items-center gap-2">
            <button onClick={() => setView("collections")} className="text-muted-foreground hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </button>
            <p className="text-white font-semibold">{activeCollection}</p>
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            {SAVED_POSTS.map((post, i) => (
              <div key={post.id} className="relative cursor-pointer overflow-hidden group animate-fade-in" style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: "forwards" }}>
                <img
                  src={post.img}
                  alt=""
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id + 40}/300/300`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Bookmark" size={20} className="fill-white text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
