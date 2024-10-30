import { configguration } from "@/global";
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";

interface FooterProps {
  disclaimer: string | null;
}

export const Footer = ({ disclaimer }: FooterProps): JSX.Element => {
  return (
    <a href={`https://github.com/${configguration.user_login}`}>
      <div className="sticy left-0 bottom-0 text-white bg-slate-900/[.9] w-full p-4 text-center border-t border-slate-600 backdrop-blur-sm">
        <div>
          <MarkGithubIcon size="medium" />
        </div>
        <div>
          <LogoGithubIcon size="small" />
        </div>
        <div className="absolute flex items-center h-full align-middle right-0 top-0">
          <div className="max-w-32 p-2 sm:max-w-52 text-white text-sm sm:text-base">{disclaimer}</div></div>
      </div>
    </a>
  );
};
