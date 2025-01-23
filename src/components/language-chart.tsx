import { JSX, useMemo } from "react";
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
import { cn } from "@/lib/utils";
import { configuration } from "@/global";

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
  let nlCount = countData[NL] ?? 0;
  const languageData = Object.entries(countData)
    .filter(([key, value]) => {
      const min = configuration.min_language_count ?? 1;
      if (min > 1 && value < min && key !== NL) {
        nlCount = nlCount + value;
        return false;
      }
      return true;
    })
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
  if (languageData.length >= 9) {
    if (languageData.length === 9 && nlCount === 0) {
      begin = languageData;
    } else {
      begin = languageData.splice(0, 8);
      rest = languageData;
    }
  } else if (languageData.length <= 1) {
    if (nlCount === 0) {
      begin = languageData;
    } else {
      rest = languageData;
    }
  } else {
    if (nlCount === 0) {
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
  rest.forEach(
    ({ languageKey, count }) =>
      (others.count += languageKey === NL ? nlCount : count)
  );
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

const languageChartClassNames = [
  "mx-auto",
  "aspect-square",
  "max-h-300",
  "min-w-80",
];

const languageChartLegendClassNames = [
  "-translate-y-2",
  "flex-wrap",
  "gap-2",
  "text-gray-900",
  "dark:text-gray-100",
  "*:basis-1/4",
  "*:justify-center",
  "[&>div>*]:rounded",
  "[&>div>*]:border",
  "[&>div>*]:border-gray-900/[.5]",
  "dark:[&>div>*]:border-gray-100/[.5]",
];

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
      className={cn(languageChartClassNames)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="languageKey"
          innerRadius={32}
          outerRadius={96}
          stroke="rgba(255,255,255,0.5)"
        >
          <LabelList
            dataKey="count"
            className="fill-gray-100 font-bold"
            stroke="1"
            fontSize={14}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="languageKey" />}
          className={cn(languageChartLegendClassNames)}
        />
      </PieChart>
    </ChartContainer>
  );
};
