import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MangaConsulting",
  description: "Sua jornada para a excelência operacional começa aqui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fustat.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
