import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
    message?: string
    fullScreen?: boolean
    className?: string
}

export function LoadingState({
    message = "Loading...",
    fullScreen = false,
    className
}: LoadingStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                fullScreen ? "min-h-[60vh]" : "py-12",
                className
            )}
        >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}
