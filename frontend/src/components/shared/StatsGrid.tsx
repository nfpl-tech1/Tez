import { type ElementType } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface StatCard {
    label: string
    value: number | string
    icon: ElementType
    color: string
    bgColor: string
    onClick?: () => void
    trend?: { value: number; label: string }
}

interface StatsGridProps {
    stats: StatCard[]
    columns?: 2 | 3 | 4 | 5
    className?: string
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
        5: "md:grid-cols-3 lg:grid-cols-5",
    }

    return (
        <div className={cn("grid grid-cols-1 gap-4", gridCols[columns], className)}>
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className={cn(
                        "transition-all duration-200",
                        stat.onClick &&
                        "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-primary"
                    )}
                    onClick={stat.onClick}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                                {stat.trend && (
                                    <p
                                        className={cn(
                                            "text-xs",
                                            stat.trend.value >= 0 ? "text-green-600" : "text-red-600"
                                        )}
                                    >
                                        {stat.trend.value >= 0 ? "+" : ""}
                                        {stat.trend.value}% {stat.trend.label}
                                    </p>
                                )}
                            </div>
                            <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                        </div>
                        {stat.onClick && (
                            <div className="mt-4 pt-4 border-t">
                                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    View details <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
