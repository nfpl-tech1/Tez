import { type ReactNode, type ElementType } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PageHeaderAction {
    label: string
    icon?: ElementType
    onClick?: () => void
    href?: string
    variant?: "default" | "outline" | "ghost" | "destructive"
}

interface PageHeaderProps {
    title?: string
    description?: string
    actions?: PageHeaderAction[]
    children?: ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    actions,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
                className
            )}
        >
            <div>
                {title && (
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                )}
                {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            {(actions || children) && (
                <div className="flex items-center gap-2">
                    {actions?.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || "default"}
                            onClick={action.onClick}
                        >
                            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                            {action.label}
                        </Button>
                    ))}
                    {children}
                </div>
            )}
        </div>
    )
}
