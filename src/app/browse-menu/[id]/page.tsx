
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import MenuDetailsActions from "@/components/MenuDetailsActions";


export const instant = false;

interface MenuItem {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  rating?: number;
  reviewsCount?: string | number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menuitems/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data || result || null;
  } catch (error) {
    console.error("Failed to fetch menu item:", error);
    return null;
  }
}

async function MenuItemContent({ params }: PageProps) {
  const { id } = await params;
  const item = await getMenuItem(id);

  if (!item || (!item._id && !item.title && !item.name)) {
    notFound();
  }

  const itemTitle = item.title || item.name || "Margherita Pizza";
  const ratingValue = item.rating ?? 4.8;
  const reviewsText = item.reviewsCount ?? "12k+ reviews";

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <Link href="/" className="hover:text-[#D91B24]">
          Home
        </Link>
        <span className="text-gray-400">&gt;</span>
        <Link href="/browse-menu" className="hover:text-[#D91B24]">
          Menu
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span className="font-semibold text-gray-900">{itemTitle}</span>
      </nav>

      {/* Main Details Card */}
      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:grid-cols-12 md:p-7">
        {/* Left Image */}
        <div className="overflow-hidden rounded-2xl bg-gray-100 md:col-span-6">
          <img
            src={item.image || "/placeholder-pizza.jpg"}
            alt={itemTitle}
            className="h-72 w-full object-cover sm:h-88 md:h-104"
          />
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-center md:col-span-6 md:pl-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            {itemTitle}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{ratingValue}</span>
            <span className="font-medium text-gray-600">({reviewsText})</span>
          </div>

          <p className="mt-4 text-3xl font-extrabold text-[#D91B24] sm:text-4xl">
            ${Number(item.price || 0).toFixed(2)}
          </p>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
            {item.description ||
              "Classic delight with fresh tomatoes, mozzarella cheese and basil leaves."}
          </p>

          <MenuDetailsActions item={item} />
        </div>
      </div>
    </section>
  );
}

export default function MenuDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 text-gray-500">
          Loading details...
        </div>
      }
    >
      <MenuItemContent params={params} />
    </Suspense>
  );
}