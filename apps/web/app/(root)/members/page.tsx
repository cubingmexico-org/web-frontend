import { Members } from "./_components/members";
import { getMollerzMembers } from "./_lib/queries";

export default async function Page() {
  const members = await getMollerzMembers();

  return <Members members={members} />;
}
