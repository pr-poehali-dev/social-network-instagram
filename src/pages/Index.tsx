import { useState, useEffect } from "react";
import AuthScreen from "@/components/AuthScreen";
import Feed from "@/components/Feed";
import SearchScreen from "@/components/SearchScreen";
import MessagesScreen from "@/components/MessagesScreen";
import NotificationsScreen from "@/components/NotificationsScreen";
import ProfileScreen from "@/components/ProfileScreen";
import NavBar from "@/components/NavBar";

type Tab = "feed" | "search" | "messages" | "notifications" | "profile";

interface User {
  phone: string;
  username: string;
  name: string;
}

const STORAGE_KEY = "vibe_user";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("feed");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch (_e) {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl grad-text animate-pulse">VIBE</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  const renderScreen = () => {
    switch (tab) {
      case "feed": return <Feed currentUser={user} />;
      case "search": return <SearchScreen />;
      case "messages": return <MessagesScreen currentUser={user} />;
      case "notifications": return <NotificationsScreen />;
      case "profile": return <ProfileScreen currentUser={user} />;
      default: return <Feed currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #f72585, transparent)" }}
        />
        <div
          className="absolute bottom-24 left-0 w-72 h-72 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #4cc9f0, transparent)" }}
        />
      </div>

      <div className="relative z-10">
        <div
          key={tab}
          className="animate-fade-in"
          style={{ animationDuration: "0.25s" }}
        >
          {renderScreen()}
        </div>
      </div>

      <NavBar active={tab} onChange={setTab} />
    </div>
  );
}