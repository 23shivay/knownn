import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import './globals.css'
import { cn } from "lib/utils";
import AuthProvider from "context/AuthProvider";
import { Toaster } from "components/ui/toaster";
import Header from "components/navbar/Header";
import HeaderMobile from "components/navbar/HeaderMobile";
import SideNav from "components/navbar/side-nav";
import PageWrapper from "components/navbar/PageWrapper";
import MarginWidthWrapper from "components/navbar/margin-width-wrapper";
import { SocketProvider } from "context/SocketContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Knowns",
  description: "Talk to Unknowns which You know",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SocketProvider>
            <div className="flex">
              <SideNav />
              <main className="flex-1">
                <MarginWidthWrapper>
                  <Header />
                  <HeaderMobile />
                  <PageWrapper>{children}</PageWrapper>
                </MarginWidthWrapper>
              </main>
            </div>
            <Toaster />
          </SocketProvider>
        </AuthProvider> 
      </body>
    </html>
  );
}