import { useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
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

interface RepositoriesGetStaticProps {
  repositories: RepositoryData[];
  wordDictionary: RepositoryWordDictionary;
}

export const getStaticProps: GetStaticProps<RepositoriesGetStaticProps> =
  (async () => {
    const repositoriesBruteData: MinimalRepository[] = (
      await GithubServices.getAllUserRepos(configguration.user_login)
    ).sort(repositoryComparison);
    const repositories: RepositoryData[] =
      repositoriesBruteData.map(parseRepositoryData);
    const wordDictionary = createRepositoryWordDictionary(
      repositoriesBruteData
    );
    return { props: { repositories, wordDictionary } };
  }) satisfies GetStaticProps<RepositoriesGetStaticProps>;

export default function Home({
  repositories,
  wordDictionary,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const [filter, setFilter] = useState<number[] | undefined>(undefined);
  const onSearch = (text: string): void => {
    setFilter(filterResult(text, wordDictionary));
  };
  return (
    <div className="w-screen">
      <Head>
        <title>{configguration.title}</title>
      </Head>
      <div className="w-full p-4">
        <Search onSearch={onSearch} />
      </div>
      <div className="w-full flex flex-wrap gap-4 items-stretch p-4 pb-24">
        {repositories
          .filter(({ id }) => filter === undefined || filter.includes(id))
          .map((repository) => (
            <Card key={`repo-card-${repository.id}`} {...repository} />
          ))}
      </div>
      <Footer />
    </div>
  );
}
