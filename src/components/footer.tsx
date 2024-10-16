import { configguration } from "@/global";
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";

export const Footer = (): JSX.Element => {
  return (
    <a href={`https://github.com/${configguration.user_login}`}>
      <div className="fixed left-0 bottom-0 text-white bg-slate-900/[.9] w-full p-2 text-center border-t border-slate-600">
        <div>
          <MarkGithubIcon size="medium" />
        </div>
        <div>
          <LogoGithubIcon size="small" />
        </div>
      </div>
    </a>
  );
};
