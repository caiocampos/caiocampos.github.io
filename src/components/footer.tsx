import { JSX } from "react";
import { configuration } from "@/global";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  "backdrop-blur-xs",
];

export const Footer = ({ disclaimer }: FooterProps): JSX.Element => (
  <a href={`https://github.com/${configuration.user_login}`}>
    <div className={cn(footerClassNames)}>
      <div className="flex justify-center text-white">
        <Image
          src="/assets/octicons/mark-github.svg"
          width={48}
          height={48}
          alt="GitHub Mark"
        />
      </div>
      <div className="flex justify-center text-white">
        <Image
          width={68}
          height={24}
          src="/assets/octicons/logo-github.svg"
          alt="GitHub Logo"
        />
      </div>
      <div className="absolute flex items-center h-full align-middle right-0 top-0">
        <div className="max-w-32 p-2 sm:max-w-52 text-white text-sm sm:text-base">
          {disclaimer}
        </div>
      </div>
    </div>
  </a>
);
