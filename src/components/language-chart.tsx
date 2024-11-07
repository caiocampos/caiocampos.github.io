import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { regexSpecial } from "@/utils/string-utils";
import { RepositoryData } from "@/intefaces/repository-data";
import {
  TermTranslation,
  TermTranslationAdapter,
} from "@/intefaces/translation";
import { useMemo } from "react";

interface LanguageChartProps extends TermTranslationAdapter {
  repositories: RepositoryData[];
}

interface ChartData {
  languageName: string;
  languageKey: string;
  count: number;
  fill: string;
}

const getChartData = (
  repositories: RepositoryData[],
  termTranslation: TermTranslation
): ChartData[] => {
  const countData: Record<string, number> = {};
  repositories.forEach((repository) => {
    let key = repository.language ?? "null";
    switch (key) {
      case "JavaScript":
      case "TypeScript":
        key = "JavaScript/TypeScript";
        break;
      case "C":
      case "C++":
        key = "C/C++";
        break;
      default:
    }
    const countValue = countData[key] !== undefined ? countData[key] + 1 : 1;
    countData[key] = countValue;
  });
  const [a, b, c, d, ...rest] = Object.entries(countData)
    .map(([key, value]): ChartData => {
      const languageKey = key.replace(regexSpecial, "-").toLowerCase();
      return {
        languageName: key,
        languageKey,
        count: value,
        fill: `var(--color-${languageKey})`,
      };
    })
    .sort((a, b) => {
      if (a.languageKey === "null") {
        return Number.MAX_SAFE_INTEGER;
      }
      if (b.languageKey === "null") {
        return Number.MIN_SAFE_INTEGER;
      }
      return b.count - a.count;
    });
  const others = {
    languageName: termTranslation.other,
    languageKey: "other",
    count: 0,
    fill: "var(--color-other)",
  };
  rest.forEach(({ count }) => (others.count += count));
  return [a, b, c, d, others];
};

const getChartConfig = (chartData: ChartData[]) => {
  const config: ChartConfig = {};
  chartData.forEach(({ languageName, languageKey }, i) => {
    config[languageKey] = {
      label: languageName,
      color: `hsl(var(--chart-${i + 1}))`,
    };
  });
  return config;
};

export const LanguageChart = ({
  repositories,
  termTranslation,
}: LanguageChartProps): JSX.Element => {
  const [chartData, chartConfig] = useMemo(() => {
    if (repositories?.length === 0) {
      return [[], {}];
    }
    const chartData = getChartData(repositories, termTranslation);
    const chartConfig = getChartConfig(chartData);
    return [chartData, chartConfig];
  }, [repositories, termTranslation]);
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="languageKey"
          innerRadius={30}
          label
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="languageKey" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
};
