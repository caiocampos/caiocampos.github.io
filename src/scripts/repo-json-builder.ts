import fs, { mkdir } from "fs/promises";
import { configuration } from "@/global";
import { JsonGenerator } from "@/intefaces/config";
import {
  MinimalRepository,
  MinimalRepositoryTranslatedData,
} from "@/services/github/github-dtos";
import { GithubServices } from "@/services/github/github-services";
import { Language } from "@/types/languages";
import { getDescriptionTranslation } from "@/utils/language-utils";
import { calcStargazersForks } from "@/utils/repository-utils";
import { dirname } from "path";

const loadRepositories = async (): Promise<MinimalRepository[]> => {
  const repositoriesBruteData: MinimalRepository[] =
    await GithubServices.getCachedAllUserRepos(
      configuration.user_login,
      configuration.orgs_login,
    );
  return repositoriesBruteData;
};

const getTranslation = async (
  repository: MinimalRepository,
  config: JsonGenerator,
): Promise<MinimalRepositoryTranslatedData | null> => {
  if (repository.description === null) {
    return null;
  }
  const originalDescription = repository.description;
  const translated: MinimalRepositoryTranslatedData = {
    id: repository.id,
    name: repository.name,
    language: repository.language ?? null,
    html_url: repository.html_url,
    descriptions: { [config.source_language]: originalDescription },
  };
  const translations = await Promise.all(
    config.target_languages.map(async (language) => {
      const description = await getDescriptionTranslation(
        originalDescription,
        language as Language,
      );
      return { language, description };
    }),
  );
  for (const translation of translations) {
    translated.descriptions[translation.language] = translation.description;
  }
  return translated;
};

const getTranslations = async (
  repositories: MinimalRepository[],
  config: JsonGenerator,
): Promise<MinimalRepositoryTranslatedData[]> => {
  const repos: MinimalRepositoryTranslatedData[] = [];
  for (const repo of repositories) {
    const translated = await getTranslation(repo, config);
    if (translated === null) {
      continue;
    }
    repos.push(translated);
  }
  return repos;
};

const drawRepos = (
  repositories: MinimalRepository[],
  config: JsonGenerator,
): MinimalRepository[] => {
  const items: {
    key: number;
    repo: MinimalRepository;
  }[] = [];
  for (const repo of repositories) {
    if (repo.archived || repo.fork) {
      continue;
    }
    const u = Math.random();
    const w = calcStargazersForks(repo);
    const key = -Math.log(u) / w;
    items.push({
      key,
      repo,
    });
  }
  return items
    .sort((a, b) => a.key - b.key)
    .slice(0, config.max_size)
    .map(({ repo }) => repo);
};

const writeJSONFile = async (
  repos: MinimalRepositoryTranslatedData[],
  config: JsonGenerator,
): Promise<void> => {
  try {
    const folder = dirname(config.output_path);
    await mkdir(folder, { recursive: true });
    await fs.writeFile(
      config.output_path,
      JSON.stringify(repos, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error(`Error to write file ${config.output_path}`, err);
  }
};

const run = async (): Promise<void> => {
  const config = configuration.json_generator ?? null;
  if (config === null) {
    return;
  }
  const repos = await loadRepositories();
  const drawnRepos = drawRepos(repos, config);
  const translated = await getTranslations(drawnRepos, config);
  await writeJSONFile(translated, config);
};

run();
