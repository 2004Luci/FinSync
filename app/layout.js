import { Inter } from "next/font/google";
import "./globals.css";
import Header2 from "@/components/Header";
import Footer from "@/components/Footer.jsx";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinSync",
  description: "FinSync helps you manage your accounts, monitor spending, and stay on top of your budget with ease.",
  keywords: ["budgeting", "finance tracker", "personal finance", "expenses", "money management"],
  authors: [{ name: "Mit Sheth", url: "https://www.mit4sheth.dev" }],
  creator: "Mit Sheth",
  openGraph: {
    title: "FinSync",
    description: "A clean and simple personal finance tracker built with Next.js",
    siteName: "FinSync",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`} >
          <Header2 />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
