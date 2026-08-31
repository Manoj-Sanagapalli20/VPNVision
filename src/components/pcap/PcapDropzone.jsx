import React, { useState, useRef } from 'react';

export function PcapDropzone({ onFileSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`p-12 sm:p-16 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-[#2563eb] dark:border-[#3b82f6] bg-[#EFF6FF] dark:bg-[#1D2023] shadow-[0_0_20px_rgba(0,0,0,0.15)]'
          : 'border-[#CBD5E1] dark:border-[#363A3F] bg-[#FFFFFF] dark:bg-[#232629] hover:border-[#2563eb]/60 dark:hover:border-[#777E86] hover:bg-[#F8FAFC] dark:hover:bg-[#282C30]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pcap,.pcapng,.cap"
        onChange={(e) => e.target.files && onFileSelected(e.target.files[0])}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#E8EAED] mb-6 shadow-xs">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#17212B] dark:text-[#E8EAED] mb-2 tracking-tight uppercase">
          DROP PCAP HERE
        </h3>
        <p className="text-xs font-sans text-[#5F6B76] dark:text-[#A7ADB4] mb-6">
          or <span className="text-[#2563eb] dark:text-[#60a5fa] font-semibold underline underline-offset-4 cursor-pointer">browse local files</span> from your system
        </p>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#5F6B76] dark:text-[#A7ADB4]">
          <span className="px-3 py-1 rounded-md bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#E2E8F0] dark:border-[#363A3F] font-semibold">.PCAP</span>
          <span className="px-3 py-1 rounded-md bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#E2E8F0] dark:border-[#363A3F] font-semibold">.PCAPNG</span>
          <span className="px-3 py-1 rounded-md bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#E2E8F0] dark:border-[#363A3F] font-semibold">.CAP</span>
        </div>
      </div>
    </div>
  );
}

export default PcapDropzone;
