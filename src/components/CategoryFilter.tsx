"use client";

import { motion } from "framer-motion";
import { Filter, Grid3X3, LayoutList } from "lucide-react";
import { getCategoryIcon } from "@/services/catalog";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  productCount: number;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  productCount,
}: CategoryFilterProps) {
  const allCategories = ["all", ...categories];

  return (
    <div className="bg-white rounded-xl border border-industrial-200 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Label */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent-500" />
          <span className="font-semibold text-industrial-900">
            Filtrar por Categoría
          </span>
          <span className="text-sm text-industrial-500 ml-2">
            ({productCount} productos)
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-accent-500 text-white shadow-md"
                      : "bg-industrial-100 text-industrial-700 hover:bg-industrial-200"
                  }
                `}
              >
                {category === "all" ? (
                  <>
                    <Grid3X3 className="w-4 h-4" />
                    Todos
                  </>
                ) : (
                  <>
                    <span>{getCategoryIcon(category)}</span>
                    {category}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
