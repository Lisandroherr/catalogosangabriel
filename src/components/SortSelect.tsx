"use client";

import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const options = [
    { value: "nombre", label: "Nombre A-Z" },
    { value: "precio-asc", label: "Precio: Menor a Mayor" },
    { value: "precio-desc", label: "Precio: Mayor a Menor" },
    { value: "referencia", label: "Referencia" },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ArrowUpDown className="w-5 h-5 text-industrial-400" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full md:w-auto pl-12 pr-8 py-3 bg-white border border-industrial-200 rounded-xl text-industrial-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-industrial-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
