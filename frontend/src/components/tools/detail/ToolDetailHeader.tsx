import { Link } from 'react-router-dom';
import { ArrowLeft, Package, FolderOpen, Download, Edit, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import type { ToolDetail as ToolDetailType } from '@/lib/api';

interface ToolDetailHeaderProps {
    tool: ToolDetailType;
    onDownload: () => void;
}

export function ToolDetailHeader({ tool, onDownload }: ToolDetailHeaderProps) {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && user?.role === 'admin';

    return (
        <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/tools" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
                            <Package className="h-10 w-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{tool.name}</h1>
                            {tool.department_names && tool.department_names.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tool.department_names.map((dept, idx) => (
                                        <Badge key={idx} variant="outline" className="border-white/30 text-white bg-white/10">
                                            <FolderOpen className="h-3 w-3 mr-1" />
                                            {dept}
                                        </Badge>
                                    ))}
                                    {tool.subcategory_names?.map((sub, idx) => (
                                        <Badge key={`sub-${idx}`} variant="outline" className="border-white/30 text-white bg-white/10">
                                            {sub}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <p className="text-white/80 text-lg max-w-2xl">{tool.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        {isAdmin && (
                            <Link to={`/admin/tools/${tool.id}/edit`}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 h-14 px-6 text-lg"
                                >
                                    <Edit className="h-5 w-5 mr-2" />
                                    Edit Tool
                                </Button>
                            </Link>
                        )}
                        {tool.github_url && (
                            <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 h-14 px-6 text-lg"
                                >
                                    <Github className="h-5 w-5 mr-2" />
                                    GitHub
                                </Button>
                            </a>
                        )}
                        <Button
                            size="lg"
                            onClick={onDownload}
                            className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 h-14 px-8 text-lg shadow-lg"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
