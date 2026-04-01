import { Inter } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Security Admin Panel",
  description: "Enterprise Security Administration Module",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ProtectedRoute allowedRoles={["App Admin", "Security Admin"]}>
          {children}
        </ProtectedRoute>
      </body>
    </html>
  );
}
