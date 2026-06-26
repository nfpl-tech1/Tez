/**
 * Search Autocomplete Component
 * 
 * Modern search with dropdown showing matching results as you type.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, X, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: number;
    name: string;
    description: string;
    department_names?: string[];
}

interface SearchAutocompleteProps {
    tools: SearchResult[];
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchAutocomplete({ tools, onSearch, placeholder = "Search tools...", className }: SearchAutocompleteProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter tools based on query
    const filteredTools = query.trim().length > 0
        ? tools.filter(tool =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()) ||
            tool.department_names?.some(d => d.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 6)
        : [];

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentToolSearches');
        if (saved) setRecentSearches(JSON.parse(saved).slice(0, 3));
    }, []);

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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setIsOpen(false);
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
        onSearch(search);
        setIsOpen(false);
    };

    const handleSearch = () => {
        if (query.trim()) {
            saveRecentSearch(query.trim());
            onSearch(query.trim());
        }
        setIsOpen(false);
    };

    const clearQuery = () => {
        setQuery('');
        onSearch('');
        inputRef.current?.focus();
    };

    const showDropdown = isOpen && (filteredTools.length > 0 || (query === '' && recentSearches.length > 0));

    return (
        <div className={cn("relative w-full", className)}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 h-14 bg-white text-gray-900 text-lg rounded-2xl border-0 shadow-xl focus:ring-2 focus:ring-white/50 focus:outline-none transition-all"
                />
                {query && (
                    <button
                        onClick={clearQuery}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ position: 'absolute' }}
                >
                    {/* Recent Searches */}
                    {query === '' && recentSearches.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Recent</p>
                            {recentSearches.map((search, idx) => (
                                <button
                                    key={search}
                                    onClick={() => handleRecentSearch(search)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                                        highlightedIndex === idx ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                                    )}
                                >
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search Results */}
                    {filteredTools.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Tools
                            </p>
                            {filteredTools.map((tool, idx) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelectTool(tool)}
                                    className={cn(
                                        "w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors group",
                                        highlightedIndex === idx ? "bg-blue-50" : "hover:bg-gray-50"
                                    )}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                        highlightedIndex === idx ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-50"
                                    )}>
                                        <Package className={cn(
                                            "h-5 w-5",
                                            highlightedIndex === idx ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "font-medium truncate",
                                            highlightedIndex === idx ? "text-blue-700" : "text-gray-900"
                                        )}>
                                            {highlightQuery(tool.name, query)}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                                        {tool.department_names && tool.department_names.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {tool.department_names.slice(0, 2).map((dept, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs py-0">{dept}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <ArrowRight className={cn(
                                        "h-4 w-4 mt-1 opacity-0 transition-opacity",
                                        highlightedIndex === idx ? "opacity-100 text-blue-500" : "group-hover:opacity-50"
                                    )} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.trim() && filteredTools.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No tools found for "{query}"</p>
                        </div>
                    )}

                    {/* Footer hint */}
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-500">↑↓</kbd> to navigate
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-500">Enter</kbd> to select
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-500">Esc</kbd> to close
                        </span>
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
        regex.test(part) ? <mark key={i} className="bg-yellow-200 text-inherit rounded px-0.5">{part}</mark> : part
    );
}
