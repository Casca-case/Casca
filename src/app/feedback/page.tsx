"use client";
import { useState } from "react";

type Category = "Bug report" | "Feature request" | "General feedback";

interface FeedbackForm {
  rating: number;            // 1–5 stars
  category: Category;
  nps: number | null;        // 0–10
  message: string;
  images: string[];          // base64 previews (client-only)
  email?: string;
  okToContact: boolean;
  consent: boolean;          // agree to store feedback
}

export default function FeedbackPage() {
  const [form, setForm] = useState<FeedbackForm>({
    rating: 0,
    category: "General feedback",
    nps: null,
    message: "",
    images: [],
    email: "",
    okToContact: false,
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((imgs) =>
      setForm((prev) => ({ ...prev, images: [...prev.images, ...imgs] }))
    );
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const canSubmit =
    form.rating > 0 &&
    form.message.trim().length > 0 &&
    form.consent &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    // TODO: POST to your API route when backend is ready.
    // await fetch("/api/feedback", { method: "POST", body: JSON.stringify(form) });

    // Demo success:
    console.log("Feedback submitted:", form);
    setSubmitted(true);
    setSubmitting(false);
    // Reset after a moment if you want
    // setForm({ ...defaultState });
  };

  if (submitted) {
    return (
      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Thanks for your feedback! 🎉</h1>
          <p className="text-gray-600 mb-6">
            We appreciate you taking the time to help us improve.
          </p>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            onClick={() => setSubmitted(false)}
          >
            Submit another response
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feedback</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        {/* Overall rating (stars) */}
        <div>
          <label className="block font-medium mb-2">Overall rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setForm((p) => ({ ...p, rating: n }))}
                className={`text-3xl leading-none ${
                  form.rating >= n ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
            {form.rating > 0 && (
              <span className="text-sm text-gray-600">({form.rating}/5)</span>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-2">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value as Category }))
            }
          >
            <option>General feedback</option>
            <option>Bug report</option>
            <option>Feature request</option>
          </select>
        </div>

        {/* NPS (0–10) */}
        <div>
          <label className="block font-medium mb-2">
            How likely are you to recommend us to a friend? (0–10)
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((p) => ({ ...p, nps: n }))}
                className={`w-9 h-9 rounded-md border text-sm ${
                  form.nps === n ? "bg-black text-white" : "bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            {form.nps !== null && (
              <span className="text-sm text-gray-600">({form.nps})</span>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block font-medium mb-2">Your feedback</label>
          <textarea
            rows={3}
            maxLength={240}
            placeholder="Keep it short and clear (2–3 lines)…"
            className="w-full border p-3 rounded"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {240 - form.message.length} characters left
          </div>
        </div>

        {/* Screenshots / photos */}
        <div>
          <label className="block font-medium mb-2">Screenshots / photos (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full border p-2 rounded"
            onChange={handleImageUpload}
          />
          {form.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`attachment-${i}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 leading-6 text-center opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block font-medium mb-2">
              Email (optional, for follow-up)
            </label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input
              id="okToContact"
              type="checkbox"
              checked={form.okToContact}
              onChange={(e) =>
                setForm((p) => ({ ...p, okToContact: e.target.checked }))
              }
              className="w-4 h-4"
            />
            <label htmlFor="okToContact" className="text-sm text-gray-700">
              It’s okay to contact me about this feedback.
            </label>
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) =>
              setForm((p) => ({ ...p, consent: e.target.checked }))
            }
            className="mt-1 w-4 h-4"
            required
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I agree my feedback may be stored and used to improve the product.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-3 rounded-lg text-white ${
            canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
          }`}
        >
          {submitting ? "Submitting…" : "Submit feedback"}
        </button>

        {/* Small helper text */}
        <p className="text-xs text-gray-500 text-center">
          Thanks for helping us improve!
        </p>
      </form>
    </main>
  );
}
