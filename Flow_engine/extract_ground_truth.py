import sys
import json
from pathlib import Path
from scapy.all import rdpcap, IP, IPv6, TCP, UDP, ICMP
import numpy as np

PROJECT_PATH = Path(__file__).resolve().parent.parent
REPORTS_PATH = PROJECT_PATH / "Flow_engine" / "reports"
REPORTS_PATH.mkdir(parents=True, exist_ok=True)

pcap_file = PROJECT_PATH / "demo 1.pcapng"

if not pcap_file.exists():
    print(f"File not found: {pcap_file}")
    sys.exit(1)

packets = rdpcap(str(pcap_file))

stats = {
    "total_packet_count": len(packets),
    "ipv4_packet_count": 0,
    "ipv6_packet_count": 0,
    "tcp_count": 0,
    "udp_count": 0,
    "icmp_count": 0,
    "esp_protocol_50_count": 0,
    "ah_protocol_51_count": 0,
    "udp_500_count": 0,
    "udp_4500_count": 0,
    "source_ips": set(),
    "destination_ips": set(),
    "source_ports": set(),
    "destination_ports": set(),
    "packet_sizes": [],
}

flows = {}

for pkt in packets:
    stats["packet_sizes"].append(len(pkt))
    
    if IP in pkt:
        stats["ipv4_packet_count"] += 1
        src = pkt[IP].src
        dst = pkt[IP].dst
        proto = pkt[IP].proto
    elif IPv6 in pkt:
        stats["ipv6_packet_count"] += 1
        src = pkt[IPv6].src
        dst = pkt[IPv6].dst
        proto = pkt[IPv6].nh
    else:
        continue
        
    stats["source_ips"].add(src)
    stats["destination_ips"].add(dst)
    
    sport = 0
    dport = 0
    
    if TCP in pkt:
        stats["tcp_count"] += 1
        sport = pkt[TCP].sport
        dport = pkt[TCP].dport
    elif UDP in pkt:
        stats["udp_count"] += 1
        sport = pkt[UDP].sport
        dport = pkt[UDP].dport
        if sport == 500 or dport == 500:
            stats["udp_500_count"] += 1
        if sport == 4500 or dport == 4500:
            stats["udp_4500_count"] += 1
    elif ICMP in pkt:
        stats["icmp_count"] += 1
        
    if proto == 50:
        stats["esp_protocol_50_count"] += 1
    elif proto == 51:
        stats["ah_protocol_51_count"] += 1
        
    if sport != 0:
        stats["source_ports"].add(sport)
        stats["destination_ports"].add(dport)
        
    # Flow hash (bidirectional)
    flow_key = tuple(sorted([src, dst])) + tuple(sorted([sport, dport])) + (proto,)
    
    if flow_key not in flows:
        flows[flow_key] = {
            "packets": [],
            "bytes": 0,
            "timestamps": []
        }
        
    flows[flow_key]["packets"].append(pkt)
    flows[flow_key]["bytes"] += len(pkt)
    flows[flow_key]["timestamps"].append(float(pkt.time))


flow_stats = []
for key, flow in flows.items():
    timestamps = sorted(flow["timestamps"])
    duration = timestamps[-1] - timestamps[0] if len(timestamps) > 1 else 0.0
    
    iats = [timestamps[i] - timestamps[i-1] for i in range(1, len(timestamps))] if len(timestamps) > 1 else [0.0]
    
    flow_stats.append({
        "flow_key": str(key),
        "packet_count": len(flow["packets"]),
        "byte_count": flow["bytes"],
        "duration": duration,
        "iat_mean": float(np.mean(iats)),
        "iat_min": float(np.min(iats)),
        "iat_max": float(np.max(iats))
    })

stats["source_ips"] = list(stats["source_ips"])
stats["destination_ips"] = list(stats["destination_ips"])
stats["source_ports"] = list(stats["source_ports"])
stats["destination_ports"] = list(stats["destination_ports"])
stats["packet_sizes"] = {
    "min": int(np.min(stats["packet_sizes"])),
    "max": int(np.max(stats["packet_sizes"])),
    "mean": float(np.mean(stats["packet_sizes"]))
}

stats["flow_count"] = len(flows)
stats["flow_details"] = flow_stats

out_file = REPORTS_PATH / "demo1_ground_truth.json"
with open(out_file, "w") as f:
    json.dump(stats, f, indent=4)

print(f"Ground truth saved to {out_file}")
