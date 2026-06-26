/**
 * Header Search Component
 * 
 * Compact search with dropdown for the navbar.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Package, X, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { publicApi } from '@/lib/api';

interface SearchResult {
    id: number;
    name: string;
    description: string;
    department_names?: string[];
}

export function HeaderSearch() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [tools, setTools] = useState<SearchResult[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load tools for search
    useEffect(() => {
        const loadTools = async () => {
            try {
                const data = await publicApi.getTools();
                setTools(data.tools || []);
            } catch (error) {
                console.error('Failed to load tools for search:', error);
            }
        };
        loadTools();
    }, []);

    // Load recent searches
    useEffect(() => {
        const saved = localStorage.getItem('recentToolSearches');
        if (saved) setRecentSearches(JSON.parse(saved).slice(0, 3));
    }, []);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
        setQuery('');
    }, [location.pathname]);

    // Filter tools based on query
    const filteredTools = query.trim().length > 0
        ? tools.filter(tool =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    // Save recent search
    const saveRecentSearch = useCallback((searchTerm: string) => {
        if (!searchTerm.trim()) return;
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 3);
        setRecentSearches(updated);
        localStorage.setItem('recentToolSearches', JSON.stringify(updated));
    }, [recentSearches]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = filteredTools.length > 0 ? filteredTools : (query === '' ? recentSearches : []);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredTools.length > 0) {
                handleSelectTool(filteredTools[highlightedIndex]);
            } else if (highlightedIndex >= 0 && query === '' && recentSearches[highlightedIndex]) {
                handleRecentSearch(recentSearches[highlightedIndex]);
            } else if (query.trim()) {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const handleSelectTool = (tool: SearchResult) => {
        saveRecentSearch(tool.name);
        setIsOpen(false);
        setQuery('');
        navigate(`/tools/${tool.id}`);
    };

    const handleRecentSearch = (search: string) => {
        setQuery(search);
        navigate(`/tools?q=${encodeURIComponent(search)}`);
        setIsOpen(false);
    };

    const handleSearch = () => {
        if (query.trim()) {
            saveRecentSearch(query.trim());
            navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
        }
        setIsOpen(false);
    };

    const showDropdown = isOpen && (filteredTools.length > 0 || (query === '' && recentSearches.length > 0) || (query.trim() && filteredTools.length === 0));

    return (
        <div ref={containerRef} className="relative">
            {/* Search Input */}
            <div className={cn(
                "relative flex items-center transition-all duration-200",
                isFocused ? "w-72" : "w-48"
            )}>
                <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        setIsOpen(true);
                    }}
                    onBlur={() => {
                        if (!query) setIsFocused(false);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search tools..."
                    className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 hover:bg-gray-200/70 focus:bg-white border border-transparent focus:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        className="absolute right-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999] min-w-[320px]">
                    {/* Recent Searches */}
                    {query === '' && recentSearches.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Recent</p>
                            {recentSearches.map((search, idx) => (
                                <button
                                    key={search}
                                    onClick={() => handleRecentSearch(search)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                                        highlightedIndex === idx ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                                    )}
                                >
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search Results */}
                    {filteredTools.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Tools</p>
                            {filteredTools.map((tool, idx) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelectTool(tool)}
                                    className={cn(
                                        "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group",
                                        highlightedIndex === idx ? "bg-blue-50" : "hover:bg-gray-50"
                                    )}
                                >
                                    <div className={cn(
                                        "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                        highlightedIndex === idx ? "bg-blue-100" : "bg-gray-100"
                                    )}>
                                        <Package className={cn(
                                            "h-4 w-4",
                                            highlightedIndex === idx ? "text-blue-600" : "text-gray-500"
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "font-medium text-sm truncate",
                                            highlightedIndex === idx ? "text-blue-700" : "text-gray-900"
                                        )}>
                                            {highlightQuery(tool.name, query)}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                                    </div>
                                    <ArrowRight className={cn(
                                        "h-4 w-4 mt-1 transition-opacity",
                                        highlightedIndex === idx ? "opacity-100 text-blue-500" : "opacity-0"
                                    )} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.trim() && filteredTools.length === 0 && (
                        <div className="p-6 text-center">
                            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-500">No tools found for "{query}"</p>
                            <button
                                onClick={handleSearch}
                                className="mt-2 text-sm text-blue-600 hover:underline"
                            >
                                Search all tools →
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-4">
                        <span><kbd className="px-1 py-0.5 bg-white rounded border">↑↓</kbd> navigate</span>
                        <span><kbd className="px-1 py-0.5 bg-white rounded border">↵</kbd> select</span>
                        <span><kbd className="px-1 py-0.5 bg-white rounded border">esc</kbd> close</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper to highlight matching text
function highlightQuery(text: string, query: string) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="bg-yellow-200 text-inherit rounded">{part}</mark> : part
    );
}
