import Icon from "@/components/ui/icon";

const NOTIFICATIONS = [
  { id: 1, type: "like", user: "Алекс Волков", username: "alex_v", text: "лайкнул вашу фотографию", time: "2 мин", avatar: "А", grad: "from-orange-400 to-pink-500", read: false },
  { id: 2, type: "follow", user: "Маша Кириллова", username: "masha_k", text: "начала на вас подписываться", time: "15 мин", avatar: "М", grad: "from-purple-500 to-cyan-400", read: false },
  { id: 3, type: "comment", user: "Дима Прохоров", username: "dima_pro", text: "прокомментировал: «Невероятная локация! 😍»", time: "1 ч", avatar: "Д", grad: "from-blue-500 to-purple-500", read: true },
  { id: 4, type: "like", user: "Катя Лебедева", username: "kate_life", text: "и ещё 47 человек лайкнули вашу фотографию", time: "3 ч", avatar: "К", grad: "from-cyan-400 to-blue-500", read: true },
  { id: 5, type: "mention", user: "Иван Громов", username: "ivan_g", text: "упомянул вас в комментарии", time: "5 ч", avatar: "И", grad: "from-pink-500 to-orange-400", read: true },
  { id: 6, type: "follow", user: "Яна Артемьева", username: "yana_art", text: "начала на вас подписываться", time: "1 д", avatar: "Я", grad: "from-vibe-pink to-purple-600", read: true },
];

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  like: { icon: "Heart", color: "text-vibe-pink" },
  follow: { icon: "UserPlus", color: "text-vibe-cyan" },
  comment: { icon: "MessageCircle", color: "text-vibe-purple" },
  mention: { icon: "AtSign", color: "text-vibe-orange" },
};

export default function NotificationsScreen() {
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">Уведомления</h2>
            {unreadCount > 0 && (
              <p className="text-muted-foreground text-xs mt-0.5">{unreadCount} непрочитанных</p>
            )}
          </div>
          <button className="text-vibe-pink text-sm font-semibold">Отметить всё</button>
        </div>
      </div>

      {/* New notifications */}
      {NOTIFICATIONS.filter(n => !n.read).length > 0 && (
        <div className="pt-4">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4 mb-2">Новые</p>
          {NOTIFICATIONS.filter(n => !n.read).map((notif, i) => (
            <NotifItem key={notif.id} notif={notif} i={i} />
          ))}
        </div>
      )}

      {/* Old notifications */}
      <div className="pt-4">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4 mb-2">Ранее</p>
        {NOTIFICATIONS.filter(n => n.read).map((notif, i) => (
          <NotifItem key={notif.id} notif={notif} i={i + 2} />
        ))}
      </div>
    </div>
  );
}

function NotifItem({ notif, i }: { notif: typeof NOTIFICATIONS[0]; i: number }) {
  const typeInfo = TYPE_ICONS[notif.type] || { icon: "Bell", color: "text-white" };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors animate-fade-in ${!notif.read ? "bg-vibe-pink/5" : ""}`}
      style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-br ${notif.grad}`}>
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
            <span className="text-white font-bold text-sm">{notif.avatar}</span>
          </div>
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-card rounded-full flex items-center justify-center border border-border`}>
          <Icon name={typeInfo.icon} size={10} className={typeInfo.color} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="text-white font-semibold">{notif.user} </span>
          <span className="text-white/70">{notif.text}</span>
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">{notif.time}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {notif.type === "follow" ? (
          <button className="grad-btn text-white text-xs font-bold px-3 py-1.5 rounded-xl hover-scale">
            В ответ
          </button>
        ) : (
          <div className="w-10 h-10 rounded-xl overflow-hidden glass">
            <img
              src={`https://picsum.photos/seed/${notif.id + 5}/80/80`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!notif.read && <div className="w-2 h-2 bg-vibe-pink rounded-full" />}
      </div>
    </div>
  );
}
