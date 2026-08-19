import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
/**
 * Purely presentational drag-and-drop target. It only reports a selected
 * file back to the parent via `onFileSelected` — all format/size
 * validation lives in the parent (DatasetUpload) so this component can be
 * reused for other file types later without modification.
 */
export function FileDropZone({ accept, onFileSelected, disabled, }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);
    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        if (disabled)
            return;
        const file = e.dataTransfer.files?.[0];
        if (file)
            onFileSelected(file);
    }
    return (<div onDragOver={(e) => {
            e.preventDefault();
            if (!disabled)
                setIsDragging(true);
        }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => !disabled && inputRef.current?.click()} role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled} className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-50 border-ink-700" : "cursor-pointer"} ${isDragging && !disabled
            ? "border-accent-400 bg-accent-500/5 scale-[1.005]"
            : "border-ink-600 hover:border-ink-500 hover:bg-ink-800/30"}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200 ${isDragging ? "bg-accent-500/15 text-accent-400" : "bg-ink-800 text-ink-400"}`}>
        <UploadCloud size={24} strokeWidth={1.75}/>
      </div>
      <h3 className="font-display mt-4 text-base font-semibold text-ink-100">Upload Transaction Dataset</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-400">
        Drag and drop your CSV file here, or browse from your device.
      </p>
      <span className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 px-4 text-sm font-medium text-ink-100 transition-colors hover:bg-ink-700">
        Browse Files
      </span>
      <input ref={inputRef} type="file" accept={accept} disabled={disabled} className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file)
                onFileSelected(file);
            e.target.value = "";
        }}/>
    </div>);
}
