import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Card } from "../components/card";
import { RepositoryData } from "../intefaces/repository-data";
import Head from "next/head";
import { configguration } from "@/global";
import { Footer } from "@/components/footer";

interface RepositoriesGetStaticProps {
  repositories: RepositoryData[];
}

export const getStaticProps: GetStaticProps<RepositoriesGetStaticProps> =
  (async () => {
    const res: Response = await fetch(
      `https://api.github.com/users/${configguration.user_login}/repos?sort=updated`
    );
    const repositoriesBruteData: RepositoryData[] = await res.json();
    const repositories = repositoriesBruteData.map(
      ({
        id,
        name,
        html_url,
        description,
        language,
        homepage,
        archived,
        fork,
      }) => ({
        id,
        name,
        html_url,
        description,
        language,
        homepage,
        archived,
        fork,
      })
    );
    return { props: { repositories } };
  }) satisfies GetStaticProps<RepositoriesGetStaticProps>;

export default function Home({
  repositories,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
    <div className="w-screen">
      <Head>
        <title>{configguration.title}</title>
      </Head>
      <div className="w-full flex flex-wrap gap-4 items-stretch p-4 pb-24">
        {repositories.map((repository) => (
          <Card key={`repo-card-${repository.id}`} {...repository} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
