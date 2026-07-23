"use client";
import Link from "next/link";
import { ChevronRight, Home, Star, ThumbsUp, ThumbsDown, AlertOctagon, MessageSquare } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";
import { Review } from "@/types/review";
import { reviewService } from "@/services/review-service";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";

const statusStyle: Record<Review["status"], string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  HIDDEN: "bg-rose-50 text-rose-700 ring-rose-200",
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

  const [reviews , setReviews] = useState<Review[]>([]);

  const published = reviews.filter(r => r.status === "PUBLISHED").length;
  const pending = reviews.filter(r => r.status === "PENDING").length;
  const hidden = reviews.filter(r => r.status === "HIDDEN").length;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length === 0 ? 1 : reviews.length;


  const handleFetchReviews = async () => {
    try {
      const response = await reviewService.getAll();
      if(response.success) {
        setReviews(response.data);
      }
    }catch(err: any) {
      console.log("Error fetching reviews: ", err);
    }
  }

  useEffect(() => {
    handleFetchReviews();
    return () => new AbortController().abort();
  } , []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Reviews</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-400" size={24} /> Customer Reviews
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage product reviews, approve or hide customer feedback.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Star className="text-amber-500" />} accent="bg-amber-50" label="Avg Rating" value={`${avgRating.toFixed(1)} ★`} trend={+1} />
        <StatsCard icon={<ThumbsUp className="text-emerald-500" />} accent="bg-emerald-50" label="Published" value={published} trend={+2} />
        <StatsCard icon={<MessageSquare className="text-indigo-500" />} accent="bg-indigo-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<ThumbsDown className="text-rose-500" />} accent="bg-rose-50" label="Hidden" value={hidden} trend={0} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <Table>
          <Thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <THeading className="px-5 py-4 font-semibold">Customer</THeading>
            <THeading className="px-5 py-4 font-semibold">Product</THeading>
            <THeading className="px-5 py-4 font-semibold">Rating</THeading>
            <THeading className="px-5 py-4 font-semibold">Comment</THeading>
            <THeading className="px-5 py-4 font-semibold">Status</THeading>
            <THeading className="px-5 py-4 font-semibold">Date</THeading>
          </Thead>
          <TBody className="divide-y divide-slate-100">
            {reviews.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <TCell className="px-5 py-4 font-semibold text-slate-900">{r.customer.name}</TCell>
                <TCell className="px-5 py-4 text-slate-600 max-w-40 truncate">{r.product.name}</TCell>
                <TCell className="px-5 py-4"><StarRating rating={r.rating} /></TCell>
                <TCell className="px-5 py-4 text-slate-500 italic max-w-65 truncate">"{r.comment}"</TCell>
                <TCell className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[r.status]}`}>{r.status}</span>
                </TCell>
                <TCell className="px-5 py-4 text-slate-500">{r.createdAt}</TCell>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
