/**
 * Public Tool Card
 * 
 * Modern card component for displaying tools in the public browse page.
 * Redesigned to handle multiple tags gracefully.
 */
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Package, Download, User, HardDrive, ArrowUpRight } from 'lucide-react';

interface PublicToolCardProps {
    tool: {
        id: number;
        name: string;
        description: string;
        department_names?: string[];
        uploader_name: string;
        download_count: number;
        file_size_display: string;
    };
}

export function PublicToolCard({ tool }: PublicToolCardProps) {
    const departments = tool.department_names || [];

    return (
        <Link to={`/tools/${tool.id}`} className="block h-full group">
            <Card className="h-full relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-5 flex flex-col h-full">
                    {/* Header with Icon and Title */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="truncate">{tool.uploader_name}</span>
                            </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1 leading-relaxed">
                        {tool.description}
                    </p>

                    {/* Tags - Show first 2 with overflow indicator */}
                    {departments.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                            {departments.slice(0, 2).map((dept, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600"
                                >
                                    {dept}
                                </span>
                            ))}
                            {departments.length > 2 && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-500">
                                    +{departments.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Download className="h-3.5 w-3.5" />
                                <span className="font-medium text-gray-600">{tool.download_count}</span>
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <HardDrive className="h-3.5 w-3.5" />
                                <span className="font-medium text-gray-600">{tool.file_size_display}</span>
                            </span>
                        </div>
                        <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
