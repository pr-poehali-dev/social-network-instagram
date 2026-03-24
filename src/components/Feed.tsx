import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import StoriesBar from "./StoriesBar";

const UPLOAD_URL = "https://functions.poehali.dev/aed84985-58a0-42a9-9a86-68ed185d1b8f";

const INITIAL_POSTS = [
  {
    id: 1,
    user: "alex_v",
    name: "Алекс Волков",
    avatar: "А",
    time: "2 ч назад",
    image: "https://images.unsplash.com/photo-1682687220945-922198770538?w=600&q=80",
    mediaType: "image" as "image" | "video",
    caption: "Золотой час в горах 🏔️ Каждый закат — это шанс на новый рассвет",
    likes: 847,
    comments: [
      { id: 1, user: "masha_k", text: "Невероятно красиво! 😍", time: "1 ч" },
      { id: 2, user: "dima_pro", text: "Где это снято?", time: "45 мин" },
    ],
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
    mediaType: "image" as "image" | "video",
    caption: "Утро начинается с кофе ☕ и хорошего настроения",
    likes: 1243,
    comments: [
      { id: 1, user: "kate_life", text: "Согласна! ☕", time: "4 ч" },
    ],
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
    mediaType: "image" as "image" | "video",
    caption: "Городские огни никогда не устают 🌆",
    likes: 2891,
    comments: [],
    liked: false,
    saved: true,
    colorGrad: "from-blue-500 to-purple-500",
  },
];

interface FeedProps {
  currentUser: { name: string; username: string };
}

export default function Feed({ currentUser }: FeedProps) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState(false);
  const [postText, setPostText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video"; base64: string; mimeType: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setMediaPreview({ url: result, type, base64: result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!postText.trim() && !mediaPreview) return;
    setUploading(true);
    let mediaUrl = "";
    let mediaType: "image" | "video" = "image";

    if (mediaPreview) {
      try {
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: mediaPreview.base64, type: mediaPreview.mimeType, folder: "posts" }),
        });
        const data = await res.json();
        mediaUrl = data.url || mediaPreview.url;
        mediaType = mediaPreview.type;
      } catch {
        mediaUrl = mediaPreview.url;
        mediaType = mediaPreview.type;
      }
    }

    const newPostObj = {
      id: Date.now(),
      user: currentUser.username,
      name: currentUser.name,
      avatar: currentUser.name.charAt(0).toUpperCase(),
      time: "только что",
      image: mediaUrl || "https://images.unsplash.com/photo-1682687220015-186f63b8850a?w=600&q=80",
      mediaType,
      caption: postText,
      likes: 0,
      comments: [] as { id: number; user: string; text: string; time: string }[],
      liked: false,
      saved: false,
      colorGrad: "from-vibe-pink to-vibe-purple",
    };

    setPosts(prev => [newPostObj, ...prev]);
    setNewPost(false);
    setPostText("");
    setMediaPreview(null);
    setUploading(false);
  };

  const addComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Date.now(), user: currentUser.username, text, time: "только что" }] }
        : p
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
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
            style={{ animationDelay: `${idx * 0.08}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            {/* Header */}
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

            {/* Media */}
            <div className="relative overflow-hidden">
              {post.mediaType === "video" ? (
                <video
                  src={post.image}
                  className="w-full aspect-square object-cover"
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full aspect-square object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id}/600/600`; }}
                />
              )}
              <div className="absolute inset-0 post-gradient pointer-events-none" />
            </div>

            {/* Actions */}
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 hover-scale transition-all">
                    <Icon
                      name="Heart"
                      size={24}
                      className={`transition-all duration-200 ${post.liked ? "text-vibe-pink fill-vibe-pink scale-110" : "text-white"}`}
                    />
                    <span className="text-sm font-semibold text-white">{post.likes.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover-scale"
                  >
                    <Icon name="MessageCircle" size={24} className={`transition-colors ${openComments === post.id ? "text-vibe-cyan" : "text-white"}`} />
                    <span className="text-sm font-semibold text-white">{post.comments.length}</span>
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

              <p className="text-sm text-white leading-relaxed mb-2">
                <span className="font-semibold">{post.user}</span>{" "}
                <span className="text-white/80">{post.caption}</span>
              </p>

              {/* Comments section */}
              {openComments === post.id && (
                <div className="mt-2 animate-fade-in">
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {post.comments.length === 0 && (
                      <p className="text-muted-foreground text-xs text-center py-2">Комментариев пока нет</p>
                    )}
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full grad-btn flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{c.user.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 glass rounded-xl px-3 py-1.5">
                          <span className="text-white font-semibold text-xs">{c.user} </span>
                          <span className="text-white/80 text-xs">{c.text}</span>
                          <p className="text-muted-foreground text-xs mt-0.5">{c.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && addComment(post.id)}
                      placeholder="Написать комментарий..."
                      className="flex-1 glass rounded-xl px-3 py-2 text-white text-xs placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50"
                    />
                    <button
                      onClick={() => addComment(post.id)}
                      className="w-8 h-8 grad-btn rounded-xl flex items-center justify-center hover-scale"
                    >
                      <Icon name="Send" size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* New post modal */}
      {newPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" onClick={() => { setNewPost(false); setMediaPreview(null); setPostText(""); }}>
          <div className="w-full max-w-lg glass-strong rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
            <h3 className="text-white font-bold text-xl mb-4">Новая публикация</h3>

            {/* Media preview */}
            {mediaPreview ? (
              <div className="relative mb-4 rounded-2xl overflow-hidden">
                {mediaPreview.type === "video" ? (
                  <video src={mediaPreview.url} className="w-full max-h-56 object-cover rounded-2xl" controls />
                ) : (
                  <img src={mediaPreview.url} alt="preview" className="w-full max-h-56 object-cover rounded-2xl" />
                )}
                <button
                  onClick={() => setMediaPreview(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover-scale"
                >
                  <Icon name="X" size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => photoRef.current?.click()}
                  className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center cursor-pointer hover-scale border-2 border-dashed border-border hover:border-vibe-pink transition-colors"
                >
                  <Icon name="ImagePlus" size={28} className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Фото</span>
                </button>
                <button
                  onClick={() => videoRef.current?.click()}
                  className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center cursor-pointer hover-scale border-2 border-dashed border-border hover:border-vibe-cyan transition-colors"
                >
                  <Icon name="Video" size={28} className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Видео</span>
                </button>
              </div>
            )}

            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e, "image")} />
            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => handleFileSelect(e, "video")} />

            <textarea
              placeholder="Что происходит?"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none resize-none text-sm min-h-20 focus:ring-2 focus:ring-vibe-pink/50 transition-all"
            />
            <button
              onClick={handlePublish}
              disabled={uploading || (!postText.trim() && !mediaPreview)}
              className="w-full grad-btn text-white font-bold py-3.5 rounded-xl mt-3 hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Загружаем..." : "Опубликовать"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
