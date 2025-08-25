"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Star, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const reviews = [
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

export default function ReviewsSection() {
  const [rating, setRating] = useState(0); // selected rating
  const [hover, setHover] = useState(0); // hover state for highlight
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // photo previews

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  return (
    <section
      id="reviews"
      className="bg-white py-24 border-t border-gray-200 scroll-mt-20"
    >
      <MaxWidthWrapper>
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Loved by <span className="text-orange-600">Our Users</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thousands of people have already created their own unique Casca
            cases. Here’s what they have to say:
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <img
                  src={review.img}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mt-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-orange-500 fill-orange-500"
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                "{review.review}"
              </p>

              {/* Uploaded Photos */}
              {review.photos.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {review.photos.map((photo, i) => (
                    <img
                      key={i}
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

        {/* Inline Review Form */}
        <div className="mt-16 max-w-xl mx-auto bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30">
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Write a Review
          </h3>

          <form className="mt-6 space-y-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Role (e.g. Student, Designer)" />

            {/* Star Rating Input */}
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
              className="w-full rounded-xl border border-gray-300 bg-white/70 p-3 shadow-sm focus:border-black focus:ring-2 focus:ring-black/30 min-h-[120px]"
              rows={4}
            />

            {/* Photo Upload */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-orange-600 font-medium">
                <Upload className="h-5 w-5" />
                Upload Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {selectedImages.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {selectedImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="preview"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-300"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
