"use client";


import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { productService } from "@/services/product-service";
import { reviewService } from "@/services/review-service";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, router, handleAddProductToCart } = useAppContext();
  const [primaryImg, setPrimaryImg] = useState<string | null>(null);
  const [productData, setProductData] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [draftReview, setDraftReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchProductById = async () => {
      try {
        const response = await productService.getById(Number(id));
        if (response.success && isCurrent) {
          setProductData(response.data);
          setPrimaryImg(response.data.images[0] || null);
          setQuantity(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductById();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  useEffect(() => {
    let isCurrent = true;

    const fetchReviews = async () => {
      if (!productData?.id) return;

      try {
        const response = await reviewService.getAll();
        if (response.success && isCurrent) {
          const productReviews = response.data.filter(
            (review) => review.product.id === productData.id
          );
          setReviews(productReviews);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();

    return () => {
      isCurrent = false;
    };
  }, [productData?.id]);

  const relatedProducts = useMemo(() => {
    if (!productData) return [];

    return products
      .filter(
        (product) =>
          product.categoryName === productData.categoryName &&
          product.id !== productData.id
      )
      .slice(0, 5);
  }, [productData, products]);

  const finalPrice = productData
    ? productData.price - productData.price * (productData.discount / 100)
    : 0;

  const handleSwitchImage = (index: number) => {
    setPrimaryImg(productData?.images[index] || null);
  };

  const handleAddToCart = async () => {
    if (!productData) return;
    await handleAddProductToCart(productData.id, quantity);
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productData || !draftReview.name.trim() || !draftReview.comment.trim()) {
      return;
    }

    try {
      const payload = {
        productId: productData.id,
        rating: draftReview.rating,
        comment: draftReview.comment.trim(),
      };

      const response = await reviewService.create(payload);

      if (response.success) {
        const newReview: Review = {
          id: Date.now(),
          customer: {
            id: Date.now(),
            name: draftReview.name.trim(),
          },
          product: {
            id: productData.id,
            name: productData.name,
          },
          rating: draftReview.rating,
          comment: draftReview.comment.trim(),
          status: "PENDING",
          createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };

        setReviews((currentReviews) => [newReview, ...currentReviews]);
        setDraftReview({ name: "", rating: 5, comment: "" });
        setReviewMessage("Thanks! Your review has been submitted successfully.");
      } else {
        setReviewMessage(response.message || "Unable to submit your review right now.");
      }
    } catch (error) {
      console.log("Error submitting review:", error);
      setReviewMessage("Unable to submit your review right now. Please try again later.");
    }
  };

  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

  if (!productData) {
    return null;
  }

  return (
    <>
      <main className="bg-white">
        <section className="app-container py-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,520px)_minmax(360px,1fr)] lg:gap-12">
            <div className="w-full max-w-130">
              <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {primaryImg ? (
                  <Image
                    className="aspect-4/3 w-full object-contain p-5 mix-blend-multiply"
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${primaryImg}`}
                    alt={productData.name}
                    width={720}
                    height={540}
                    unoptimized
                  />
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {productData.images.map((img, index) => {
                  const isSelected = img === primaryImg;

                  return (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => handleSwitchImage(index)}
                      className={`overflow-hidden rounded-md border bg-slate-50 transition ${isSelected
                        ? "border-orange-500"
                        : "border-slate-200 hover:border-orange-200"
                        }`}
                    >
                      <Image
                        className="aspect-square w-full object-contain p-2 mix-blend-multiply"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${img}`}
                        alt={`${productData.name} ${index + 1}`}
                        width={220}
                        height={220}
                        unoptimized
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-orange-600">
                {productData.categoryName}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                {productData.name}
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  {reviewCount > 0
                    ? `${reviewCount} review${reviewCount === 1 ? "" : "s"}`
                    : "No reviews yet"}
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-600">
                {productData.description}
              </p>

              <div className="mt-6 flex items-end gap-3">
                <p className="text-3xl font-semibold text-slate-950">
                  ${finalPrice.toFixed(2)}
                </p>use
                {productData.discount > 0 ? (
                  <p className="pb-1 text-sm text-slate-400 line-through">
                    ${productData.price.toFixed(2)}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-medium text-slate-800">Generic</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Color</span>
                  <span className="font-medium text-slate-800">Multi</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Available stock</span>
                  <span className="font-medium text-slate-800">
                    {productData.qty}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-white sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity === 1}
                    className="flex h-full w-12 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(productData.qty || current + 1, current + 1)
                      )
                    }
                    className="flex h-full w-12 items-center justify-center text-slate-500 hover:bg-slate-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-12 flex-1 rounded-md border border-orange-500 bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Add to cart
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/cart")}
                  className="h-12 flex-1 rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>

          <section className="mx-auto mt-14 max-w-6xl border-t border-slate-200 pt-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-md border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Customer feedback</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                      What shoppers are saying
                    </h2>
                  </div>
                  <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${index < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {averageRating.toFixed(1)} / 5
                    </p>
                  </div>
                </div>

                {reviewMessage ? (
                  <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {reviewMessage}
                  </div>
                ) : null}

                {reviews.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <article
                        key={review.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* <div>
                            <p className="font-semibold text-slate-900">
                              {review.customer.name}
                            </p>
                            <p className="text-xs text-slate-500">{review.createdAt}</p>
                          </div> */}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${review.id}-${index}`}
                                className={`h-3.5 w-3.5 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {review.comment}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Be the first to share your experience with this product.
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmitReview}
                className="rounded-md border border-slate-200 bg-white p-6"
              >
                <p className="text-sm font-medium text-orange-600">Write a review</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                  Share your experience
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Let other customers know what stood out and help them decide.
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="review-name">
                      Your name
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      value={draftReview.name}
                      onChange={(event) =>
                        setDraftReview((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-orange-400"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="review-rating">
                      Rating
                    </label>
                    <select
                      id="review-rating"
                      value={draftReview.rating}
                      onChange={(event) =>
                        setDraftReview((current) => ({ ...current, rating: Number(event.target.value) }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} star{value === 1 ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="review-comment">
                      Your review
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={draftReview.comment}
                      onChange={(event) =>
                        setDraftReview((current) => ({ ...current, comment: event.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400"
                      placeholder="Tell other customers about your experience"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Submit review
                </button>
              </form>
            </div>

            <div className="mb-6 mt-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Related category
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  More in {productData.categoryName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => router.push("/all-product")}
                className="self-start rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:self-auto"
              >
                View all products
              </button>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
                No other products in this category yet.
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
};

export default ProductDetail;
