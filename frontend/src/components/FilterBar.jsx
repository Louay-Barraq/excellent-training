import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FilterBar Component
 * 
 * @param {Array} data - The array of objects to filter
 * @param {Array} searchKeys - The keys of the objects to search against (e.g. ['nom', 'prenom'])
 * @param {Function} onFilter - Callback that receives the filtered array
 * @param {Array} filterConfigs - Optional configurations for dropdown filters
 *        Example: [{ key: 'role', label: 'Rôle', options: ['ADMIN', 'RESPONSABLE'] }]
 * @param {Boolean} showDateFilter - Whether to show date range inputs (not implemented here for simplicity but could be)
 */
const FilterBar = ({ 
  data = [], 
  searchKeys = [], 
  onFilter, 
  filterConfigs = [],
  placeholder = "Rechercher..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let filtered = [...data];

    // 1. apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        searchKeys.some(key => {
          const value = item[key];
          if (typeof value === 'string') return value.toLowerCase().includes(term);
          if (typeof value === 'number') return value.toString().includes(term);
          return false;
        })
      );
    }

    // 2. apply dropdown filters
    Object.keys(activeFilters).forEach(key => {
      const filterValue = activeFilters[key];
      if (filterValue && filterValue !== 'ALL') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          // Handle nested objects or direct values
          if (typeof itemValue === 'object' && itemValue !== null) {
            return itemValue.libelle === filterValue || itemValue.id?.toString() === filterValue;
          }
          return itemValue?.toString() === filterValue;
        });
      }
    });

    onFilter(filtered);
  }, [searchTerm, activeFilters, data]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAll = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasActiveFilters = searchTerm !== '' || Object.values(activeFilters).some(v => v && v !== 'ALL');

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-muted)] transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Toggle & Dropdowns */}
        <div className="flex gap-2">
          {filterConfigs.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all font-semibold text-xs uppercase tracking-widest ${
                isExpanded || hasActiveFilters 
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                  : 'bg-[var(--color-bg-main)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-indigo-500/50'
              }`}
            >
              <Filter size={16} />
              <span>Filtres</span>
              {hasActiveFilters && (
                <span className="flex items-center justify-center w-5 h-5 bg-white text-indigo-500 rounded-full text-[10px] font-bold">
                  { (searchTerm ? 1 : 0) + Object.values(activeFilters).filter(v => v && v !== 'ALL').length }
                </span>
              )}
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              <X size={16} />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && filterConfigs.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="overflow-hidden border-t border-[var(--color-border)] pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[var(--color-surface-hover)]/30 rounded-2xl border border-[var(--color-border)]">
              {filterConfigs.map(config => (
                <div key={config.key} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">
                    {config.label}
                  </label>
                  <div className="relative">
                    <select
                      value={activeFilters[config.key] || 'ALL'}
                      onChange={(e) => handleFilterChange(config.key, e.target.value)}
                      className="w-full appearance-none bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="ALL">Tous les {config.label.toLowerCase()}s</option>
                      {config.options.map(opt => {
                        const val = typeof opt === 'object' ? opt.value : opt;
                        const label = typeof opt === 'object' ? opt.label : opt;
                        return (
                          <option key={val} value={val}>{label}</option>
                        );
                      })}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
