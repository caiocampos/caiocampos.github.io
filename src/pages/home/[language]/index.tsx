import { useState } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Card } from "@/components/card";
import { RepositoryData } from "@/intefaces/repository-data";
import { configguration } from "@/global";
import { Footer } from "@/components/footer";
import { GithubServices } from "@/services/github/github-services";
import {
  createRepositoryWordDictionary,
  parseRepositoryData,
  repositoryComparison,
  RepositoryWordDictionary,
} from "@/utils/repository-utils";
import { Search } from "@/components/search";
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

interface RepositoriesGetStaticProps {
  repositories: RepositoryData[];
  wordDictionary: RepositoryWordDictionary;
  language: Language;
  termTranslation: TermTranslation;
}

export const getStaticPaths = (() => {
  const pathsWithParams = generateParams().map(({ language }: PageParams) => ({
    params: { language },
  }));
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
    const termTranslation: TermTranslation = await getTermTranslation(language);
    const repositoriesBruteData: MinimalRepository[] = (
      await getRepositoriesTranslation(
        await GithubServices.getCachedAllUserRepos(configguration.user_login),
        language
      )
    ).sort(repositoryComparison);
    const repositories: RepositoryData[] =
      repositoriesBruteData.map(parseRepositoryData);
    const wordDictionary = createRepositoryWordDictionary(
      repositoriesBruteData,
      termTranslation
    );
    return {
      props: { repositories, wordDictionary, language, termTranslation },
    };
  }) satisfies GetStaticProps<RepositoriesGetStaticProps>;

export default function HomePage({
  repositories,
  wordDictionary,
  language,
  termTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const [filter, setFilter] = useState<number[] | undefined>(undefined);
  const onSearch = (text: string): void => {
    setFilter(filterResult(text, wordDictionary));
  };
  return (
    <div className="w-screen">
      <Head>
        <html lang={locales[language]} />
        <title>{configguration.title}</title>
      </Head>
      <div className="relative w-full p-4">
        <div
          className="absolute left-3 top-4 mx-1"
          title={getLanguageDisclaimer(language, termTranslation)}
        >
          <Flag language={language} />
        </div>
        <div className="mt-10 lg:mt-0">
          <Search onSearch={onSearch} termTranslation={termTranslation} />
        </div>
        <div className="absolute right-3 top-4">
          {languages
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
      <div className="w-full flex flex-wrap gap-4 items-stretch p-4 pb-24">
        {repositories
          .filter(({ id }) => filter === undefined || filter.includes(id))
          .map((repository) => (
            <Card
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
