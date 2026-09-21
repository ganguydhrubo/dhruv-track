"use client";
import React from "react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QRCodeDisplay({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, { width: 256, margin: 2 }, (err, url) => {
      if (err) console.error(err);
      else setDataUrl(url);
    });
  }, [value]);

  if (!dataUrl) return null;
  return <img src={dataUrl} alt="QR Code" className="border rounded p-2 bg-white" />;
}
