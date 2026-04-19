"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icons } from "./Icons";

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  items: any[];
  onSelect: (item: any) => void;
  renderItem: (item: any) => React.ReactNode;
  filterFn: (item: any, query: string) => boolean;
  displayValue: (item: any) => string;
  selectedItem?: any;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder,
  items,
  onSelect,
  renderItem,
  filterFn,
  displayValue,
  selectedItem,
  required = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) => filterFn(item, query));

  const handleSelect = (item: any) => {
    onSelect(item);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      
      <div 
        className={`relative flex items-center bg-gray-50 border rounded-xl transition-all ${
          isOpen ? "border-[#1a8245] ring-2 ring-[#1a8245]/10" : "border-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 px-4 py-3 min-h-[48px] flex items-center">
          {selectedItem ? (
            <span className="text-sm font-semibold text-gray-900">{displayValue(selectedItem)}</span>
          ) : (
            <span className="text-sm font-medium text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="px-3 border-l border-gray-100 h-6 flex items-center">
            <Icons.ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-50">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1a8245]/20 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400 font-medium italic">Data tidak ditemukan.</p>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedItem && displayValue(selectedItem) === displayValue(item)
                      ? "bg-green-50 text-green-900 border-l-4 border-l-[#1a8245]"
                      : "hover:bg-gray-50 text-gray-700 hover:pl-4"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  {renderItem(item)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
