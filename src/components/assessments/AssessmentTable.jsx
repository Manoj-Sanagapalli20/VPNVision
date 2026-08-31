import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function AssessmentStats({ assessments = [] }) {
  const total = assessments.length;
  const criticalTotal = assessments.reduce((acc, a) => acc + (a.criticalCount || 0), 0);
  const avgScore = total > 0 ? Math.round(assessments.reduce((acc, a) => acc + a.score, 0) / total) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card variant="container" padding="md" rounded="xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] block font-bold">
          TOTAL COMPLETED ASSESSMENTS
        </span>
        <p className="font-display text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] mt-1.5">
          {total} AUDITS
        </p>
      </Card>

      <Card variant="container" padding="md" rounded="xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] block font-bold">
          AVERAGE HEALTH INDEX
        </span>
        <p className="font-display text-3xl font-extrabold text-[#2563eb] dark:text-[#E8EAED] mt-1.5">
          {avgScore} / 100
        </p>
      </Card>

      <Card variant="container" padding="md" rounded="xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] block font-bold">
          AGGREGATE CRITICAL ISSUES
        </span>
        <p className="font-display text-3xl font-extrabold text-[#dc2626] dark:text-[#f87171] mt-1.5">
          {criticalTotal} VULNERABILITIES
        </p>
      </Card>
    </div>
  );
}

export function AssessmentTable({ assessments = [], onRunNewScan }) {
  return (
    <Card variant="container" padding="none" rounded="2xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
      <div className="p-5 border-b border-[#F1F5F9] dark:border-[#282C30] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED]">
            Historical Cryptographic Audits
          </h4>
          <p className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-medium">
            RECORDED SA DISSECTIONS &amp; SECURITY POLICIES
          </p>
        </div>
        <button
          type="button"
          onClick={onRunNewScan}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>NEW AUDIT SCAN</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#F8FAFC] dark:bg-[#1D2023] text-[#5F6B76] dark:text-[#A7ADB4] border-b border-[#E2E8F0] dark:border-[#363A3F]">
            <tr>
              <th className="p-3.5 pl-5 font-bold uppercase tracking-wider text-[11px]">AUDIT ID</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">TARGET SCOPE</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">SCAN TYPE</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">PACKET VOLUME</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">TIMESTAMP</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">POSTURE</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">STATUS</th>
              <th className="p-3.5 pr-5 font-bold uppercase tracking-wider text-[11px] text-right">DOSSIER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#282C30]">
            {assessments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#5F6B76] dark:text-[#A7ADB4]">
                  <span className="material-symbols-outlined text-3xl text-[#8A949E] dark:text-[#777E86] block mb-2">
                    verified_user
                  </span>
                  <p className="font-semibold text-sm text-[#17212B] dark:text-[#E8EAED]">
                    No PCAP Audits Recorded in Current Session
                  </p>
                  <p className="text-xs text-[#8A949E] dark:text-[#777E86] mt-1">
                    Upload and analyze a PCAP capture file to automatically populate live security assessments.
                  </p>
                </td>
              </tr>
            ) : (
              assessments.map((a) => (
                <tr key={a.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#282C30] transition-colors">
                  <td className="p-3.5 pl-5 text-[#2563eb] dark:text-[#60a5fa] font-bold">{a.id}</td>
                  <td className="p-3.5 text-[#17212B] dark:text-[#E8EAED] font-semibold">{a.name}</td>
                  <td className="p-3.5 text-[#475569] dark:text-[#A7ADB4]">{a.type}</td>
                  <td className="p-3.5 text-[#5F6B76] dark:text-[#777E86]">{a.packets}</td>
                  <td className="p-3.5 text-[#8A949E] dark:text-[#777E86]">{a.date}</td>
                  <td className="p-3.5">
                    <span
                      className={`font-bold ${
                        a.score >= 80
                          ? 'text-[#16a34a] dark:text-[#4ade80]'
                          : a.score >= 60
                          ? 'text-[#2563eb] dark:text-[#60a5fa]'
                          : 'text-[#dc2626] dark:text-[#f87171]'
                      }`}
                    >
                      {a.score}/100
                    </span>
                  </td>
                  <td className="p-3.5">
                    <Badge severity={a.status === 'Compliant' ? 'passed' : 'critical'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <button
                      type="button"
                      onClick={() => onRunNewScan ? onRunNewScan(a) : null}
                      className="px-2.5 py-1 rounded bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[#2563eb] dark:text-[#60a5fa] font-mono text-[11px] font-bold hover:bg-[#DBEAFE] dark:hover:bg-[#282C30] transition-all cursor-pointer inline-flex items-center gap-1"
                      title="View & Print Report"
                    >
                      <span className="material-symbols-outlined text-xs">print</span>
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default AssessmentTable;
