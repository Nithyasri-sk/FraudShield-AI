import { ShieldOff } from "lucide-react";
export function EmptyState({ title, description, action, }) {
    return (<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-600 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-ink-400">
        <ShieldOff size={24} strokeWidth={1.75}/>
      </div>
      <h3 className="font-display mt-4 text-base font-semibold text-ink-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>);
}
