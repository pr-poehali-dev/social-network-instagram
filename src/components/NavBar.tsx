import Icon from "@/components/ui/icon";

type Tab = "feed" | "search" | "messages" | "notifications" | "profile";

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  unreadMessages?: number;
  unreadNotifications?: number;
}

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: "feed", icon: "Home", label: "Лента" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "messages", icon: "MessageCircle", label: "Чаты" },
  { id: "notifications", icon: "Bell", label: "Уведомления" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function NavBar({ active, onChange, unreadMessages = 3, unreadNotifications = 2 }: NavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 nav-glow glass-strong border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          const badge = item.id === "messages" ? unreadMessages : item.id === "notifications" ? unreadNotifications : 0;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 relative ${
                isActive ? "scale-105" : "hover:scale-105"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl grad-btn opacity-15" />
              )}
              <div className={`relative transition-all duration-200 ${isActive ? "scale-110" : ""}`}>
                <Icon
                  name={item.icon}
                  size={24}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "text-vibe-pink drop-shadow-[0_0_8px_rgba(247,37,133,0.8)]"
                      : "text-muted-foreground"
                  }`}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 grad-btn rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? "text-vibe-pink" : "text-muted-foreground"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
