import { configuration } from "@/global";
import { Html, Head, Main, NextScript } from "next/document";

const userAvatarHref = `https://avatars.githubusercontent.com/u/${configuration.user_id}`;

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Lista de projetos construídos" />
        <link rel="apple-touch-icon" href={userAvatarHref} />
        <link rel="icon" href={userAvatarHref} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
