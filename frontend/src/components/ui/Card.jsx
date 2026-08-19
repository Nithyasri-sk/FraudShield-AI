export function Card({ children, hoverable = false, className = "", ...props }) {
    return (<div className={`card-surface rounded-2xl transition-shadow duration-200 ${hoverable ? "hover:shadow-[var(--shadow-card-hover)]" : ""} ${className}`} {...props}>
      {children}
    </div>);
}
export function CardHeader({ icon, title, subtitle, action, }) {
    return (<div className="flex items-start justify-between gap-4 border-b border-ink-700 px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        {icon && (<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
            {icon}
          </div>)}
        <div>
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink-100">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-ink-300">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>);
}
