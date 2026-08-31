import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function TunnelProfile({
  tunnel = {
    name: "TUNNEL-01 [CORE-DATACENTER]",
    remotePeer: "198.51.100.22",
    localEndpoint: "192.168.1.1",
    protocol: "IPsec IKEv1 ESP",
    ikeCipher: "AES-CBC-256 / SHA2-256",
    dhGroup: "Group 2 (1024-bit MODP) [WEAK]",
    espCipher: "3DES-CBC-168 / HMAC-SHA1 [DEPRECATED]",
    lifetime: "28,800s (8h)",
    status: "Degraded Posture"
  }
}) {
  return (
    <Card variant="container" padding="lg" rounded="2xl" className="bg-gradient-to-br from-surface-container to-surface-container-low">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-2xl">vpn_lock</span>
          </div>
          <div>
            <h4 className="font-display-lg text-base font-bold text-on-surface">
              {tunnel.name}
            </h4>
            <p className="text-xs font-mono text-outline">
              PEER: {tunnel.remotePeer} &harr; {tunnel.localEndpoint}
            </p>
          </div>
        </div>
        <Badge severity="critical">{tunnel.status}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-surface-container-low/90 border border-outline-variant/30 shadow-xs">
          <span className="text-outline block mb-1 font-semibold uppercase">PHASE 1 (IKE SA NEGOTIATION)</span>
          <p className="text-on-surface font-semibold">{tunnel.ikeCipher}</p>
          <p className="text-error mt-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">warning</span>
            {tunnel.dhGroup}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low/90 border border-outline-variant/30 shadow-xs">
          <span className="text-outline block mb-1 font-semibold uppercase">PHASE 2 (CHILD SA / ESP DATA)</span>
          <p className="text-error font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">error</span>
            {tunnel.espCipher}
          </p>
          <p className="text-on-surface-variant mt-1.5">LIFETIME: {tunnel.lifetime}</p>
        </div>
      </div>
    </Card>
  );
}

export function SecurityFeature({ icon, title, description }) {
  return (
    <Card variant="container" padding="md" rounded="xl" hover className="bg-surface-container/80">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-primary shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <h4 className="font-display-lg text-sm font-bold text-on-surface mb-1">
            {title}
          </h4>
          <p className="text-xs font-body-md text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TunnelProfile;
