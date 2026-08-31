import React from 'react';

export function VpnLogo({ className = "w-10 h-10", ariaLabel = "VPN VISION Logo" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Light Mode Logo */}
      <img
        src="/vpn-vision-shield-light.png"
        alt={ariaLabel}
        className="w-full h-full object-contain dark:hidden"
      />
      {/* Dark Mode Logo */}
      <img
        src="/vpn-vision-shield-dark.png"
        alt={ariaLabel}
        className="w-full h-full object-contain hidden dark:block"
      />
    </div>
  );
}

export default VpnLogo;
