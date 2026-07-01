import { HTMLProps, JSX } from "react";
import { useRouter } from "next/router";
import { getLanguageDisclaimer, Language } from "@/utils/language-utils";
import { ButtonGroup, ButtonGroupText } from "./ui/button-group";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Flag } from "./flag";
import { TermTranslationAdapter } from "@/intefaces/translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LanguageSelectorProps extends TermTranslationAdapter {
  languageList: Language[];
  className?: HTMLProps<HTMLElement>["className"];
}

export const LanguageSelector = ({
  languageList,
  termTranslation,
  className,
}: LanguageSelectorProps): JSX.Element => {
  const router = useRouter();
  if (languageList.length === 0) {
    return <></>;
  }
  const dropdownMenuButton = (
    <Button
      className="border border-gray-600 dark:border-gray-400"
      variant="secondary"
      size="icon"
      title={termTranslation.toggleLanguage}
    >
      <Languages className="h-[1.2rem] w-[1.2rem] transition-all" />
      <span className="sr-only">{termTranslation.toggleLanguage}</span>
    </Button>
  );
  return (
    <div className={className}>
      <ButtonGroup className="max-[700px]:hidden">
        <ButtonGroupText>
          <Languages className="text-black dark:text-white" />
        </ButtonGroupText>
        {languageList.map((l) => (
          <Button
            key={l}
            variant="secondary"
            onClick={() => {
              router.push(`/home/${l}`);
            }}
            title={getLanguageDisclaimer(l, termTranslation)}
          >
            {l.toUpperCase()}
            <Flag language={l} />
          </Button>
        ))}
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="min-[700px]:hidden"
          render={dropdownMenuButton}
        />
        <DropdownMenuContent align="end" className="z-110">
          {languageList.map((l) => (
            <DropdownMenuItem
              key={l}
              onClick={() => {
                router.push(`/home/${l}`);
              }}
              title={getLanguageDisclaimer(l, termTranslation)}
            >
              <Flag language={l} />
              {l.toUpperCase()}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
