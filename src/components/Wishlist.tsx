"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WishlistItem {
  id: string;
  imageUrl?: string;
  title: string;
  description?: string;
  userId?: string;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Temporary user ID (replace later when auth is added)
  const userId = "user123";

  // Fetch wishlist items from Firestore
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const wishlistRef = collection(db, "wishlist");
        const q = query(wishlistRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const wishlistItems: WishlistItem[] = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<WishlistItem, "id">),
        }));

        setItems(wishlistItems);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  // Remove item from wishlist
  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "wishlist", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  // UI rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">My Favorites ❤️</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t added anything to your wishlist yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
              {item.description && (
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-auto px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
