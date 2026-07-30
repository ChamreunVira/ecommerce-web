"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Home, Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Review } from "@/types/review";
import { reviewService } from "@/services/review-service";
import { Table, TableCard } from "@/components/application/table/table";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<Review["status"], { color: "success" | "warning" | "error"; label: string }> = {
  PUBLISHED: { color: "success", label: "Published" },
  PENDING: { color: "warning", label: "Pending" },
  HIDDEN: { color: "error", label: "Hidden" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const published = reviews.filter((r) => r.status === "PUBLISHED").length;
  const pending = reviews.filter((r) => r.status === "PENDING").length;
  const hidden = reviews.filter((r) => r.status === "HIDDEN").length;
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
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Reviews</span>
      </nav>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
          <Star className="fill-amber-400 text-amber-400" size={24} /> Customer Reviews
        </h1>
        <p className="mt-1 text-sm text-tertiary">Manage product reviews, approve or hide customer feedback.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Star className="text-amber-500" />} accent="bg-amber-50" label="Avg Rating" value={`${avgRating.toFixed(1)} ★`} trend={+1} />
        <StatsCard icon={<ThumbsUp className="text-emerald-500" />} accent="bg-emerald-50" label="Published" value={published} trend={+2} />
        <StatsCard icon={<MessageSquare className="text-indigo-500" />} accent="bg-indigo-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<ThumbsDown className="text-rose-500" />} accent="bg-rose-50" label="Hidden" value={hidden} trend={0} />
      </div>

      <TableCard.Root>
        <Table aria-label="Reviews table">
          <Table.Header>
            <Table.Head id="customer" label="Customer" isRowHeader allowsSorting />
            <Table.Head id="product" label="Product" allowsSorting />
            <Table.Head id="rating" label="Rating" allowsSorting />
            <Table.Head id="comment" label="Comment" />
            <Table.Head id="status" label="Status" />
            <Table.Head id="date" label="Date" allowsSorting />
          </Table.Header>

          <Table.Body items={reviews}>
            {(r) => {
              const st = statusMap[r.status] ?? statusMap.PENDING;
              return (
                <Table.Row id={r.id}>
                  <Table.Cell className="font-semibold text-primary">{r.customer.name}</Table.Cell>
                  <Table.Cell className="max-w-40 truncate text-secondary">{r.product.name}</Table.Cell>
                  <Table.Cell>
                    <StarRating rating={r.rating} />
                  </Table.Cell>
                  <Table.Cell className="max-w-65 truncate italic text-tertiary">"{r.comment}"</Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={st.color} size="sm">
                      {st.label}
                    </BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell className="text-tertiary">{r.createdAt}</Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {reviews.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <Star className="size-5" />
            </div>
            <p className="text-sm font-semibold text-primary">No customer reviews</p>
            <p className="text-xs text-tertiary">Product reviews will appear here once submitted.</p>
          </div>
        )}

        <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{reviews.length}</span> {reviews.length !== 1 ? "reviews" : "review"}
          </span>
        </div>
      </TableCard.Root>
    </div>
  );
}
