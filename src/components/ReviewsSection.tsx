"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Star, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Review } from "@/types/review";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "./ui/button";

interface ReviewsSectionProps {
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

const showcaseReviews = [
  {
    name: "Aditi Sharma",
    role: "Student",
    review:
      "Absolutely love my Casca case! The quality is amazing and the customization process was so smooth.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    photos: [],
  },
  {
    name: "Rohit Mehta",
    role: "Photographer",
    review:
      "The print quality is stunning. My design looks exactly how I imagined. Highly recommend Casca!",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    photos: [],
  },
  {
    name: "Sanya Verma",
    role: "Designer",
    review:
      "I was surprised at how quickly it arrived. The case feels premium and durable while still stylish.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/75.jpg",
    photos: [],
  },
];

export default function ReviewsSection({
  isAuthenticated,
  userId,
  userName,
  userAvatar,
}: ReviewsSectionProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(userName || "");
  const [role, setRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reviewsPerPage = 3;

  // Fetch user reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setUserReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Combine showcase reviews with user reviews
  const allReviews = [
    ...showcaseReviews,
    ...userReviews.map((review) => ({
      name: review.userName,
      role: review.userRole,
      review: review.reviewText,
      rating: review.rating,
      img: review.userAvatar || "",
      photos: review.photos || [],
    })),
  ];

  // Calculate total pages
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  
  // Get current reviews to display
  const currentReviews = allReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Please login to submit a review");
      return;
    }

    if (!rating || !name || !role || !reviewText) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: name,
          userRole: role,
          rating,
          reviewText,
          photos: selectedImages,
        }),
      });

      if (response.ok) {
        // Reset form
        setRating(0);
        setRole("");
        setReviewText("");
        setSelectedImages([]);
        alert("Review submitted successfully!");
        
        // Refresh reviews
        fetchReviews();
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="bg-slate-50 py-24 min-h-screen"
    >
      <MaxWidthWrapper>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Loved by <span className="text-orange-600">Our Users</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thousands of people have already created their own unique Casca
            cases. Here's what they have to say:
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative mt-16">
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg hover:scale-110 -translate-x-4 md:-translate-x-6"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg hover:scale-110 translate-x-4 md:translate-x-6"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Reviews Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 px-8 md:px-12">
            {currentReviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <div className="flex items-center gap-4">
                {review.img ? (
                  <img
                    src={review.img}
                    alt={review.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-xl font-bold text-orange-600">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mt-4">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-5 w-5 text-orange-500 fill-orange-500"
                  />
                ))}
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed">
                "{review.review}"
              </p>

              {review.photos && review.photos.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {review.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="review photo"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-300"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

          {/* Page Indicator */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? "w-8 bg-orange-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Write a Review Form */}
        <div className="mt-16 max-w-xl mx-auto bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30">
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Write a Review
          </h3>

          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-6">
                Please login to write a review
              </p>
              <LoginLink
                className={buttonVariants({
                  size: "lg",
                  className: "bg-orange-600 hover:bg-orange-700",
                })}
              >
                Login to Review
              </LoginLink>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input 
                placeholder="Your Role (e.g. Student, Designer)" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />

              <div className="flex justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <Star
                      key={i}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      className={`h-8 w-8 cursor-pointer transition 
                        ${
                          starValue <= (hover || rating)
                            ? "text-orange-500 fill-orange-500"
                            : "text-gray-300"
                        }`}
                    />
                  );
                })}
              </div>

              <textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white/70 p-3 shadow-sm focus:border-black focus:ring-2 focus:ring-black/30 min-h-[120px]"
                rows={4}
                required
              />

              <div className="mt-4">
                <label 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 cursor-pointer text-orange-600 font-medium hover:text-orange-700"
                >
                  <Upload className="h-5 w-5" />
                  Upload Photos
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {selectedImages.length > 0 && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {selectedImages.map((src, i) => (
                      <div key={i} className="relative">
                        <img
                          src={src}
                          alt="preview"
                          className="h-20 w-20 rounded-lg object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImages((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}