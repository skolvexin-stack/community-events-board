"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Rss, Heart, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sync = () => setIsLoggedIn(!!localStorage.getItem("user_token"));
    sync();
    window.addEventListener("user-auth-change", sync);
    return () => window.removeEventListener("user-auth-change", sync);
  }, []);

  function logout() {
    localStorage.removeItem("user_token");
    document.cookie = "user_token=; path=/; max-age=0";
    setIsLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <header
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-base"
          style={{ color: "var(--primary)" }}
        >
          <Calendar size={18} />
          Events Board
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: "var(--foreground)" }}
          >
            Explore
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/feed"
                className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
              >
                <Rss size={14} />
                My Feed
              </Link>
              <Link
                href="/preferences"
                className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
              >
                <Heart size={14} />
                Preferences
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors hover:bg-[var(--muted-bg)] cursor-pointer"
                style={{ color: "var(--muted)" }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
              >
                <LogIn size={14} />
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-1.5 text-sm rounded-md text-white transition-colors"
                style={{ background: "var(--primary)" }}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
