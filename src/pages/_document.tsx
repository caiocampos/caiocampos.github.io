import { configguration } from "@/global";
import { Html, Head, Main, NextScript } from "next/document";

const userAvatarHref = `https://avatars.githubusercontent.com/u/${configguration.user_id}`;

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Lista de projetos construídos" />
        <link rel="apple-touch-icon" href={userAvatarHref} />
        <link rel="icon" href={userAvatarHref} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
