import { Fragment } from "react";
import { RepositoryDataBase } from "@/intefaces/repository-data";
import { LanguageBadge } from "./language-badge";
import { languageDictionary } from "@/global";
import { FeedForkedIcon, LinkExternalIcon } from "@primer/octicons-react";

const getDescription = (description: string | null): JSX.Element => {
  if (description === null) {
    return <></>;
  }
  const notEmpty = (p: string) => p !== "";
  const regexDot = /([.:])\s+/g;
  const regexLink = /(http[s]?:\/\/[.a-z@/-]+)/gi;
  const elementList = description
    .split(regexDot)
    .filter(notEmpty)
    .map((part, i) => {
      const key = `desc-part-${i}`;
      if (part === "." || part === ":") {
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
          if (regexLink.test(linkPart)) {
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

export const Card = ({
  name,
  html_url,
  description,
  language,
  homepage,
  archived,
  fork,
}: RepositoryDataBase): JSX.Element => {
  return (
    <div className="relative 2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full flex-auto border border-2 border-slate-400 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-600 rounded-lg shadow-sm shadow-slate-400 dark:shadow-slate-700 bg-slate-100/[.9] dark:bg-slate-900/[.9] backdrop-blur-sm">
      <div className="absolute text-gray-900 dark:text-gray-100 text-right right-2 top-2">
        {homepage ? (
          <a href={homepage} className="mr-2">
            <LinkExternalIcon size="medium" />
          </a>
        ) : null}
        <a href={html_url}>
          <FeedForkedIcon size="medium" />
        </a>
      </div>
      <div className="p-4 flex flex-col justify-between leading-normal h-full">
        <div className="mb-6">
          <div className="text-gray-900 dark:text-gray-100 font-bold text-xl mb-4 text-center">
            {name}
            {archived ? " (arquivado)" : fork ? " (fork)" : null}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-line">
            {getDescription(description)}
          </p>
        </div>
        <div className="w-full text-center text-gray-900 dark:text-gray-100">
          <p className="flex justify-center mb-2">
            {language !== null ? (
              languageDictionary[language] !== undefined ? (
                <LanguageBadge {...languageDictionary[language]} />
              ) : (
                language
              )
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};
