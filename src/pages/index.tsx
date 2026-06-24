import { useEffect } from "react";
import { useRouter } from "next/router";
import { defaultLanguage, languages } from "@/utils/language-utils";

export default function Home(): void {
  const router = useRouter();

  useEffect(() => {
    const { language } = window?.navigator;
    const userLanguage = languages().find((l) => language.startsWith(l));
    router.push(`/home/${userLanguage ?? defaultLanguage()}`);
  }, [router]);
}
