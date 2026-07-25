"use client";
import Link from "next/link";
import { ChevronRight, Home, Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";
import { Review } from "@/types/review";
import { reviewService } from "@/services/review-service";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<Review["status"], { color: "success" | "warning" | "error"; label: string }> = {
  PUBLISHED: { color: "success", label: "Published" },
  PENDING: { color: "warning", label: "Pending" },
  HIDDEN: { color: "error", label: "Hidden" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const published = reviews.filter(r => r.status === "PUBLISHED").length;
  const pending = reviews.filter(r => r.status === "PENDING").length;
  const hidden = reviews.filter(r => r.status === "HIDDEN").length;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length === 0 ? 1 : reviews.length);

  const handleFetchReviews = async () => {
    try {
      const response = await reviewService.getAll();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (err: any) {
      console.log("Error fetching reviews: ", err);
    }
  };

  useEffect(() => {
    handleFetchReviews();
    return () => new AbortController().abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Reviews</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-400" size={24} /> Customer Reviews
        </h1>
        <p className="mt-1 text-sm text-tertiary">Manage product reviews, approve or hide customer feedback.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Star className="text-amber-500" />} accent="bg-amber-50" label="Avg Rating" value={`${avgRating.toFixed(1)} ★`} trend={+1} />
        <StatsCard icon={<ThumbsUp className="text-emerald-500" />} accent="bg-emerald-50" label="Published" value={published} trend={+2} />
        <StatsCard icon={<MessageSquare className="text-indigo-500" />} accent="bg-indigo-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<ThumbsDown className="text-rose-500" />} accent="bg-rose-50" label="Hidden" value={hidden} trend={0} />
      </div>

      <Table>
        <Thead>
          <THeading>Customer</THeading>
          <THeading>Product</THeading>
          <THeading>Rating</THeading>
          <THeading>Comment</THeading>
          <THeading>Status</THeading>
          <THeading>Date</THeading>
        </Thead>
        <TBody>
          {reviews.map(r => {
            const st = statusMap[r.status] ?? statusMap.PENDING;
            return (
              <tr key={r.id} className="hover:bg-secondary transition-colors">
                <TCell className="font-semibold text-primary">{r.customer.name}</TCell>
                <TCell className="text-secondary max-w-40 truncate">{r.product.name}</TCell>
                <TCell><StarRating rating={r.rating} /></TCell>
                <TCell className="text-tertiary italic max-w-65 truncate">"{r.comment}"</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
                <TCell className="text-tertiary">{r.createdAt}</TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}

