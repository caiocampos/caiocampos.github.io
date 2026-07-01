import { configuration } from "@/global";
import { JsonGenerator } from "@/intefaces/config";
import {
  MinimalRepository,
  MinimalRepositoryTranslatedData,
} from "@/services/github/github-dtos";
import { GithubServices } from "@/services/github/github-services";
import { Language } from "@/types/languages";
import { getRepositoryTranslation } from "@/utils/language-utils";

const loadRepositories = async (): Promise<MinimalRepository[]> => {
  const repositoriesBruteData: MinimalRepository[] =
    await GithubServices.getCachedAllUserRepos(
      configuration.user_login,
      configuration.orgs_login,
    );
  return repositoriesBruteData;
};

const getTranslations = async (
  repositoriesBruteData: MinimalRepository[],
  config: JsonGenerator,
): Promise<MinimalRepositoryTranslatedData[]> => {
  const repos: MinimalRepositoryTranslatedData[] = [];
  for (const repo of repositoriesBruteData) {
    if (repo.archived || repo.fork || repo.description === null) {
      continue;
    }
    const translated: MinimalRepositoryTranslatedData = {
      id: repo.id,
      name: repo.name,
      language: repo.language ?? null,
      html_url: repo.html_url,
      descriptions: { [config.source_language]: repo.description },
    };
    const translations = await Promise.all(
      config.target_languages.map(async (lang) => {
        const translatedRepo = await getRepositoryTranslation(
          repo,
          lang as Language,
        );
        return { language: lang, description: translatedRepo.description };
      }),
    );
    for (const translation of translations) {
      translated.descriptions[translation.language] =
        translation.description ?? "";
    }
    repos.push(translated);
  }
  return repos;
};

const run = async (): Promise<void> => {
  if (
    configuration.json_generator === undefined ||
    configuration.json_generator === null
  ) {
    return;
  }
  const repos = await loadRepositories();
  const translated = await getTranslations(repos, configuration.json_generator);
  console.log(JSON.stringify(translated));
};

run();