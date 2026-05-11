import React from "react";
import { useQRCode } from "next-qrcode";

import { useUserStore } from "@/stores/useUserStore";

interface QRCodeProps {
  qrWidth: number;
  type: "checkin" | "circle" | "referral";
  id: string;
}

export default function CanvasQRcode({ qrWidth, type, id }: QRCodeProps) {
  const { Canvas } = useQRCode();
  const { user } = useUserStore();

  //every phone camera knows to open it in the browser. Next.js page then handles the action automatically.

  const qrValue =
    type === "checkin"
      ? `https://br3w.app/checkin?moment=${id}&attendee=${user?.id}`
      : type === "circle"
        ? `https://br3w.app/circle/join?circle=${id}&invitedBy=${user?.id}`
        : `https://br3w.app/referral?ref=${id}&referredBy=${user?.id}`;

  return (
    <Canvas
      text={qrValue}
      options={{
        type: "image/jpeg",
        quality: 0.3,
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: qrWidth,
        color: {
          light: "#ffffff",
        },
      }}
    />
  );
}
