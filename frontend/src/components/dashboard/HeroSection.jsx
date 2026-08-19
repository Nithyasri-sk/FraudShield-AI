import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Radar } from "lucide-react";
import { Button } from "../ui/Button";
export function HeroSection() {
    return (<div className="card-surface relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: "linear-gradient(var(--color-accent-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-400) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
        }}/>
      <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-300">
            <Radar size={12}/> Real-Time Risk Assessment
          </span>
          <h1 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-100 sm:text-4xl">
            Analyze a Transaction
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-300">
            Evaluate transaction behavior using our machine-learning fraud
            detection model. Enter transaction and customer details to get a
            secure, real-time risk prediction.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/analyze">
              <Button size="lg" icon={<ShieldCheck size={18}/>}>
                Analyze Transaction
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" variant="secondary" icon={<ArrowRight size={16}/>}>
                View Detection History
              </Button>
            </Link>
          </div>
        </div>

        {/* Signature element: a radar-scan shield — the recurring visual
            motif of the product, echoed later by the risk probability ring. */}
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center sm:h-48 sm:w-48">
          <span className="animate-pulse-ring absolute h-24 w-24 rounded-full border border-accent-400/40"/>
          <span className="animate-pulse-ring absolute h-24 w-24 rounded-full border border-accent-400/40" style={{ animationDelay: "1.2s" }}/>
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-ink-600 bg-ink-850 shadow-[var(--shadow-card)] sm:h-32 sm:w-32">
            <ShieldCheck size={44} className="text-accent-400" strokeWidth={1.75}/>
            <div className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 bg-gradient-to-b from-transparent via-accent-400/25 to-accent-400/50 animate-scan-sweep"/>
          </div>
        </div>
      </div>
    </div>);
}
