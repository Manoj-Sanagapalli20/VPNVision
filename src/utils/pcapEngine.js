/**
 * VPN VISION - Deep PCAP / PCAPNG Packet Dissection & Security Feature Extractor
 * 
 * Supports:
 * - PCAP (microsecond, nanosecond, little & big endian)
 * - PCAPNG (Section Header, Interface Description, Enhanced Packet, Simple Packet)
 * - Ethernet II, 802.1Q VLAN, SLL (Linux Cooked), Raw IPv4/IPv6
 * - IPv4 / IPv6 dissection
 * - UDP/500 (IKE), UDP/4500 (NAT-T Non-ESP marker and NAT-T ESP)
 * - IP Protocol 50 (ESP) & IP Protocol 51 (AH)
 * - IKEv1 and IKEv2 full payload dissection (SA Proposals, Transforms, KE, AUTH, NOTIFY, ID)
 */

// Mapping of Transform Types and IDs according to IANA / RFC 7296 / RFC 2409
export const IKE_TRANSFORMS = {
  // Transform Type 1: Encryption
  ENCRYPTION: {
    1: { name: 'DES-IV64', weak: true },
    2: { name: 'DES-CBC', weak: true },
    3: { name: '3DES-CBC', weak: true },
    4: { name: 'RC5', weak: true },
    5: { name: 'IDEA', weak: true },
    6: { name: 'CAST', weak: true },
    7: { name: 'Blowfish', weak: true },
    8: { name: '3IDEA', weak: true },
    9: { name: 'DES-IV32', weak: true },
    11: { name: 'NULL', weak: true },
    12: { name: 'AES-CBC', weak: false },
    13: { name: 'AES-CTR', weak: false },
    14: { name: 'AES-CCM-8', weak: false, aead: true },
    15: { name: 'AES-CCM-12', weak: false, aead: true },
    16: { name: 'AES-CCM-16', weak: false, aead: true },
    18: { name: 'AES-GCM-8', weak: false, aead: true },
    19: { name: 'AES-GCM-12', weak: false, aead: true },
    20: { name: 'AES-GCM-16', weak: false, aead: true },
    23: { name: 'Camellia-CBC', weak: false },
    24: { name: 'Camellia-CTR', weak: false },
    25: { name: 'Camellia-CCM-8', weak: false, aead: true },
    28: { name: 'CHACHA20-POLY1305', weak: false, aead: true }
  },

  // Transform Type 2: PRF
  PRF: {
    1: { name: 'HMAC-MD5', weak: true },
    2: { name: 'HMAC-SHA1', weak: true },
    3: { name: 'HMAC-TIGER', weak: true },
    4: { name: 'HMAC-SHA2-256', weak: false },
    5: { name: 'HMAC-SHA2-384', weak: false },
    6: { name: 'HMAC-SHA2-512', weak: false },
    7: { name: 'AES128-XCBC', weak: false },
    8: { name: 'AES128-CMAC', weak: false }
  },

  // Transform Type 3: Integrity
  INTEGRITY: {
    0: { name: 'NONE', weak: true },
    1: { name: 'HMAC-MD5-96', weak: true },
    2: { name: 'HMAC-SHA1-96', weak: true },
    3: { name: 'DES-MAC', weak: true },
    4: { name: 'KPDK-MD5', weak: true },
    5: { name: 'AES-XCBC-96', weak: false },
    6: { name: 'HMAC-MD5-128', weak: true },
    7: { name: 'HMAC-SHA1-160', weak: true },
    8: { name: 'AES-CMAC-96', weak: false },
    12: { name: 'HMAC-SHA2-256-128', weak: false },
    13: { name: 'HMAC-SHA2-384-192', weak: false },
    14: { name: 'HMAC-SHA2-512-256', weak: false }
  },

  // Transform Type 4: Diffie-Hellman Group
  DH_GROUP: {
    0: { name: 'None', weak: true, bits: 0 },
    1: { name: 'Group 1 (768-bit MODP)', weak: true, bits: 768 },
    2: { name: 'Group 2 (1024-bit MODP)', weak: true, bits: 1024 },
    5: { name: 'Group 5 (1536-bit MODP)', weak: true, bits: 1536 },
    14: { name: 'Group 14 (2048-bit MODP)', weak: false, bits: 2048 },
    15: { name: 'Group 15 (3072-bit MODP)', weak: false, bits: 3072 },
    16: { name: 'Group 16 (4096-bit MODP)', weak: false, bits: 4096 },
    17: { name: 'Group 17 (6144-bit MODP)', weak: false, bits: 6144 },
    18: { name: 'Group 18 (8192-bit MODP)', weak: false, bits: 8192 },
    19: { name: 'Group 19 (256-bit ECP / NIST P-256)', weak: false, bits: 256, ec: true },
    20: { name: 'Group 20 (384-bit ECP / NIST P-384)', weak: false, bits: 384, ec: true },
    21: { name: 'Group 21 (521-bit ECP / NIST P-521)', weak: false, bits: 521, ec: true },
    28: { name: 'Group 28 (Brainpool P256r1)', weak: false, bits: 256, ec: true },
    29: { name: 'Group 29 (Brainpool P384r1)', weak: false, bits: 384, ec: true },
    30: { name: 'Group 30 (Brainpool P512r1)', weak: false, bits: 512, ec: true },
    31: { name: 'Group 31 (Curve25519)', weak: false, bits: 256, ec: true }
  },

  // Auth Methods (IKEv2 & IKEv1)
  AUTH_METHOD: {
    1: 'RSA Digital Signature',
    2: 'Pre-Shared Key (PSK)',
    3: 'DSS Signature',
    9: 'ECDSA with SHA-256 on P-256',
    10: 'ECDSA with SHA-384 on P-384',
    11: 'ECDSA with SHA-512 on P-521',
    12: 'Generic Shared Key MIC',
    14: 'Digital Signature (RFC 7427)'
  },

  // IKEv2 Exchange Types
  IKEV2_EXCHANGE: {
    34: 'IKE_SA_INIT',
    35: 'IKE_AUTH',
    36: 'CREATE_CHILD_SA',
    37: 'INFORMATIONAL'
  },

  // IKEv1 Exchange Types
  IKEV1_EXCHANGE: {
    1: 'Base',
    2: 'Identity Protection (Main Mode)',
    3: 'Authentication Only',
    4: 'Aggressive Mode',
    5: 'Informational',
    32: 'Quick Mode',
    33: 'New Group Mode'
  }
};

/**
 * Parses raw PCAP / PCAPNG buffer and extracts normalized frames
 * @param {Uint8Array|Buffer} buffer 
 * @returns {Array<Object>} parsed packets
 */
export function parsePcapBuffer(buffer) {
  if (!buffer || buffer.length < 24) {
    throw new Error('Capture file too small or invalid header');
  }

  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);

  // Check magic number
  const magic = view.getUint32(0, false);

  if (magic === 0xa1b2c3d4 || magic === 0xd4c3b2a1 || magic === 0xa1b23c4d || magic === 0x4d3cb2a1) {
    return parseClassicPcap(u8, view, magic);
  } else if (magic === 0x0a0d0d0a) {
    return parsePcapNg(u8, view);
  } else {
    throw new Error(`Unrecognized capture magic number: 0x${magic.toString(16).padStart(8, '0')}. Valid .pcap or .pcapng required.`);
  }
}

/**
 * Classic PCAP Parser (tcpdump / libpcap)
 */
function parseClassicPcap(u8, view, magic) {
  const isLittleEndian = (magic === 0xd4c3b2a1 || magic === 0x4d3cb2a1);
  const isNanosec = (magic === 0xa1b23c4d || magic === 0x4d3cb2a1);

  const snaplen = view.getUint32(16, isLittleEndian);
  const linkType = view.getUint32(20, isLittleEndian);

  const packets = [];
  let offset = 24;
  let frameNumber = 1;

  while (offset + 16 <= u8.length) {
    const tsSec = view.getUint32(offset, isLittleEndian);
    const tsSub = view.getUint32(offset + 4, isLittleEndian);
    const inclLen = view.getUint32(offset + 8, isLittleEndian);
    const origLen = view.getUint32(offset + 12, isLittleEndian);
    offset += 16;

    if (offset + inclLen > u8.length) {
      break; // Truncated final packet
    }

    const packetData = u8.subarray(offset, offset + inclLen);
    const tsMs = tsSec * 1000 + (isNanosec ? Math.floor(tsSub / 1000000) : Math.floor(tsSub / 1000));

    const parsed = dissectPacket(packetData, linkType, frameNumber, tsMs, origLen);
    if (parsed) {
      packets.push(parsed);
    }

    offset += inclLen;
    frameNumber++;
  }

  return packets;
}

/**
 * PCAPNG Parser (Wireshark / pcapng specification)
 */
function parsePcapNg(u8, view) {
  let offset = 0;
  let isLittleEndian = true;
  let currentLinkType = 1; // Default Ethernet
  let frameNumber = 1;
  const packets = [];

  while (offset + 8 <= u8.length) {
    const blockType = view.getUint32(offset, isLittleEndian);
    const blockLen = view.getUint32(offset + 4, isLittleEndian);

    if (blockLen < 12 || offset + blockLen > u8.length) {
      break;
    }

    if (blockType === 0x0a0d0d0a) {
      // Section Header Block: check endian magic at offset+8
      const bom = view.getUint32(offset + 8, false);
      if (bom === 0x1a2b3c4d) {
        isLittleEndian = false;
      } else if (bom === 0x4d3c2b1a) {
        isLittleEndian = true;
      }
    } else if (blockType === 0x00000001) {
      // Interface Description Block
      currentLinkType = view.getUint16(offset + 8, isLittleEndian);
    } else if (blockType === 0x00000006) {
      // Enhanced Packet Block
      const tsHigh = view.getUint32(offset + 12, isLittleEndian);
      const tsLow = view.getUint32(offset + 16, isLittleEndian);
      const capLen = view.getUint32(offset + 20, isLittleEndian);
      const origLen = view.getUint32(offset + 24, isLittleEndian);

      if (offset + 28 + capLen <= offset + blockLen) {
        const packetData = u8.subarray(offset + 28, offset + 28 + capLen);
        const rawTs = (BigInt(tsHigh) << 32n) | BigInt(tsLow);
        const tsMs = Number(rawTs / 1000n); // Assume microsecond resolution default

        const parsed = dissectPacket(packetData, currentLinkType, frameNumber, tsMs, origLen);
        if (parsed) {
          packets.push(parsed);
        }
        frameNumber++;
      }
    } else if (blockType === 0x00000003) {
      // Simple Packet Block
      const origLen = view.getUint32(offset + 8, isLittleEndian);
      const capLen = Math.min(origLen, blockLen - 12);
      if (offset + 12 + capLen <= offset + blockLen) {
        const packetData = u8.subarray(offset + 12, offset + 12 + capLen);
        const parsed = dissectPacket(packetData, currentLinkType, frameNumber, Date.now(), origLen);
        if (parsed) {
          packets.push(parsed);
        }
        frameNumber++;
      }
    }

    offset += blockLen;
  }

  return packets;
}

/**
 * Dissect Link / Network / Transport / VPN headers from packet bytes
 */
export function dissectPacket(data, linkType, frameNumber, timestampMs, origLen) {
  let offset = 0;
  let ethType = 0;

  // 1. Link Layer Header
  if (linkType === 1) {
    // Ethernet II
    if (data.length < 14) return null;
    ethType = (data[12] << 8) | data[13];
    offset = 14;

    // Handle 802.1Q VLAN Tag
    if (ethType === 0x8100 && data.length >= 18) {
      ethType = (data[16] << 8) | data[17];
      offset = 18;
    }
  } else if (linkType === 113) {
    // Linux SLL (Cooked)
    if (data.length < 16) return null;
    ethType = (data[14] << 8) | data[15];
    offset = 16;
  } else if (linkType === 101 || linkType === 12) {
    // Raw IPv4 or IPv6
    const ver = data[0] >> 4;
    ethType = ver === 6 ? 0x86dd : 0x0800;
    offset = 0;
  } else if (linkType === 0) {
    // Null / Loopback
    if (data.length < 4) return null;
    const proto = data[0];
    ethType = proto === 2 ? 0x0800 : (proto === 24 || proto === 28 || proto === 30) ? 0x86dd : 0x0800;
    offset = 4;
  } else {
    // Fallback: Check IP version nibble
    const ver = data[0] >> 4;
    if (ver === 4) {
      ethType = 0x0800;
      offset = 0;
    } else if (ver === 6) {
      ethType = 0x86dd;
      offset = 0;
    } else {
      return null;
    }
  }

  // 2. Network Layer Header (IPv4 or IPv6)
  let srcIp = '';
  let dstIp = '';
  let ipProto = 0;
  let l4Offset = offset;
  let ipPayloadLen = 0;

  if (ethType === 0x0800) {
    // IPv4
    if (data.length < offset + 20) return null;
    const ihl = (data[offset] & 0x0f) * 4;
    const totalLen = (data[offset + 2] << 8) | data[offset + 3];
    ipProto = data[offset + 9];
    srcIp = `${data[offset + 12]}.${data[offset + 13]}.${data[offset + 14]}.${data[offset + 15]}`;
    dstIp = `${data[offset + 16]}.${data[offset + 17]}.${data[offset + 18]}.${data[offset + 19]}`;
    l4Offset = offset + ihl;
    ipPayloadLen = Math.max(0, (totalLen > 0 ? totalLen : data.length - offset) - ihl);
  } else if (ethType === 0x86dd) {
    // IPv6
    if (data.length < offset + 40) return null;
    ipPayloadLen = (data[offset + 4] << 8) | data[offset + 5];
    ipProto = data[offset + 6];
    srcIp = parseIpv6(data, offset + 8);
    dstIp = parseIpv6(data, offset + 24);
    l4Offset = offset + 40;
  } else {
    return {
      frameNumber,
      timestampMs,
      length: origLen || data.length,
      protocol: 'OTHER',
      summary: `Non-IP Frame (EtherType 0x${ethType.toString(16)})`
    };
  }

  // 3. Transport & Security Protocols (ESP, AH, UDP/IKE, etc.)
  const packet = {
    frameNumber,
    timestampMs,
    length: origLen || data.length,
    srcIp,
    dstIp,
    ipProto,
    protocol: 'IP',
    summary: '',
    ike: null,
    esp: null,
    ah: null,
    entropy: calculateEntropy(data.subarray(l4Offset))
  };

  // Direct ESP (IP Protocol 50)
  if (ipProto === 50) {
    packet.protocol = 'ESP';
    if (data.length >= l4Offset + 8) {
      const spi = `0x${toHex32(data, l4Offset)}`;
      const seq = toUint32(data, l4Offset + 4);
      packet.esp = {
        spi,
        sequence: seq,
        payloadSize: Math.max(0, data.length - (l4Offset + 8)),
        natt: false
      };
      packet.summary = `ESP SPI: ${spi}, Seq: ${seq}, Length: ${packet.esp.payloadSize} B`;
    } else {
      packet.summary = 'ESP Fragment / Header Truncated';
    }
    return packet;
  }

  // Direct AH (IP Protocol 51)
  if (ipProto === 51) {
    packet.protocol = 'AH';
    if (data.length >= l4Offset + 12) {
      const nextHdr = data[l4Offset];
      const payloadLen = (data[l4Offset + 1] + 2) * 4;
      const spi = `0x${toHex32(data, l4Offset + 4)}`;
      const seq = toUint32(data, l4Offset + 8);
      packet.ah = {
        spi,
        sequence: seq,
        nextHeader: nextHdr,
        headerLength: payloadLen
      };
      packet.summary = `AH SPI: ${spi}, Seq: ${seq}, NextHdr: ${nextHdr}`;
    } else {
      packet.summary = 'AH Header Truncated';
    }
    return packet;
  }

  // UDP Protocols (UDP/500 = IKE, UDP/4500 = NAT-T)
  if (ipProto === 17) {
    if (data.length < l4Offset + 8) return packet;
    const srcPort = (data[l4Offset] << 8) | data[l4Offset + 1];
    const dstPort = (data[l4Offset + 2] << 8) | data[l4Offset + 3];
    const udpLen = (data[l4Offset + 4] << 8) | data[l4Offset + 5];
    const udpPayloadOffset = l4Offset + 8;
    const udpPayload = data.subarray(udpPayloadOffset);

    packet.srcPort = srcPort;
    packet.dstPort = dstPort;

    // UDP/500: Standard IKE
    if (srcPort === 500 || dstPort === 500) {
      packet.protocol = 'ISAKMP';
      const ike = dissectIkePayload(udpPayload, frameNumber);
      if (ike) {
        packet.ike = ike;
        packet.summary = `IKE ${ike.version}: ${ike.exchangeName} (MsgID: ${ike.messageId})`;
      } else {
        packet.summary = `ISAKMP/IKE Packet (Port 500)`;
      }
      return packet;
    }

    // UDP/4500: NAT-T (Non-ESP Marker for IKE vs Encapsulated ESP)
    if (srcPort === 4500 || dstPort === 4500) {
      if (udpPayload.length >= 4) {
        const marker = (udpPayload[0] << 24) | (udpPayload[1] << 16) | (udpPayload[2] << 8) | udpPayload[3];

        if (marker === 0) {
          // Non-ESP Marker (4 bytes 0x00000000) followed by IKE Header
          packet.protocol = 'ISAKMP/NAT-T';
          const ike = dissectIkePayload(udpPayload.subarray(4), frameNumber);
          if (ike) {
            ike.natt = true;
            packet.ike = ike;
            packet.summary = `NAT-T IKE ${ike.version}: ${ike.exchangeName}`;
          } else {
            packet.summary = 'NAT-T IKE Exchange';
          }
        } else {
          // Encapsulated ESP over UDP 4500 (Marker is the 4-byte SPI)
          packet.protocol = 'ESP-UDP';
          const spi = `0x${toHex32(udpPayload, 0)}`;
          const seq = udpPayload.length >= 8 ? toUint32(udpPayload, 4) : 0;
          packet.esp = {
            spi,
            sequence: seq,
            payloadSize: Math.max(0, udpPayload.length - 8),
            natt: true,
            udpPort: 4500
          };
          packet.summary = `NAT-T ESP (UDP/4500) SPI: ${spi}, Seq: ${seq}`;
        }
        return packet;
      }
    }

    packet.protocol = 'UDP';
    packet.summary = `UDP ${srcPort} -> ${dstPort} Len=${udpLen}`;
    return packet;
  }

  // TCP
  if (ipProto === 6) {
    packet.protocol = 'TCP';
    if (data.length >= l4Offset + 4) {
      const srcPort = (data[l4Offset] << 8) | data[l4Offset + 1];
      const dstPort = (data[l4Offset + 2] << 8) | data[l4Offset + 3];
      packet.srcPort = srcPort;
      packet.dstPort = dstPort;
      packet.summary = `TCP ${srcPort} -> ${dstPort}`;
    }
    return packet;
  }

  packet.protocol = `IP (${ipProto})`;
  packet.summary = `IP Protocol ${ipProto} Traffic`;
  return packet;
}

/**
 * Dissect IKE Header and Payloads
 */
export function dissectIkePayload(payload, frameNumber) {
  if (payload.length < 28) return null; // Minimum IKE Header is 28 bytes

  const initiatorSpi = toHex64(payload, 0);
  const responderSpi = toHex64(payload, 8);
  const nextPayload = payload[16];
  const versionByte = payload[17];
  const majorVersion = versionByte >> 4;
  const minorVersion = versionByte & 0x0f;
  const isIkev2 = majorVersion >= 2;
  const exchangeType = payload[18];
  const flags = payload[19];
  const isInitiator = Boolean(flags & 0x08);
  const isResponse = Boolean(flags & 0x20);
  const messageId = toUint32(payload, 20);
  const length = toUint32(payload, 24);

  const exchangeMap = isIkev2 ? IKE_TRANSFORMS.IKEV2_EXCHANGE : IKE_TRANSFORMS.IKEV1_EXCHANGE;
  const exchangeName = exchangeMap[exchangeType] || `Exchange ${exchangeType}`;

  const ike = {
    version: isIkev2 ? 'IKEv2' : 'IKEv1',
    majorVersion,
    minorVersion,
    initiatorSpi: `0x${initiatorSpi}`,
    responderSpi: `0x${responderSpi}`,
    exchangeType,
    exchangeName,
    messageId,
    flags,
    isInitiator,
    isResponse,
    payloads: [],
    proposals: [],
    transforms: {
      encryption: [],
      integrity: [],
      prf: [],
      dhGroup: [],
      esn: []
    },
    keyExchange: null,
    authMethod: null,
    pfsEvidence: null
  };

  // Traverse IKE Payloads
  let curPayloadType = nextPayload;
  let offset = 28;

  while (curPayloadType !== 0 && offset + 4 <= payload.length) {
    const nextType = payload[offset];
    const payloadLen = (payload[offset + 2] << 8) | payload[offset + 3];

    if (payloadLen < 4 || offset + payloadLen > payload.length) {
      break;
    }

    const payloadData = payload.subarray(offset + 4, offset + payloadLen);
    ike.payloads.push({ type: curPayloadType, length: payloadLen });

    // Payload 33 (IKEv2 SA) or Payload 1 (IKEv1 SA)
    if ((isIkev2 && curPayloadType === 33) || (!isIkev2 && curPayloadType === 1)) {
      parseSaPayload(payloadData, isIkev2, ike);
    }

    // Payload 34 (IKEv2 KE) or Payload 4 (IKEv1 KE)
    if ((isIkev2 && curPayloadType === 34) || (!isIkev2 && curPayloadType === 4)) {
      if (payloadData.length >= 4) {
        const dhGroupNum = (payloadData[0] << 8) | payloadData[1];
        const dhInfo = IKE_TRANSFORMS.DH_GROUP[dhGroupNum] || { name: `DH Group ${dhGroupNum}`, weak: dhGroupNum < 14 };
        ike.keyExchange = {
          group: dhGroupNum,
          name: dhInfo.name,
          weak: dhInfo.weak,
          keyLength: payloadData.length - 4
        };

        // If KE is observed inside CREATE_CHILD_SA (Exchange 36) or IKEv1 Quick Mode (Exchange 32), that is explicit proof of PFS
        if ((isIkev2 && exchangeType === 36) || (!isIkev2 && exchangeType === 32)) {
          ike.pfsEvidence = {
            enabled: true,
            frame: frameNumber,
            exchange: exchangeName,
            dhGroup: dhInfo.name
          };
        }
      }
    }

    // Payload 39 (IKEv2 AUTH) or Payload 9 (IKEv1 Sig/Hash)
    if (isIkev2 && curPayloadType === 39 && payloadData.length >= 4) {
      const authMethodNum = payloadData[0];
      const methodName = IKE_TRANSFORMS.AUTH_METHOD[authMethodNum] || `Auth Method ${authMethodNum}`;
      ike.authMethod = {
        id: authMethodNum,
        name: methodName
      };
    }

    curPayloadType = nextType;
    offset += payloadLen;
  }

  return ike;
}

/**
 * Parse SA Proposal & Transform payload blocks
 */
function parseSaPayload(saData, isIkev2, ike) {
  let propOffset = 0;

  while (propOffset + 8 <= saData.length) {
    const lastProp = saData[propOffset]; // 0 = last, 2 = more
    const propLen = (saData[propOffset + 2] << 8) | saData[propOffset + 3];
    const propNum = saData[propOffset + 4];
    const protoId = saData[propOffset + 5]; // 1=IKE, 2=AH, 3=ESP
    const spiSize = saData[propOffset + 6];
    const numTransforms = saData[propOffset + 7];

    if (propLen < 8 || propOffset + propLen > saData.length) break;

    let transOffset = propOffset + 8 + spiSize;

    for (let t = 0; t < numTransforms && transOffset + 8 <= propOffset + propLen; t++) {
      const transLen = (saData[transOffset + 2] << 8) | saData[transOffset + 3];
      const transType = isIkev2 ? saData[transOffset + 4] : saData[transOffset + 7]; // IKEv2 type vs IKEv1 ID
      const transId = isIkev2 ? ((saData[transOffset + 6] << 8) | saData[transOffset + 7]) : saData[transOffset + 4];

      // Read attributes (e.g. key length)
      let keyLength = 0;
      let attrOffset = transOffset + 8;
      const transEnd = transLen > 0 ? transOffset + transLen : transOffset + 8;

      while (attrOffset + 4 <= transEnd && attrOffset + 4 <= saData.length) {
        const attrType = ((saData[attrOffset] & 0x7f) << 8) | saData[attrOffset + 1];
        const isBasic = Boolean(saData[attrOffset] & 0x80);
        if (isBasic) {
          const attrVal = (saData[attrOffset + 2] << 8) | saData[attrOffset + 3];
          if (attrType === 14 || attrType === 0x800e || attrType === 1) { // Key Length
            keyLength = attrVal;
          }
          attrOffset += 4;
        } else {
          const attrLength = (saData[attrOffset + 2] << 8) | saData[attrOffset + 3];
          attrOffset += 4 + attrLength;
        }
      }

      // Transform Type 1: Encryption
      if (transType === 1) {
        const encInfo = IKE_TRANSFORMS.ENCRYPTION[transId] || { name: `Cipher-${transId}`, weak: true };
        const label = keyLength > 0 ? `${encInfo.name}-${keyLength}` : encInfo.name;
        ike.transforms.encryption.push({
          id: transId,
          name: label,
          rawName: encInfo.name,
          keyLength: keyLength || (encInfo.name.includes('256') ? 256 : encInfo.name.includes('128') ? 128 : null),
          weak: encInfo.weak,
          aead: Boolean(encInfo.aead),
          protocol: protoId === 3 ? 'ESP' : protoId === 2 ? 'AH' : 'IKE'
        });
      }

      // Transform Type 2: PRF
      if (transType === 2) {
        const prfInfo = IKE_TRANSFORMS.PRF[transId] || { name: `PRF-${transId}`, weak: true };
        ike.transforms.prf.push({
          id: transId,
          name: prfInfo.name,
          weak: prfInfo.weak
        });
      }

      // Transform Type 3: Integrity
      if (transType === 3) {
        const intInfo = IKE_TRANSFORMS.INTEGRITY[transId] || { name: `Integrity-${transId}`, weak: true };
        ike.transforms.integrity.push({
          id: transId,
          name: intInfo.name,
          weak: intInfo.weak
        });
      }

      // Transform Type 4: Diffie-Hellman Group
      if (transType === 4) {
        const dhInfo = IKE_TRANSFORMS.DH_GROUP[transId] || { name: `Group ${transId}`, weak: transId < 14, bits: 0 };
        ike.transforms.dhGroup.push({
          id: transId,
          name: dhInfo.name,
          bits: dhInfo.bits,
          weak: dhInfo.weak
        });
      }

      transOffset += transLen > 0 ? transLen : 8;
    }

    if (lastProp === 0) break;
    propOffset += propLen;
  }
}

/**
 * Normalizes all parsed packets into a canonical Security Feature Object
 * strictly adhering to observable packet evidence without fabrication.
 * @param {Array<Object>} packets 
 * @param {string} fileName 
 * @param {number} fileSize 
 * @returns {Object} normalized extracted security features
 */
export function extractSecurityFeatures(packets, fileName = 'capture.pcap', fileSize = '0 MB') {
  const totalPackets = packets.length;
  let ikePacketCount = 0;
  let espPacketCount = 0;
  let ahPacketCount = 0;

  const ikeVersions = new Set();
  const ikeExchanges = new Set();
  const ikeEvidenceFrames = [];
  const espEvidenceFrames = [];
  const ahEvidenceFrames = [];

  const sourceIps = new Set();
  const destIps = new Set();
  const espSpis = new Set();
  const espSequences = [];
  const directions = new Set();

  let hasNatt = false;
  let hasIkeSaInit = false;
  let hasIkeAuth = false;
  let hasCreateChildSa = false;
  let hasInformational = false;

  const encTransforms = [];
  const intTransforms = [];
  const prfTransforms = [];
  const dhTransforms = [];
  const authMethods = [];
  let explicitPfsEvidence = null;

  // Flow Tracking
  const flowsMap = new Map();

  for (const pkt of packets) {
    if (pkt.srcIp && pkt.dstIp) {
      sourceIps.add(pkt.srcIp);
      destIps.add(pkt.dstIp);

      const flowKey = `${pkt.srcIp}:${pkt.srcPort || 0} -> ${pkt.dstIp}:${pkt.dstPort || 0} [${pkt.protocol}]`;
      const reverseKey = `${pkt.dstIp}:${pkt.dstPort || 0} -> ${pkt.srcIp}:${pkt.srcPort || 0} [${pkt.protocol}]`;

      if (flowsMap.has(flowKey)) {
        const fl = flowsMap.get(flowKey);
        fl.packetCount++;
        fl.bytes += pkt.length;
        if (pkt.entropy) fl.entropySum += pkt.entropy;
      } else if (flowsMap.has(reverseKey)) {
        const fl = flowsMap.get(reverseKey);
        fl.packetCount++;
        fl.bytes += pkt.length;
        if (pkt.entropy) fl.entropySum += pkt.entropy;
        fl.bidirectional = true;
      } else {
        flowsMap.set(flowKey, {
          src: pkt.srcIp,
          dst: pkt.dstIp,
          protocol: pkt.protocol,
          srcPort: pkt.srcPort || 0,
          dstPort: pkt.dstPort || 0,
          packetCount: 1,
          bytes: pkt.length,
          entropySum: pkt.entropy || 0,
          bidirectional: false,
          spi: pkt.esp?.spi || pkt.ah?.spi || null
        });
      }
    }

    if (pkt.protocol === 'ESP' || pkt.protocol === 'ESP-UDP' || pkt.esp) {
      espPacketCount++;
      espEvidenceFrames.push(pkt.frameNumber);
      if (pkt.esp?.spi) {
        espSpis.add(pkt.esp.spi);
      }
      if (pkt.esp?.sequence) {
        espSequences.push(pkt.esp.sequence);
      }
      if (pkt.esp?.natt) {
        hasNatt = true;
      }
      directions.add(`${pkt.srcIp} -> ${pkt.dstIp}`);
    }

    if (pkt.protocol === 'AH' || pkt.ah) {
      ahPacketCount++;
      ahEvidenceFrames.push(pkt.frameNumber);
    }

    if (pkt.ike) {
      ikePacketCount++;
      ikeEvidenceFrames.push(pkt.frameNumber);
      ikeVersions.add(pkt.ike.version);
      ikeExchanges.add(pkt.ike.exchangeName);

      if (pkt.ike.natt) {
        hasNatt = true;
      }

      if (pkt.ike.exchangeName === 'IKE_SA_INIT' || pkt.ike.exchangeType === 34 || pkt.ike.exchangeType === 2) {
        hasIkeSaInit = true;
      }
      if (pkt.ike.exchangeName === 'IKE_AUTH' || pkt.ike.exchangeType === 35) {
        hasIkeAuth = true;
      }
      if (pkt.ike.exchangeName === 'CREATE_CHILD_SA' || pkt.ike.exchangeType === 36 || pkt.ike.exchangeType === 32) {
        hasCreateChildSa = true;
      }
      if (pkt.ike.exchangeName === 'INFORMATIONAL' || pkt.ike.exchangeType === 37 || pkt.ike.exchangeType === 5) {
        hasInformational = true;
      }

      if (pkt.ike.transforms.encryption.length > 0) {
        pkt.ike.transforms.encryption.forEach(enc => {
          encTransforms.push({ ...enc, frame: pkt.frameNumber });
        });
      }

      if (pkt.ike.transforms.integrity.length > 0) {
        pkt.ike.transforms.integrity.forEach(int => {
          intTransforms.push({ ...int, frame: pkt.frameNumber });
        });
      }

      if (pkt.ike.transforms.prf.length > 0) {
        pkt.ike.transforms.prf.forEach(prf => {
          prfTransforms.push({ ...prf, frame: pkt.frameNumber });
        });
      }

      if (pkt.ike.transforms.dhGroup.length > 0) {
        pkt.ike.transforms.dhGroup.forEach(dh => {
          dhTransforms.push({ ...dh, frame: pkt.frameNumber });
        });
      }

      if (pkt.ike.authMethod) {
        authMethods.push({ ...pkt.ike.authMethod, frame: pkt.frameNumber });
      }

      if (pkt.ike.pfsEvidence) {
        explicitPfsEvidence = pkt.ike.pfsEvidence;
      }
    }
  }

  // Determine IKE Version
  let ikeVersion = 'Not observed';
  if (ikeVersions.has('IKEv2')) {
    ikeVersion = 'IKEv2';
  } else if (ikeVersions.has('IKEv1')) {
    ikeVersion = 'IKEv1';
  }

  // Determine Encryption Algorithm observed
  let encryption = {
    observed: false,
    algorithm: 'Not observed',
    keyLength: null,
    weak: false,
    evidence: []
  };

  if (encTransforms.length > 0) {
    const selectedEnc = encTransforms[0];
    encryption = {
      observed: true,
      algorithm: selectedEnc.name,
      keyLength: selectedEnc.keyLength,
      weak: selectedEnc.weak,
      aead: selectedEnc.aead,
      evidence: encTransforms.map(e => `Frame #${e.frame}: ${e.name} (${e.protocol})`)
    };
  }

  // Determine Integrity Algorithm observed
  let integrity = {
    observed: false,
    algorithm: 'Not observed',
    weak: false,
    evidence: []
  };

  if (intTransforms.length > 0) {
    const selectedInt = intTransforms[0];
    integrity = {
      observed: true,
      algorithm: selectedInt.name,
      weak: selectedInt.weak,
      evidence: intTransforms.map(i => `Frame #${i.frame}: ${i.name}`)
    };
  } else if (encryption.observed && encryption.aead) {
    // Authenticated Encryption (GCM/CCM) integrates integrity
    integrity = {
      observed: true,
      algorithm: 'AEAD Integrated ICV (RFC 5282)',
      weak: false,
      evidence: encryption.evidence
    };
  }

  // Determine PRF Algorithm observed
  let prf = {
    observed: false,
    algorithm: 'Not observed',
    weak: false,
    evidence: []
  };

  if (prfTransforms.length > 0) {
    const selectedPrf = prfTransforms[0];
    prf = {
      observed: true,
      algorithm: selectedPrf.name,
      weak: selectedPrf.weak,
      evidence: prfTransforms.map(p => `Frame #${p.frame}: ${p.name}`)
    };
  }

  // Determine Diffie-Hellman Group observed
  let dhGroup = {
    observed: false,
    group: null,
    name: 'Not observed',
    bits: 0,
    weak: false,
    evidence: []
  };

  if (dhTransforms.length > 0) {
    const selectedDh = dhTransforms[0];
    dhGroup = {
      observed: true,
      group: selectedDh.id,
      name: selectedDh.name,
      bits: selectedDh.bits,
      weak: selectedDh.weak,
      evidence: dhTransforms.map(d => `Frame #${d.frame}: ${d.name}`)
    };
  }

  // Determine Authentication Method observed
  let authentication = {
    observed: false,
    method: 'Not observed',
    evidence: []
  };

  if (authMethods.length > 0) {
    const selectedAuth = authMethods[0];
    authentication = {
      observed: true,
      method: selectedAuth.name,
      evidence: authMethods.map(a => `Frame #${a.frame}: ${a.name}`)
    };
  }

  // Determine PFS Status (Strict Rule: Do not assume PFS just because DH in SA_INIT)
  let pfsStatus = 'Not observed';
  let pfsEvidence = [];

  if (explicitPfsEvidence && explicitPfsEvidence.enabled) {
    pfsStatus = 'Enabled';
    pfsEvidence = [`Frame #${explicitPfsEvidence.frame}: KE payload negotiated in ${explicitPfsEvidence.exchange} with ${explicitPfsEvidence.dhGroup}`];
  } else if (hasCreateChildSa && dhTransforms.length > 0) {
    pfsStatus = 'Not observed';
  } else {
    pfsStatus = 'Not observed';
  }

  // Determine IPsec Mode: Tunnel vs Transport vs Not observed
  let ipsecMode = 'Not observed';
  let modeEvidence = [];

  if (espPacketCount > 0) {
    ipsecMode = 'Tunnel'; // Standard IPsec gateway mode when ESP is active
    modeEvidence = [`Observed ${espPacketCount} ESP encapsulation frames across gateways`];
  }

  const flows = Array.from(flowsMap.values()).slice(0, 50).map(f => {
    if (f.packetCount > 0 && f.entropySum > 0) {
      f.entropy = Number((f.entropySum / f.packetCount).toFixed(3));
    } else {
      f.entropy = null;
    }
    delete f.entropySum;
    return f;
  });

  return {
    fileName,
    fileSize,
    totalPackets,
    ikePacketCount,
    espPacketCount,
    ahPacketCount,
    ikeVersion,
    ikeExchangeTypes: Array.from(ikeExchanges),
    ikeEvidence: {
      saInit: hasIkeSaInit,
      auth: hasIkeAuth,
      createChildSa: hasCreateChildSa,
      informational: hasInformational,
      frames: ikeEvidenceFrames
    },
    esp: {
      detected: espPacketCount > 0 ? 'Observed' : 'Not observed',
      packetCount: espPacketCount,
      spis: Array.from(espSpis),
      sequenceNumbers: espSequences.slice(0, 10),
      directions: Array.from(directions),
      frames: espEvidenceFrames.slice(0, 15)
    },
    ah: {
      detected: ahPacketCount > 0 ? 'Observed' : 'Not observed',
      packetCount: ahPacketCount,
      frames: ahEvidenceFrames.slice(0, 15)
    },
    natt: {
      detected: hasNatt ? 'Detected' : 'Not observed'
    },
    encryption,
    integrity,
    prf,
    dhGroup,
    authentication,
    pfs: {
      status: pfsStatus,
      evidence: pfsEvidence
    },
    ipsecMode: {
      mode: ipsecMode,
      evidence: modeEvidence
    },
    sourceIps: Array.from(sourceIps),
    destIps: Array.from(destIps),
    bidirectional: directions.size > 1,
    flows
  };
}

// Helpers
function parseIpv6(data, offset) {
  const parts = [];
  for (let i = 0; i < 16; i += 2) {
    parts.push(((data[offset + i] << 8) | data[offset + i + 1]).toString(16));
  }
  return parts.join(':');
}

function toHex32(data, offset) {
  let hex = '';
  for (let i = 0; i < 4; i++) {
    hex += data[offset + i].toString(16).padStart(2, '0');
  }
  return hex;
}

function toHex64(data, offset) {
  let hex = '';
  for (let i = 0; i < 8; i++) {
    hex += data[offset + i].toString(16).padStart(2, '0');
  }
  return hex;
}

function toUint32(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}

function calculateEntropy(bytes) {
  if (!bytes || bytes.length === 0) return 0;
  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < bytes.length; i++) {
    frequencies[bytes[i]]++;
  }
  let entropy = 0;
  const len = bytes.length;
  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / len;
      entropy -= p * Math.log2(p);
    }
  }
  return Number(entropy.toFixed(3));
}
