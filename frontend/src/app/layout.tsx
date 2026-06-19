import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apex Kinematics | Elite Biomechanics Engine",
  description: "AI-driven computer vision, 3D WebGL skeleton rendering, and DTW telemetry analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}