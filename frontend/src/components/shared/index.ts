// Shared page-level components
// These are composition components that build on shadcn/ui primitives
// For basic UI primitives (Button, Input, Card, Alert, etc.), use @/components/ui

export { PageHeader } from "./PageHeader"
export { StatsGrid, type StatCard } from "./StatsGrid"
export { LoadingState } from "./LoadingState"
export { EmptyState } from "./EmptyState"
export { DataTable, type Column } from "./DataTable"
export { ProfilePage, type ProfilePageProps, type ProfileData } from "./ProfilePage"
export { default as AllToolsList } from "./AllToolsList"
export { ToolFilters } from "./ToolFilters"
export { SearchAutocomplete } from "./SearchAutocomplete"

// Note: FormCard has been removed - use Card, CardHeader, CardContent directly from @/components/ui/card
// Note: AlertMessage has been moved to @/components/ui/alert - import from there

