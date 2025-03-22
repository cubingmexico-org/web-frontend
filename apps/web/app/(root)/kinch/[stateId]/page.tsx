import { SearchParams } from "@/types";

export default async function Page(props: {
  params: Promise<{ stateId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const stateId = (await props.params).stateId;

  return <main className="flex-grow">{stateId}</main>;
}
