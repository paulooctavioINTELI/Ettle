import { Suspense } from "react";
import SpotifyBridgeClient from "./SpotifyBridgeClient";

// Evita SSG dessa rota e o erro de prerender/export
export const dynamic = "force-dynamic";

// (Opcional) Mover themeColor para viewport (elimina o warning)
export const viewport = {
  themeColor: "#000000",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SpotifyBridgeClient />
    </Suspense>
  );
}
