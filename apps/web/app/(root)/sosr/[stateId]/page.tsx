import { redirect } from "next/navigation";
import { getStates } from "@/db/queries";

type Props = {
  params: Promise<{ stateId: string }>;
};

export default async function Page({ params }: Props) {
  const { stateId } = await params;
  const states = await getStates();

  if (!states.some((state) => state.id === stateId)) {
    redirect("/sosr/MEX/single");
  }

  redirect(`/sosr/${stateId}/single`);
}
