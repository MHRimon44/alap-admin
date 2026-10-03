import "./globals.css";
export const metadata = {
  title: "Alap Admin",
  description: "Operations dashboard for Alap",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
