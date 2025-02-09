import { auth } from "@/auth";

export default async function Page() {
  const session = await auth()

  console.log(session)
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1>profile</h1>
    </main>
  );
}
