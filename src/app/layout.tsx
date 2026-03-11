import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fiesta PopUp - Pedí tu tema",
  description: "Escaneá, pedí y bailá. La rocola de la PopUp.",
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
