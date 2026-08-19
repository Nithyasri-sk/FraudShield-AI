import { AlertOctagon, RotateCcw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
export function ErrorState({ error, onRetry, title = "Unable to analyze transaction", }) {
    return (<Card className="animate-fade-up border border-red-500/25 p-6 sm:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertOctagon size={22}/>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-100">{title}</h3>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-300">{error.message}</p>
          </div>
        </div>
        <Button variant="secondary" icon={<RotateCcw size={15}/>} onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </Card>);
}
