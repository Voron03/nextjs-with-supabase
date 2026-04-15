import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PagesList() {
  const supabase = await createClient();

  const { data: pages } = await supabase.from("pages").select("*");

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {pages?.map((page) => {
        const description =
          page.data?.blocks?.find((b: any) => b.type === "text")?.content ||
          "Aucune description disponible";

        const image =
          page.image_url ||
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d";

        return (
          <Link
            key={page.id_page}
            href={`/pages/${page.id_page}`}
            className="group relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* IMAGE */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={image}
                alt={page.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition">
                {page.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 line-clamp-3 leading-relaxed">
                {description}
              </p>

              {/* bottom hint */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Lecture guidée
                </span>

                <span className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition">
                  Ouvrir →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
