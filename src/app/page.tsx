import { CineSync } from "@/components/cine-sync";

export default function Home({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  return <CineSync initialView={searchParams.view} />;
}
