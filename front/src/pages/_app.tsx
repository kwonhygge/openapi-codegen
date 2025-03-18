import "@/styles/globals.css";
import type { AppProps } from "next/app";
import CustomQueryClientProvider from "@/config/query-client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomQueryClientProvider>
      <Component {...pageProps} />
    </CustomQueryClientProvider>
  );
}
