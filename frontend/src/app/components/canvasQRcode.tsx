import React from "react";
import { useQRCode } from "next-qrcode";

interface QRCodeProps {
  qrWidth: number;
}

function CanvasQRcode({ qrWidth }: QRCodeProps) {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={"https://github.com/bunlong/next-qrcode"}
      options={{
        type: "image/jpeg",
        quality: 0.3,
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: qrWidth,
        color: {
          light: "#ffff",
        },
      }}
    />
  );
}

export default CanvasQRcode;
