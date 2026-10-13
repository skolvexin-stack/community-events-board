"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Rss, Heart, LogOut, LogIn, UserPlus, Compass } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <header style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-base flex-shrink-0"
          style={{ color: "var(--primary)" }}
        >
          <Calendar size={18} />
          <span>Events Board</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: "var(--foreground)" }}
          >
            <Compass size={14} />
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
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-colors"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile: icon-row (no hamburger needed — icons are compact enough) */}
        <nav className="flex sm:hidden items-center gap-0.5">
          <Link
            href="/"
            className="p-2 rounded-md transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: "var(--foreground)" }}
            title="Explore"
          >
            <Compass size={18} />
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/feed"
                className="p-2 rounded-md transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
                title="My Feed"
              >
                <Rss size={18} />
              </Link>
              <Link
                href="/preferences"
                className="p-2 rounded-md transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
                title="Preferences"
              >
                <Heart size={18} />
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-md transition-colors hover:bg-[var(--muted-bg)] cursor-pointer"
                style={{ color: "var(--muted)" }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                href="/auth/login"
                className="p-2 rounded-md transition-colors hover:bg-[var(--muted-bg)]"
                style={{ color: "var(--foreground)" }}
                title="Login"
              >
                <LogIn size={18} />
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-1.5 text-xs rounded-md font-medium"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
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
