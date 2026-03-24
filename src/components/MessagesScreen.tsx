import { useState } from "react";
import Icon from "@/components/ui/icon";

const CHATS = [
  { id: 1, user: "Алекс Волков", username: "alex_v", avatar: "А", grad: "from-orange-400 to-pink-500", lastMsg: "Отличная фотка! 🔥", time: "сейчас", unread: 2, online: true },
  { id: 2, user: "Маша Кириллова", username: "masha_k", avatar: "М", grad: "from-purple-500 to-cyan-400", lastMsg: "Когда встречаемся?", time: "5 мин", unread: 0, online: true },
  { id: 3, user: "Дима Прохоров", username: "dima_pro", avatar: "Д", grad: "from-blue-500 to-purple-500", lastMsg: "Голосовое сообщение 🎤", time: "1 ч", unread: 1, online: false },
  { id: 4, user: "Катя Лебедева", username: "kate_life", avatar: "К", grad: "from-cyan-400 to-blue-500", lastMsg: "Ок, договорились 👍", time: "3 ч", unread: 0, online: false },
  { id: 5, user: "Иван Громов", username: "ivan_g", avatar: "И", grad: "from-pink-500 to-orange-400", lastMsg: "Спасибо за совет!", time: "вчера", unread: 0, online: false },
];

const MOCK_MESSAGES = [
  { id: 1, from: "them", text: "Привет! Видел твою новую фотку — огонь! 🔥", time: "14:30", type: "text" },
  { id: 2, from: "me", text: "Спасибо! Снимал на закате в горах", time: "14:31", type: "text" },
  { id: 3, from: "them", text: "Это где-то рядом с тобой?", time: "14:32", type: "text" },
  { id: 4, from: "me", text: "Да, час езды. Скоро опять поеду, если хочешь — присоединяйся!", time: "14:33", type: "text" },
  { id: 5, from: "them", text: "🎤", time: "14:35", type: "voice", duration: "0:12" },
  { id: 6, from: "me", text: "Классно! Договорились 🤙", time: "14:36", type: "text" },
];

interface MessagesScreenProps {
  currentUser: { name: string; username: string };
}

export default function MessagesScreen({ currentUser }: MessagesScreenProps) {
  const [activeChat, setActiveChat] = useState<typeof CHATS[0] | null>(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [calling, setCalling] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type: "text"
    }]);
    setInput("");
  };

  if (activeChat) {
    return (
      <div className="flex flex-col h-screen pb-0">
        {/* Chat header */}
        <div className="glass-strong border-b border-border/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setActiveChat(null)} className="text-white hover-scale">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <div className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-br ${activeChat.grad}`}>
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center relative">
              <span className="text-white font-bold text-sm">{activeChat.avatar}</span>
              {activeChat.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{activeChat.user}</p>
            <p className="text-xs text-green-400">{activeChat.online ? "в сети" : "не в сети"}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCalling(true)} className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
              <Icon name="Phone" size={16} className="text-vibe-cyan" />
            </button>
            <button onClick={() => setCalling(true)} className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
              <Icon name="Video" size={16} className="text-vibe-pink" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              {msg.type === "voice" ? (
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl max-w-[200px] ${
                  msg.from === "me"
                    ? "grad-btn rounded-tr-sm"
                    : "glass rounded-tl-sm"
                }`}>
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Play" size={12} className="text-white" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-end gap-0.5 h-6">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <div key={j} className="w-1 bg-white/60 rounded-full" style={{ height: `${Math.random() * 16 + 4}px` }} />
                      ))}
                    </div>
                    <span className="text-white/60 text-xs">{msg.duration}</span>
                  </div>
                </div>
              ) : (
                <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] ${
                  msg.from === "me"
                    ? "grad-btn text-white rounded-tr-sm"
                    : "glass text-white rounded-tl-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "me" ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50 px-4 py-3 flex items-center gap-2">
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
            <Icon name="ImagePlus" size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Сообщение..."
              className="w-full glass rounded-2xl px-4 py-2.5 text-white text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all pr-10"
            />
          </div>
          {input ? (
            <button onClick={sendMessage} className="w-9 h-9 grad-btn rounded-full flex items-center justify-center hover-scale shadow-md shadow-vibe-pink/20">
              <Icon name="Send" size={16} className="text-white" />
            </button>
          ) : (
            <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover-scale">
              <Icon name="Mic" size={18} className="text-vibe-pink" />
            </button>
          )}
        </div>

        {/* Call overlay */}
        {calling && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in"
            style={{ background: "linear-gradient(135deg, #0a0015, #1a0030, #0a1020)" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
                style={{ background: "radial-gradient(circle, #f72585, transparent)" }} />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
                style={{ background: "radial-gradient(circle, #4cc9f0, transparent)", animationDelay: "1s" }} />
            </div>
            <div className={`w-28 h-28 rounded-full p-1 bg-gradient-to-br ${activeChat.grad} animate-pulse-glow mb-6`}>
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <span className="text-white font-bold text-4xl">{activeChat.avatar}</span>
              </div>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">{activeChat.user}</h2>
            <p className="text-muted-foreground mb-12 animate-pulse">Вызов...</p>
            <div className="flex gap-8">
              <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover-scale shadow-xl shadow-red-500/30"
                onClick={() => setCalling(false)}>
                <Icon name="PhoneOff" size={24} className="text-white" />
              </button>
              <button className="w-16 h-16 glass rounded-full flex items-center justify-center hover-scale">
                <Icon name="MicOff" size={24} className="text-white" />
              </button>
              <button className="w-16 h-16 glass rounded-full flex items-center justify-center hover-scale">
                <Icon name="Volume2" size={24} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Сообщения</h2>
          <button className="w-9 h-9 grad-btn rounded-full flex items-center justify-center hover-scale shadow-md shadow-vibe-pink/20">
            <Icon name="Edit" size={16} className="text-white" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по чатам..."
            className="w-full glass rounded-2xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="divide-y divide-border/30">
        {CHATS.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/3 transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-br ${chat.grad}`}>
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-white font-bold">{chat.avatar}</span>
                </div>
              </div>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-white font-semibold text-sm">{chat.user}</p>
                <p className="text-muted-foreground text-xs">{chat.time}</p>
              </div>
              <p className="text-muted-foreground text-sm truncate">{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 grad-btn rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{chat.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
