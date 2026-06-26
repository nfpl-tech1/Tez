import { type ElementType } from "react"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
    icon?: ElementType
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        icon?: ElementType
    }
    className?: string
}

export function EmptyState({
    icon: Icon = Package,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <Card className={className}>
            <CardContent className={cn(
                "flex flex-col items-center justify-center py-16 px-4 text-center"
            )}>
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {description && (
                    <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
                )}
                {action && (
                    <Button onClick={action.onClick}>
                        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                        {action.label}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
