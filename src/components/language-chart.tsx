import { LabelList, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
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

const NL = "null";

const getChartData = (
  repositories: RepositoryData[],
  termTranslation: TermTranslation
): ChartData[] => {
  const countData: Record<string, number> = {};
  repositories.forEach((repository) => {
    let key = repository.language ?? NL;
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
  const languageData = Object.entries(countData)
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
      if (a.languageKey === NL) {
        return Number.MAX_SAFE_INTEGER;
      }
      if (b.languageKey === NL) {
        return Number.MIN_SAFE_INTEGER;
      }
      return b.count - a.count;
    });
  let begin: ChartData[] = [];
  let rest: ChartData[] = [];
  if (languageData.length >= 5) {
    if (languageData.length === 5 && countData[NL] === undefined) {
      begin = languageData;
    } else {
      begin = languageData.splice(0, 4);
      rest = languageData;
    }
  } else if (languageData.length <= 1) {
    if (countData[NL] === undefined) {
      begin = languageData;
    } else {
      rest = languageData;
    }
  } else {
    if (countData[NL] === undefined) {
      begin = languageData;
    } else {
      begin = languageData.splice(0, languageData.length - 1);
      rest = languageData;
    }
  }
  if (rest.length === 0) {
    return begin;
  }
  const others = {
    languageName: termTranslation.other,
    languageKey: "other",
    count: 0,
    fill: "var(--color-other)",
  };
  rest.forEach(({ count }) => (others.count += count));
  return [...begin, others];
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
      className="mx-auto aspect-square max-h-[250px] min-w-80"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="fill-gray-100" />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="languageKey"
          innerRadius={30}
        >
          <LabelList
            dataKey="count"
            className="fill-gray-100 font-bold"
            stroke="1"
            fontSize={12}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="languageKey" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-gray-900 dark:text-gray-100"
        />
      </PieChart>
    </ChartContainer>
  );
};
