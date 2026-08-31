import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function PayloadLog({
  logs = [
    { id: "PKT-9901", time: "14:28:01.092", src: "192.168.1.104", dst: "198.51.100.22", proto: "ESP (50)", size: "1420 B", entropy: "7.989", verdict: "Normal ESP" },
    { id: "PKT-9902", time: "14:28:01.104", src: "192.168.1.104", dst: "198.51.100.22", proto: "ESP (50)", size: "1420 B", entropy: "7.991", verdict: "Normal ESP" },
    { id: "PKT-9903", time: "14:28:01.120", src: "192.168.1.189", dst: "203.0.113.88", proto: "UDP/500", size: "448 B", entropy: "6.210", verdict: "IKEv1 Aggressive" },
    { id: "PKT-9904", time: "14:28:01.145", src: "192.168.1.205", dst: "198.51.100.4", proto: "ESP (50)", size: "84 B", entropy: "7.840", verdict: "Keepalive / DPD" },
    { id: "PKT-9905", time: "14:28:01.198", src: "10.0.4.12", dst: "198.51.100.99", proto: "ESP (50)", size: "1500 B", entropy: "7.999", verdict: "3DES Signature" }
  ]
}) {
  return (
    <Card variant="container" padding="none" rounded="2xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
      <div className="p-4 sm:p-5 border-b border-[#F1F5F9] dark:border-[#282C30] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#E8EAED] shadow-2xs">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED]">
              Live Payload Heuristic Stream
            </h4>
            <span className="text-[11px] font-mono text-[#5F6B76] dark:text-[#A7ADB4] block font-medium">
              REAL-TIME DISSECTION &amp; SHANNON ENTROPY PROFILING
            </span>
          </div>
        </div>
        <span className="text-xs font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold bg-[#EFF6FF] dark:bg-[#1D2023] px-2.5 py-0.5 rounded border border-[#BFDBFE] dark:border-[#363A3F]">
          5 LATEST SAMPLES
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#F8FAFC] dark:bg-[#1D2023] text-[#5F6B76] dark:text-[#A7ADB4] border-b border-[#E2E8F0] dark:border-[#363A3F]">
            <tr>
              <th className="p-3.5 pl-5 font-bold uppercase tracking-wider text-[11px]">ID</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">TIMESTAMP</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">SRC &rarr; DST</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">PROTO</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">SIZE</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">SCORE/ENTROPY</th>
              <th className="p-3.5 pr-5 font-bold uppercase tracking-wider text-[11px]">VERDICT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#282C30]">
            {logs.map((row) => (
              <tr key={row.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#282C30] transition-colors">
                <td className="p-3.5 pl-5 text-[#2563eb] dark:text-[#60a5fa] font-bold">{row.id}</td>
                <td className="p-3.5 text-[#5F6B76] dark:text-[#777E86]">{row.time}</td>
                <td className="p-3.5 text-[#17212B] dark:text-[#E8EAED] font-medium">{row.src} &rarr; {row.dst}</td>
                <td className="p-3.5 text-[#475569] dark:text-[#A7ADB4] font-medium">{row.proto}</td>
                <td className="p-3.5 text-[#5F6B76] dark:text-[#777E86]">{row.size}</td>
                <td className="p-3.5 font-bold text-[#17212B] dark:text-[#E8EAED]">{row.entropy}</td>
                <td className="p-3.5 pr-5">
                  <Badge
                    severity={
                      row.verdict.includes('Normal')
                        ? 'passed'
                        : row.verdict.includes('Keepalive')
                        ? 'medium'
                        : 'critical'
                    }
                  >
                    {row.verdict}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default PayloadLog;
