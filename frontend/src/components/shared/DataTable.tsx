import { type ReactNode, type ElementType } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export interface Column<T> {
    key: string
    header: string
    render?: (item: T) => ReactNode
    className?: string
}

interface DataTableProps<T> {
    title?: string
    titleIcon?: ElementType
    columns: Column<T>[]
    data: T[]
    keyExtractor: (item: T) => string | number
    onRowClick?: (item: T) => void
    emptyMessage?: string
    headerAction?: ReactNode
    className?: string
}

export function DataTable<T>({
    title,
    titleIcon: TitleIcon,
    columns,
    data,
    keyExtractor,
    onRowClick,
    emptyMessage = "No data available",
    headerAction,
    className,
}: DataTableProps<T>) {
    return (
        <Card className={className}>
            {title && (
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {TitleIcon && <TitleIcon className="h-5 w-5" />}
                        {title}
                    </CardTitle>
                    {headerAction}
                </CardHeader>
            )}
            <CardContent className={cn(!title && "pt-6")}>
                {data.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        {emptyMessage}
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                {columns.map((col) => (
                                    <TableHead key={col.key} className={col.className}>
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow
                                    key={keyExtractor(item)}
                                    className={cn(onRowClick && "cursor-pointer")}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className={col.className}>
                                            {col.render
                                                ? col.render(item)
                                                : String((item as Record<string, unknown>)[col.key] ?? "-")}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
