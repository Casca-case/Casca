import { firestoreService } from "@/lib/firestore";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  picture: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!user.email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Find or create user in Firestore
    const dbUser = await firestoreService.upsertUser({
      id: user.id,
      email: user.email as string,
      ...validatedData,
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
