import { useState } from "react";
import Icon from "@/components/ui/icon";

interface SettingsScreenProps {
  currentUser: { name: string; username: string };
  onBack: () => void;
  onLogout: () => void;
}

const SESSIONS = [
  { id: 1, device: "iPhone 15 Pro", os: "iOS 17", location: "Москва, Россия", time: "Сейчас", current: true, icon: "Smartphone" },
  { id: 2, device: "MacBook Pro", os: "macOS 14", location: "Москва, Россия", time: "2 часа назад", current: false, icon: "Laptop" },
  { id: 3, device: "Chrome на Windows", os: "Windows 11", location: "Санкт-Петербург", time: "3 дня назад", current: false, icon: "Monitor" },
];

export default function SettingsScreen({ currentUser, onBack, onLogout }: SettingsScreenProps) {
  const [tab, setTab] = useState<"main" | "sessions" | "password">("main");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [sessions, setSessions] = useState(SESSIONS);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirmPass) { setPassMsg("Заполните все поля"); return; }
    if (newPass !== confirmPass) { setPassMsg("Пароли не совпадают"); return; }
    if (newPass.length < 6) { setPassMsg("Минимум 6 символов"); return; }
    setPassMsg("✅ Пароль успешно изменён!");
    setOldPass(""); setNewPass(""); setConfirmPass("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  const terminateSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id === id ? s.current : true));
  };

  return (
    <div className="min-h-screen pb-24 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white hover-scale">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <h2 className="text-white font-bold text-lg">Настройки</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-4 pb-2">
        {[
          { id: "main", label: "Основное", icon: "Settings" },
          { id: "sessions", label: "Сессии", icon: "Monitor" },
          { id: "password", label: "Пароль", icon: "Lock" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              tab === t.id ? "grad-btn text-white shadow-md shadow-vibe-pink/20" : "glass text-muted-foreground"
            }`}
          >
            <Icon name={t.icon} size={18} className={tab === t.id ? "text-white" : "text-muted-foreground"} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Main settings */}
      {tab === "main" && (
        <div className="px-4 space-y-3 pt-2 animate-fade-in">
          {/* Profile card */}
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-14 h-14 story-ring">
              <div className="w-full h-full rounded-full glass-strong flex items-center justify-center m-0.5">
                <span className="text-2xl font-bold grad-text">{currentUser.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div>
              <p className="text-white font-bold">{currentUser.name}</p>
              <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
            </div>
          </div>

          {[
            { icon: "Bell", label: "Уведомления", desc: "Push, звуки, вибрация" },
            { icon: "Lock", label: "Приватность", desc: "Кто видит ваш профиль" },
            { icon: "Eye", label: "Видимость", desc: "Открытый / закрытый аккаунт" },
            { icon: "Palette", label: "Внешний вид", desc: "Тема, шрифты" },
            { icon: "Globe", label: "Язык", desc: "Русский" },
            { icon: "HelpCircle", label: "Помощь", desc: "Поддержка и FAQ" },
          ].map(item => (
            <button key={item.label} className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover-scale text-left">
              <div className="w-10 h-10 rounded-xl grad-btn flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover-scale text-left border border-red-500/20"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="LogOut" size={18} className="text-red-400" />
            </div>
            <p className="text-red-400 font-semibold text-sm">Выйти из аккаунта</p>
          </button>
        </div>
      )}

      {/* Sessions */}
      {tab === "sessions" && (
        <div className="px-4 pt-2 space-y-3 animate-fade-in">
          <p className="text-muted-foreground text-sm px-1">Устройства, с которых выполнен вход</p>
          {sessions.map((s, i) => (
            <div
              key={s.id}
              className={`glass rounded-2xl p-4 flex items-center gap-3 animate-fade-in ${s.current ? "border border-vibe-pink/30" : ""}`}
              style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.current ? "grad-btn" : "glass"}`}>
                <Icon name={s.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm truncate">{s.device}</p>
                  {s.current && <span className="text-xs bg-vibe-pink/20 text-vibe-pink px-1.5 py-0.5 rounded-full">текущее</span>}
                </div>
                <p className="text-muted-foreground text-xs">{s.os} · {s.location}</p>
                <p className="text-muted-foreground text-xs">{s.time}</p>
              </div>
              {!s.current && (
                <button
                  onClick={() => terminateSession(s.id)}
                  className="w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center hover-scale"
                >
                  <Icon name="X" size={14} className="text-red-400" />
                </button>
              )}
            </div>
          ))}
          <button className="w-full glass rounded-2xl px-4 py-3 text-red-400 font-semibold text-sm hover-scale border border-red-500/20">
            Завершить все другие сессии
          </button>
        </div>
      )}

      {/* Change password */}
      {tab === "password" && (
        <div className="px-4 pt-2 animate-fade-in">
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-white font-bold text-base mb-1">Смена пароля</p>
              <p className="text-muted-foreground text-sm">Используйте минимум 6 символов</p>
            </div>
            {[
              { placeholder: "Текущий пароль", value: oldPass, set: setOldPass },
              { placeholder: "Новый пароль", value: newPass, set: setNewPass },
              { placeholder: "Повторите новый пароль", value: confirmPass, set: setConfirmPass },
            ].map((f, i) => (
              <div key={i} className="relative">
                <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all"
                />
              </div>
            ))}
            {passMsg && (
              <p className={`text-sm ${passMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{passMsg}</p>
            )}
            <button
              onClick={handleChangePassword}
              className="w-full grad-btn text-white font-bold py-3 rounded-xl hover-scale"
            >
              Сохранить пароль
            </button>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in px-6">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-white font-bold text-xl mb-2">Выйти?</h3>
            <p className="text-muted-foreground text-sm mb-5">Вы выйдете из своего аккаунта VIBE</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 glass text-white font-semibold py-3 rounded-xl hover-scale">
                Отмена
              </button>
              <button onClick={onLogout} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover-scale shadow-lg shadow-red-500/30">
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
