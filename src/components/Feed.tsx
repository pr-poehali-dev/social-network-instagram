import { useState } from "react";
import Icon from "@/components/ui/icon";
import StoriesBar from "./StoriesBar";

const MOCK_POSTS = [
  {
    id: 1,
    user: "alex_v",
    name: "Алекс Волков",
    avatar: "А",
    time: "2 ч назад",
    image: "https://images.unsplash.com/photo-1682687220945-922198770538?w=600&q=80",
    caption: "Золотой час в горах 🏔️ Каждый закат — это шанс на новый рассвет",
    likes: 847,
    comments: 32,
    liked: false,
    saved: false,
    colorGrad: "from-orange-400 to-pink-500",
  },
  {
    id: 2,
    user: "masha_k",
    name: "Маша Кириллова",
    avatar: "М",
    time: "5 ч назад",
    image: "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=600&q=80",
    caption: "Утро начинается с кофе ☕ и хорошего настроения",
    likes: 1243,
    comments: 67,
    liked: true,
    saved: false,
    colorGrad: "from-purple-500 to-cyan-400",
  },
  {
    id: 3,
    user: "dima_pro",
    name: "Дима Прохоров",
    avatar: "Д",
    time: "8 ч назад",
    image: "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=600&q=80",
    caption: "Городские огни никогда не устают 🌆",
    likes: 2891,
    comments: 134,
    liked: false,
    saved: true,
    colorGrad: "from-blue-500 to-purple-500",
  },
];

interface FeedProps {
  currentUser: { name: string; username: string };
}

export default function Feed({ currentUser }: FeedProps) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState(false);
  const [postText, setPostText] = useState("");

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, saved: !p.saved } : p
    ));
  };

  return (
    <div className="pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-display text-3xl grad-text">VIBE</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewPost(true)}
              className="w-9 h-9 grad-btn rounded-full flex items-center justify-center hover-scale shadow-lg shadow-vibe-pink/20"
            >
              <Icon name="Plus" size={18} className="text-white" />
            </button>
            <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale relative">
              <Icon name="Heart" size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-vibe-pink rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
        <StoriesBar currentUser={currentUser} />
      </div>

      {/* Posts */}
      <div className="space-y-1">
        {posts.map((post, idx) => (
          <article
            key={post.id}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            {/* Post header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-br ${post.colorGrad}`}>
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-white font-bold">{post.avatar}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{post.name}</p>
                  <p className="text-muted-foreground text-xs">{post.time}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-white transition-colors">
                <Icon name="MoreHorizontal" size={20} />
              </button>
            </div>

            {/* Post image */}
            <div className="relative overflow-hidden">
              <img
                src={post.image}
                alt="post"
                className="w-full aspect-square object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id}/600/600`;
                }}
              />
              <div className="absolute inset-0 post-gradient" />
            </div>

            {/* Actions */}
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 hover-scale transition-all"
                  >
                    <Icon
                      name={post.liked ? "Heart" : "Heart"}
                      size={24}
                      className={`transition-all duration-200 ${post.liked ? "text-vibe-pink fill-vibe-pink scale-110" : "text-white"}`}
                    />
                    <span className="text-sm font-semibold text-white">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover-scale">
                    <Icon name="MessageCircle" size={24} className="text-white" />
                    <span className="text-sm font-semibold text-white">{post.comments}</span>
                  </button>
                  <button className="hover-scale">
                    <Icon name="Send" size={22} className="text-white" />
                  </button>
                </div>
                <button onClick={() => toggleSave(post.id)} className="hover-scale">
                  <Icon
                    name="Bookmark"
                    size={24}
                    className={`transition-all duration-200 ${post.saved ? "text-vibe-cyan fill-vibe-cyan" : "text-white"}`}
                  />
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed">
                <span className="font-semibold">{post.user}</span>{" "}
                <span className="text-white/80">{post.caption}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* New post modal */}
      {newPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" onClick={() => setNewPost(false)}>
          <div
            className="w-full max-w-lg glass-strong rounded-t-3xl p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
            <h3 className="text-white font-bold text-xl mb-4">Новая публикация</h3>
            <div className="flex gap-3 mb-4">
              <div className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center cursor-pointer hover-scale border-2 border-dashed border-border hover:border-vibe-pink transition-colors">
                <Icon name="ImagePlus" size={28} className="text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Фото</span>
              </div>
              <div className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center cursor-pointer hover-scale border-2 border-dashed border-border hover:border-vibe-cyan transition-colors">
                <Icon name="Video" size={28} className="text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Видео</span>
              </div>
            </div>
            <textarea
              placeholder="Что происходит?"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none resize-none text-sm min-h-24 focus:ring-2 focus:ring-vibe-pink/50 transition-all"
            />
            <button className="w-full grad-btn text-white font-bold py-3.5 rounded-xl mt-3 hover-scale">
              Опубликовать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
