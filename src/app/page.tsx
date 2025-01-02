import { auth } from "./auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex items-center justify-center grow p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">
          hello {session ? session?.user?.name : "Anonymous user"}
        </h1>
      </div>
    </div>
  );
}
