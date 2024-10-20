import { Fragment } from "react";
import { RepositoryDataBase } from "@/intefaces/repository-data";
import { LanguageBadge } from "./language-badge";
import { languageDictionary } from "@/global";
import {
  FeedForkedIcon,
  LinkExternalIcon,
  RepoForkedIcon,
  StarIcon,
} from "@primer/octicons-react";

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
  stargazers_count,
  forks_count,
}: RepositoryDataBase): JSX.Element => {
  return (
    <div className="relative 2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full flex-auto border border-2 border-slate-400 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-600 rounded-lg shadow-sm shadow-slate-400 dark:shadow-slate-700 bg-slate-100/[.9] dark:bg-slate-900/[.9] backdrop-blur-sm">
      <div className="absolute text-gray-900 dark:text-gray-100 text-right right-2 bottom-2">
        {homepage ? (
          <a href={homepage} className="mr-2" title="Página do projeto">
            <LinkExternalIcon size="medium" />
          </a>
        ) : null}
        <a href={html_url} title="Código fonte">
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
              <StarIcon className="p-1" size={26} />
              <span>{stargazers_count}</span>
            </div>
            <div className="m-2 inline-flex">
              <RepoForkedIcon className="p-1" size={26} />
              <span>{forks_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
