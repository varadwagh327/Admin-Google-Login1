// layout.tsx
"use client"; // <-- add this at the top

import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
