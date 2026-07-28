import React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="wMz2VDeMwD8R6yiCgJIqFD_wM2wSzrSEauzvCtzKHyw" />
      </head>
      <body>{children}</body>
    </html>
  );
}
