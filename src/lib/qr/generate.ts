import QRCode from 'qrcode';

export async function generateLocationQR(locationId: string, locationCode: string): Promise<string> {
  return QRCode.toDataURL(`dhruvtrack://location/${locationId}/${locationCode}`);
}
