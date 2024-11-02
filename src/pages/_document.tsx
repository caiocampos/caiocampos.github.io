import { configuration } from "@/global";
import { Html, Head, Main, NextScript } from "next/document";

const userAvatarHref = `https://avatars.githubusercontent.com/u/${configuration.user_id}`;

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Lista de projetos construídos" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
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
