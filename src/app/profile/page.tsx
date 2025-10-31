import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 py-12">
      <MaxWidthWrapper className="py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-6 shadow-lg">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>

          {/* Profile Form Card */}
          <ProfileForm user={user} />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
