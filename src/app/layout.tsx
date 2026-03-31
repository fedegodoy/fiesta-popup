import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fiestapopup.com.ar"),
  title: "Fiesta PopUp | Edición Rocola",
  description: "Escaneá, pedí y bailá",
  openGraph: {
    title: "Fiesta PopUp | Edición Rocola",
    description: "Escaneá, pedí y bailá",
    url: "https://fiestapopup.com.ar",
    siteName: "Fiesta PopUp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fiesta PopUp | Edición Rocola",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiesta PopUp | Edición Rocola",
    description: "Escaneá, pedí y bailá",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="page-wrapper">
          <main className="window">
            <div className="title-bar">
              <span>FiestaPopUp_v1.0.exe</span>
              <span>[X]</span>
            </div>
            <div className="content">
              {children}
            </div>
          </main>
          <div className="venue-logo">
            <img src="/logo_911.png" alt="Club Social NueveOnce" />
          </div>
        </div>
      </body>
    </html>
  );
}
