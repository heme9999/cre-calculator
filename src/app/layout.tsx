import React from "react";
import Script from "next/script";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "cfd6b69de8df450b98360ab8893cc6c8";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="wMz2VDeMwD8R6yiCgJIqFD_wM2wSzrSEauzvCtzKHyw" />
      </head>
      <body>
        {children}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cfToken })}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
