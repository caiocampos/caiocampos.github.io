import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/router";
import { TermTranslationAdapter } from "@/intefaces/translation";
import { configuration } from "@/global";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";

interface SearchProps extends TermTranslationAdapter {
  onSearch(text: string): void;
}

const searchInputClassNames = [
  "block",
  "p-2.5",
  "w-full",
  "text-sm",
  "text-gray-900",
  "rounded-lg",
  "border",
  "border-gray-400",
  "focus:ring-blue-500",
  "focus:border-blue-500",
  `bg-${configuration.main_color}-100/[.9]`,
  `dark:bg-${configuration.main_color}-900/[.9]`,
  "dark:border-gray-600",
  "dark:placeholder-gray-400",
  "dark:text-gray-100",
  "dark:focus:border-blue-500",
];

const searchClearButtonClassNames = [
  "absolute",
  "top-0",
  "end-8",
  "h-full",
  "p-2.5",
  "flex",
  "items-center",
  "pe-3",
  "text-gray-400",
  "dark:text-gray-400",
];

const searchButtonClassNames = [
  "absolute",
  "top-0",
  "end-0",
  "h-full",
  "p-2.5",
  "text-sm",
  "font-medium",
  "text-white",
  "rounded-e-lg",
  "border",
  `border-${configuration.search_color}-700`,
  `bg-${configuration.search_color}-700`,
  `hover:bg-${configuration.search_color}-800`,
  `dark:bg-${configuration.search_color}-600`,
  `dark:hover:bg-${configuration.search_color}-700`,
  `active:bg-${configuration.search_color}-900`,
  `dark:active:bg-${configuration.search_color}-800`,
];

const searchKey = "s";

export const SearchInput = ({
  onSearch,
  termTranslation,
}: SearchProps): JSX.Element => {
  const [text, setText] = useState("");
  const router = useRouter();
  const search = (value: string): void => {
    onSearch(value);
    router.query[searchKey] = value;
    router.push(router);
  };
  useEffect(() => {
    const query = router.query;
    const searchValue =
      typeof query[searchKey] === "string" ? query[searchKey] : "";
    setText(searchValue);
    onSearch(searchValue);
  }, [router.query, onSearch]);
  return (
    <form
      className="max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        search(text);
      }}
    >
      <div className="flex">
        <div className="relative w-full">
          <input
            type="search"
            className={cn(searchInputClassNames)}
            placeholder={termTranslation.search}
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
          <button
            type="button"
            className={cn(searchClearButtonClassNames)}
            onClick={() => {
              setText("");
              search("");
            }}
          >
            <X size={16} />
          </button>
          <button
            type="button"
            className={cn(searchButtonClassNames)}
            onClick={() => {
              search(text);
            }}
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </form>
  );
};
