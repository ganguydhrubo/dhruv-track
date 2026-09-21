export function decodeLocationQR(qrData: string): { locationId: string; locationCode: string } | null {
  try {
    const url = new URL(qrData);
    if (url.protocol !== 'dhruvtrack:') return null;
    
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'location' || parts.length < 3) return null;
    
    return {
      locationId: parts[1],
      locationCode: parts[2]
    };
  } catch (e) {
    // If it's not a valid URL format but still follows the pattern
    const match = qrData.match(/^dhruvtrack:\/\/location\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      return {
        locationId: match[1],
        locationCode: match[2]
      };
    }
    return null;
  }
}
