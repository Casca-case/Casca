import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ GET: Fetch all wishlist items
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "wishlist"));
    const wishlist = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add a new item to wishlist
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { configurationId, imageUrl, title, description, userId } = body;

    if (!configurationId) {
      return NextResponse.json(
        { error: "Missing configurationId" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "wishlist"), {
      configurationId,
      imageUrl: imageUrl || null,
      title: title || "Untitled",
      description: description || "",
      userId: userId || "guestUser",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

// ✅ DELETE: Remove an item from wishlist (optional, but useful)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "Missing wishlist item ID" }, { status: 400 });

    await deleteDoc(doc(db, "wishlist", id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
