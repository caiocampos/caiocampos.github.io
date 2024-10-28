import "@/styles/globals.css";
import "flag-icons/css/flag-icons.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
