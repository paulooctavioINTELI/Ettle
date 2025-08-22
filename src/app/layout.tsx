import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-international-phone/style.css';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ettle — Personalised training for Edinburgh",
  description:
    "Ettle creates smart, adaptive workouts for Edinburgh’s students and young professionals. Simple, affordable, effective.",
  keywords: [
    "Edinburgh fitness app",
    "workout app Edinburgh",
    "personalised training",
    "student workouts Scotland",
    "gym plan app",
  ],
  applicationName: "Ettle",
  openGraph: {
    title: "Ettle — Personalised training for Edinburgh",
    description:
      "Smart, adaptive workouts that fit your time, experience and goals.",
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: "Ettle" },
  themeColor: "#181819",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
