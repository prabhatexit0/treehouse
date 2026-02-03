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
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (langValue: string) => {
        onChange(langValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {selectedLanguage && (
                    <>
                        <selectedLanguage.icon className="w-4 h-4" />
                        <span>{selectedLanguage.label}</span>
                    </>
                )}
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-white/20 rounded shadow-lg z-50 overflow-hidden">
                    {LANGUAGES.map((lang) => {
                        const Icon = lang.icon;
                        const isSelected = lang.value === value;

                        return (
                            <li key={lang.value}>
                                <button
                                    onClick={() => handleSelect(lang.value)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${isSelected
                                            ? 'bg-blue-600/30 text-blue-300'
                                            : 'text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{lang.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
