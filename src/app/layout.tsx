import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import { getSession } from "@/lib/auth/guards";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silpial",
  description: "Prepare licitaciones que cumplan con las normas con confianza",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getSession()
  console.log("user information:",data)
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${roboto.variable} font-roboto antialiased`}
      >
        <NavBar user={data}/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
