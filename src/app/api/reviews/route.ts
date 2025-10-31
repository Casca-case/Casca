import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { Review, CreateReviewInput } from "@/types/review";

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to submit a review." },
        { status: 401 }
      );
    }

    const body: CreateReviewInput = await req.json();
    const { userName, userRole, rating, reviewText, photos } = body;

    // Validation
    if (!userName || !userRole || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create review document
    const reviewData = {
      userId: user.id,
      userName,
      userRole,
      rating,
      reviewText,
      photos: photos || [],
      userAvatar: user.picture || "",
      createdAt: serverTimestamp(),
    };

    const reviewsCollection = collection(db, "reviews");
    const docRef = await addDoc(reviewsCollection, reviewData);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        reviewId: docRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

// GET - Fetch all reviews
export async function GET(req: NextRequest) {
  try {
    const reviewsCollection = collection(db, "reviews");
    const q = query(reviewsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        rating: data.rating,
        reviewText: data.reviewText,
        photos: data.photos || [],
        userAvatar: data.userAvatar || "",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    return NextResponse.json(
      {
        success: true,
        reviews,
        count: reviews.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
