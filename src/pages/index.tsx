import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home(): void {
  const router = useRouter();

  useEffect(() => {
    router.push("/home/pt");
  }, [router]);
}
