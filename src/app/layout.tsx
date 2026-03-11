import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fiesta PopUp - Pedí tu tema",
  description: "Escaneá, pedí y bailá. La rocola de la PopUp.",
  openGraph: {
    title: "Fiesta PopUp - Pedí tu tema",
    description: "Escaneá, pedí y bailá. La rocola de la PopUp.",
    url: "https://fiestapopup.com.ar",
    siteName: "Fiesta PopUp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fiesta PopUp Logo and Slogan",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiesta PopUp - Pedí tu tema",
    description: "Escaneá, pedí y bailá. La rocola de la PopUp.",
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
        <main className="window">
          <div className="title-bar">
            <span>FiestaPopUp_v1.0.exe</span>
            <span>[X]</span>
          </div>
          <div className="content">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
