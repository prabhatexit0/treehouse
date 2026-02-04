import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    FileJson,
    Braces,
    FileCode,
    FileType,
    Component,
    Code2,
} from 'lucide-react';

// Language configuration with icons
const LANGUAGES = [
    { value: 'json', label: 'JSON', icon: FileJson },
    { value: 'rust', label: 'Rust', icon: Braces },
    { value: 'javascript', label: 'JavaScript', icon: FileCode },
    { value: 'typescript', label: 'TypeScript', icon: FileType },
    { value: 'tsx', label: 'TSX (React)', icon: Component },
    { value: 'python', label: 'Python', icon: Code2 },
    { value: 'go', label: 'Go', icon: Code2 },
    { value: 'ocaml', label: 'OCaml', icon: Code2 },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (language: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = LANGUAGES.find((lang) => lang.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (langValue: string) => {
        onChange(langValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button - larger touch target on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 md:py-1.5 text-sm bg-white/10 border border-white/20 rounded hover:bg-white/15 active:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] md:min-h-0"
            >
                {selectedLanguage && (
                    <>
                        <selectedLanguage.icon className="w-4 h-4" />
                        <span>{selectedLanguage.label}</span>
                    </>
                )}
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <>
                    {/* Mobile overlay backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <ul className="absolute right-0 mt-2 w-56 md:w-48 bg-[#1e1e1e] border border-white/20 rounded-lg shadow-lg z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
                        {LANGUAGES.map((lang) => {
                            const Icon = lang.icon;
                            const isSelected = lang.value === value;

                            return (
                                <li key={lang.value}>
                                    <button
                                        onClick={() => handleSelect(lang.value)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 md:py-2.5 text-sm text-left transition-colors min-h-[48px] md:min-h-0 ${
                                            isSelected
                                                ? 'bg-blue-600/30 text-blue-300'
                                                : 'text-gray-300 hover:bg-white/10 active:bg-white/15'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" />
                                        <span>{lang.label}</span>
                                        {isSelected && (
                                            <span className="ml-auto text-blue-400">✓</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
