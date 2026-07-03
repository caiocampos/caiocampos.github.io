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
  pageSize = 3,
): Promise<MinimalRepositoryTranslatedData[]> => {
  const base = [...repositories];
  const repos: MinimalRepositoryTranslatedData[] = [];
  while (base.length > 0) {
    const page = base.splice(0, pageSize);
    const translatedPage = await Promise.all(
      page.map((repo) => getTranslation(repo, config)),
    );
    for (const item of translatedPage) {
      if (item === null) {
        continue;
      }
      repos.push(item);
    }
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
    if (repo.archived || repo.fork || repo.description === null) {
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

const createMDRecords = (
  repos: MinimalRepositoryTranslatedData[],
  config: JsonGenerator,
): Record<string, string> => {
  const languages = [config.source_language, ...config.target_languages];
  const record: Record<string, string> = {};

  for (const language of languages) {
    record[`repos_${language}`] = repos
      .map((repo) => {
        const description = repo.descriptions[language];
        if (description === undefined) {
          return "";
        }
        return `[${repo.name}](${repo.html_url})\n\n${description}`;
      })
      .join("\n<br><br>\n");
  }
  return record;
};

const writePartialJSONFile = async (
  repos: MinimalRepositoryTranslatedData[],
  config: JsonGenerator,
): Promise<void> => {
  try {
    const folder = dirname(config.partial_output_path);
    await mkdir(folder, { recursive: true });
    await fs.writeFile(
      config.partial_output_path,
      JSON.stringify(repos, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error(`Error to write file ${config.partial_output_path}`, err);
  }
};

const writeFinalJSONFile = async (
  record: Record<string, string>,
  config: JsonGenerator,
): Promise<void> => {
  try {
    const folder = dirname(config.final_output_path);
    await mkdir(folder, { recursive: true });
    await fs.writeFile(
      config.final_output_path,
      JSON.stringify(record, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error(`Error to write file ${config.final_output_path}`, err);
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
  await writePartialJSONFile(translated, config);

  const md = createMDRecords(translated, config);
  await writeFinalJSONFile(md, config);
};

run();
