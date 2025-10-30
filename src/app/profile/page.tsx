import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <MaxWidthWrapper className="py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfileForm user={user} />
      </div>
    </MaxWidthWrapper>
  );
}
