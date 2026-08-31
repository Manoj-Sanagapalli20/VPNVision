import React from 'react';

export function FindingsToolbar({
  searchQuery,
  onSearchChange,
  activeSeverity,
  onClearFilter,
  sortBy = 'Severity',
  onSortChange = () => {}
}) {
  return (
    <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8A949E] dark:text-[#777E86] text-base">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search findings by cipher suite, protocol, CVE, or evidence..."
          className="w-full pl-9 pr-8 py-2 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-lg text-xs text-[#17212B] dark:text-[#E8EAED] placeholder:text-[#8A949E] dark:placeholder:text-[#777E86] focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A949E] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED]"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        )}
      </div>

      {/* Filter Tag & Sort Control */}
      <div className="flex items-center gap-3">
        {activeSeverity && (
          <button
            type="button"
            onClick={onClearFilter}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[#1D4ED8] dark:text-[#E8EAED] font-bold hover:bg-[#DBEAFE] dark:hover:bg-[#282C30] transition-colors cursor-pointer"
          >
            <span>FILTER: {activeSeverity.toUpperCase()}</span>
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        )}

        {/* Sort selector */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] px-3 py-2 rounded-lg text-[#5F6B76] dark:text-[#A7ADB4]">
          <span className="text-[#8A949E] dark:text-[#777E86] uppercase font-bold text-[10px]">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-[#17212B] dark:text-[#E8EAED] font-bold focus:outline-none cursor-pointer"
          >
            <option value="Severity" className="bg-[#FFFFFF] dark:bg-[#232629]">Severity ▼</option>
            <option value="ID" className="bg-[#FFFFFF] dark:bg-[#232629]">Vulnerability ID</option>
            <option value="Protocol" className="bg-[#FFFFFF] dark:bg-[#232629]">Protocol Suite</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FindingsToolbar;
