import { Fragment, JSX } from "react";
import { RepositoryDataBase } from "@/intefaces/repository-data";
import { LanguageBadge } from "./language-badge";
import { configuration, languageDictionary } from "@/global";
import { ExternalLink, GitFork, SquareCode, Star } from "lucide-react";
import { TermTranslationAdapter } from "@/intefaces/translation";
import { dots, regexDot, regexLink } from "@/utils/string-utils";
import { cn } from "@/lib/utils";

const getDescription = (description: string | null): JSX.Element => {
  if (description === null) {
    return <></>;
  }
  const notEmpty = (p: string) => p !== "";
  const elementList = description
    .split(regexDot)
    .filter(notEmpty)
    .map((part, i) => {
      const key = `desc-part-${i}`;
      if (dots.includes(part)) {
        return (
          <Fragment key={key}>
            {part}
            <br />
          </Fragment>
        );
      }
      const linkParts = part.split(regexLink);
      if (linkParts.length > 1) {
        const linkParsed = linkParts.filter(notEmpty).map((linkPart, j) => {
          const subKey = `${key}-${j}`;
          if (new RegExp(regexLink).test(linkPart)) {
            return (
              <a key={subKey} href={linkPart}>
                {linkPart}
              </a>
            );
          }
          return <Fragment key={subKey}>{linkPart}</Fragment>;
        });
        return <Fragment key={key}>{linkParsed}</Fragment>;
      }
      return <Fragment key={key}>{part}</Fragment>;
    });
  return <>{elementList}</>;
};

interface CardProps extends RepositoryDataBase, TermTranslationAdapter {}

const cardClassNames = [
  "relative",
  "2xl:w-1/5",
  "xl:w-1/4",
  "lg:w-1/3",
  "md:w-1/2",
  "sm:w-full",
  "flex-auto",
  "border",
  "border-2",
  `border-${configuration.main_color}-400`,
  `dark:border-${configuration.main_color}-800`,
  `hover:border-${configuration.main_color}-200`,
  `dark:hover:border-${configuration.main_color}-600`,
  "rounded-lg",
  "shadow-xs",
  `shadow-${configuration.main_color}-400`,
  `dark:shadow-${configuration.main_color}-700`,
  `bg-${configuration.main_color}-100/[.9]`,
  `dark:bg-${configuration.main_color}-900/[.9]`,
  "backdrop-blur-xs",
  "drop-shadow-md",
];

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn([...cardClassNames, className])}>{children}</div>;

export const RepositoryCard = ({
  name,
  html_url,
  description,
  language,
  homepage,
  archived,
  fork,
  stargazers_count,
  forks_count,
  termTranslation,
}: CardProps): JSX.Element => {
  return (
    <Card>
      <div className="absolute inline-flex text-gray-900 dark:text-gray-100 text-right right-2 bottom-2">
        {homepage ? (
          <a href={homepage} className="mr-2" title={termTranslation.page}>
            <ExternalLink size={32} strokeWidth={1} />
          </a>
        ) : null}
        <a href={html_url} title={termTranslation.source}>
          <SquareCode size={32} strokeWidth={1} />
        </a>
      </div>
      <div className="p-4 flex flex-col justify-between leading-normal h-full">
        <div className="mb-6">
          <div className="text-gray-900 dark:text-gray-100 font-bold text-xl mb-4 text-center">
            {name}
            {archived
              ? ` (${termTranslation.archived})`
              : fork
              ? " (fork)"
              : null}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-line">
            {getDescription(description)}
          </p>
        </div>
        <div className="w-full text-gray-900 dark:text-gray-100">
          <div className="flex justify-center">
            {language !== null ? (
              languageDictionary[language] !== undefined ? (
                <LanguageBadge {...languageDictionary[language]} />
              ) : (
                language
              )
            ) : null}
          </div>
          <div className="flex justify-center">
            <div className="m-2 inline-flex">
              <Star className="p-1" size={26} />
              <span>{stargazers_count}</span>
            </div>
            <div className="m-2 inline-flex">
              <GitFork className="p-1" size={26} />
              <span>{forks_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
