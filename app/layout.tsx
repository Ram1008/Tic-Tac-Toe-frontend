import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ram Chandel | Senior Software Engineer & Architect",
  description: "Senior Software Engineer specializing in scalable tech solutions, AI-driven microservices, and cloud architecture. Explore my portfolio and projects.",
  keywords: ["Ram Chandel", "Software Engineer", "Architect", "AI", "Cloud Scalability", "Portfolio"],
  authors: [{ name: "Ram Chandel" }],
  openGraph: {
    title: "Ram Chandel | Senior Software Engineer & Architect",
    description: "Senior Software Engineer specializing in scalable tech solutions and cloud architecture.",
    url: "https://ramchandel.com", // Placeholder, user should update
    siteName: "Ram Chandel Portfolio",
    images: [
      {
        url: "/og-image.png", // Placeholder
        width: 1200,
        height: 630,
        alt: "Ram Chandel Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Chandel | Senior Software Engineer & Architect",
    description: "Senior Software Engineer specializing in scalable tech solutions and cloud architecture.",
    images: ["/og-image.png"], // Placeholder
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
