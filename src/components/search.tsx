import { useState } from "react";
import { SearchIcon, XIcon } from "@primer/octicons-react";

interface SearchProps {
  onSearch(text: string): void;
}

export const Search = ({ onSearch }: SearchProps): JSX.Element => {
  const [text, setText] = useState("");
  return (
    <form
      className="max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(text);
      }}
    >
      <div className="flex">
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-slate-100/[.9] dark:bg-slate-900/[.9] dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100 dark:focus:border-blue-500"
            placeholder="Buscar por termo"
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
          <button
            type="button"
            className="absolute top-0 end-8 h-full p-2.5 flex items-center pe-3 text-gray-400 dark:text-gray-400"
            onClick={() => {
              setText("");
              onSearch("");
            }}
          >
            <XIcon size="small" />
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white rounded-e-lg border border-sky-700 bg-sky-700 hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700 active:bg-sky-900 dark:active:bg-sky-800"
            onClick={() => onSearch(text)}
          >
            <SearchIcon size="small" />
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};
