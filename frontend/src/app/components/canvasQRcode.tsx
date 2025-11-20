import React from "react";
import { useQRCode } from "next-qrcode";

function CanvasQRcode() {
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
        width: 175,
        color: {
          light: "#ffff",
        },
      }}
    />
  );
}

export default CanvasQRcode;
