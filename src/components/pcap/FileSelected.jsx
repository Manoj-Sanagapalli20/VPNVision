import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function FileSelected({ fileName, fileSize, onAnalyze, onReset, loading }) {
  return (
    <Card variant="container" padding="lg" rounded="2xl" className="border-[#BFDBFE] dark:border-[#363A3F] bg-gradient-to-r from-[#FFFFFF] to-[#EFF6FF] dark:from-[#232629] dark:to-[#1D2023] shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#E8EAED] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">
              {fileName}
            </h4>
            <p className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] mt-0.5 font-medium">
              SIZE: <span className="text-[#17212B] dark:text-[#E8EAED] font-bold">{fileSize}</span> // STATUS: <span className="text-[#16a34a] dark:text-[#4ade80] font-bold">READY FOR INGEST</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={onReset}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="md"
            icon="rocket_launch"
            onClick={onAnalyze}
            loading={loading}
            className="flex-1 sm:flex-initial"
          >
            Run Deep Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FileSelected;
