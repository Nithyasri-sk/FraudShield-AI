import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShieldCheck, Menu, X, CircleUserRound } from "lucide-react";
import { Badge } from "../ui/Badge";
const NAV_ITEMS = [
    { to: "/", label: "Dashboard" },
    { to: "/analyze", label: "Analyze Transaction" },
    { to: "/history", label: "Detection History" },
    { to: "/model2", label: "Analyze Account" },
];
export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (<header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]">
            <ShieldCheck size={19} strokeWidth={2.25}/>
          </div>
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink-100">
            FraudShield <span className="text-accent-400">AI</span>
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (<NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-150 ${isActive
                ? "bg-ink-800 text-ink-100"
                : "text-ink-300 hover:bg-ink-800/60 hover:text-ink-100"}`}>
              {item.label}
            </NavLink>))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Badge tone="teal" dot>
              Model Online
            </Badge>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-ink-300 transition-colors hover:text-ink-100" aria-label="User profile">
            <CircleUserRound size={18}/>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 hover:bg-ink-800 md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation menu">
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {mobileOpen && (<nav className="animate-fade-up flex flex-col gap-1 border-t border-ink-700 px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (<NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-ink-800 text-ink-100" : "text-ink-300 hover:bg-ink-800/60"}`}>
              {item.label}
            </NavLink>))}
          <div className="mt-1 px-3.5">
            <Badge tone="teal" dot>
              Model Online
            </Badge>
          </div>
        </nav>)}
    </header>);
}
