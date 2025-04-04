import { JSX, useCallback, useState } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Card, RepositoryCard } from "@/components/card";
import { RepositoryData } from "@/intefaces/repository-data";
import { configuration } from "@/global";
import { Footer } from "@/components/footer";
import { GithubServices } from "@/services/github/github-services";
import {
  createRepositoryWordDictionary,
  parseRepositoryData,
  repositoryComparison,
  RepositoryWordDictionary,
} from "@/utils/repository-utils";
import { SearchInput } from "@/components/search";
import { filterResult } from "@/utils/search-utils";
import { MinimalRepository } from "@/services/github/github-dtos";
import {
  generateParams,
  getLanguageDisclaimer,
  getRepositoriesTranslation,
  getTermTranslation,
  isLanguagePT,
  Language,
  LanguageEnum,
  languages,
  locales,
  PageParams,
} from "@/utils/language-utils";
import { TermTranslation } from "@/intefaces/translation";
import { Flag } from "@/components/flag";
import Link from "next/link";
import { LanguageChart } from "@/components/language-chart";
import { ThemeSelector } from "@/components/theme-selector";

interface RepositoriesGetStaticProps {
  repositories: RepositoryData[];
  wordDictionary: RepositoryWordDictionary;
  language: Language;
  languageList: Language[];
  termTranslation: TermTranslation;
}

export const getStaticPaths = (() => {
  const pathsWithParams = generateParams(languages).map(
    ({ language }: PageParams) => ({
      params: { language },
    })
  );
  return {
    paths: pathsWithParams,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps: GetStaticProps<RepositoriesGetStaticProps> =
  (async (context) => {
    let language = context.params?.language as Language;
    const hasLanguage = languages.includes(language);
    if (!hasLanguage) {
      language = LanguageEnum.Portuguese;
    }
    const repositoriesBruteData: MinimalRepository[] =
      await GithubServices.getCachedAllUserRepos(
        configuration.user_login,
        configuration.orgs_login
      );
    const repositoriesTranslatedData: MinimalRepository[] = (
      await getRepositoriesTranslation(repositoriesBruteData, language)
    ).sort(repositoryComparison);
    const termTranslation: TermTranslation = await getTermTranslation(language);
    const repositories: RepositoryData[] =
      repositoriesTranslatedData.map(parseRepositoryData);
    const wordDictionary = createRepositoryWordDictionary(
      repositoriesTranslatedData,
      termTranslation
    );
    return {
      props: {
        repositories,
        wordDictionary,
        language,
        termTranslation,
        languageList: languages,
      },
    };
  }) satisfies GetStaticProps<RepositoriesGetStaticProps>;

export default function HomePage({
  repositories,
  wordDictionary,
  language,
  languageList,
  termTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const [filter, setFilter] = useState<number[] | undefined>(undefined);
  const onSearch = useCallback(
    (text: string): void => {
      setFilter(filterResult(text, wordDictionary));
    },
    [wordDictionary]
  );
  return (
    <div className="w-screen">
      <Head>
        <html lang={locales[language]} />
        <title>{configuration.title}</title>
      </Head>
      <div className="relative w-full p-4">
        <div className="absolute left-3 top-4 mx-1">
          <ThemeSelector termTranslation={termTranslation} />
          <span
            className="ml-2"
            title={getLanguageDisclaimer(language, termTranslation)}
          >
            <Flag language={language} />
          </span>
        </div>
        <div className="absolute right-3 top-4">
          {languageList
            .filter((l) => l !== language)
            .map((l) => (
              <Link
                key={l}
                className="mx-1"
                href={`/home/${l}`}
                title={getLanguageDisclaimer(l, termTranslation)}
              >
                <Flag language={l} />
              </Link>
            ))}
        </div>
      </div>
      <div className="sticky w-full p-4 top-0 z-100 mt-10 lg:mt-0 drop-shadow-md">
        <SearchInput onSearch={onSearch} termTranslation={termTranslation} />
      </div>
      {filter === undefined ? (
        <div className="w-full flex justify-center p-4">
          <Card className="flex-none">
            <LanguageChart
              repositories={repositories}
              termTranslation={termTranslation}
            />
          </Card>
        </div>
      ) : null}
      <div className="w-full flex flex-wrap gap-4 items-stretch p-4 pb-32">
        {repositories
          .filter(({ id }) => filter === undefined || filter.includes(id))
          .map((repository) => (
            <RepositoryCard
              key={`repo-card-${repository.id}`}
              {...repository}
              termTranslation={termTranslation}
            />
          ))}
      </div>
      <Footer
        disclaimer={
          isLanguagePT(language) ? null : termTranslation.autotranslated
        }
      />
    </div>
  );
}
