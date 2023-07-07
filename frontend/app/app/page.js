import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return redirect("api/auth/signin");
  } else {
    return redirect("/dashboard/home");
  }
}
