import { configuration } from "@/global";
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";

interface FooterProps {
  disclaimer: string | null;
}

const footerClassNames = [
  "fixed",
  "left-0",
  "-bottom-2",
  "p-4",
  "pb-6",
  "text-white",
  `bg-${configuration.main_color}-900/[.9]`,
  "w-full",
  "text-center",
  "border-t",
  `border-${configuration.main_color}-600`,
  "backdrop-blur-sm",
].join(" ");

export const Footer = ({ disclaimer }: FooterProps): JSX.Element => (
  <a href={`https://github.com/${configuration.user_login}`}>
    <div className={footerClassNames}>
      <div>
        <MarkGithubIcon size="medium" />
      </div>
      <div>
        <LogoGithubIcon size="small" />
      </div>
      <div className="absolute flex items-center h-full align-middle right-0 top-0">
        <div className="max-w-32 p-2 sm:max-w-52 text-white text-sm sm:text-base">
          {disclaimer}
        </div>
      </div>
    </div>
  </a>
);
