export interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  rating: number;
  reviewText: string;
  photos?: string[]; // Array of image URLs or base64 strings
  createdAt: Date | string;
  userAvatar?: string;
}

export interface CreateReviewInput {
  userName: string;
  userRole: string;
  rating: number;
  reviewText: string;
  photos?: string[];
}
