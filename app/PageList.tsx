import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PagesList() {
    const supabase = await createClient();

    const { data: pages } = await supabase
        .from("pages")
        .select("*");

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages?.map((page) => {
                const description =
                    page.data?.blocks?.find(
                        (b: any) => b.type === "text"
                    )?.content || "No description";

                const image =
                    page.image_url ||
                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d";

                return (
                    <Link
                        key={page.id_page}
                        href={`/pages/${page.id_page}`}
                        className="group rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition bg-white"
                    >
                        {/* IMAGE */}
                        <div className="h-40 overflow-hidden">
                            <img
                                src={image}
                                alt={page.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-4">
                            <h2 className="text-lg font-bold mb-2 group-hover:text-emerald-500 transition">
                                {page.title}
                            </h2>

                            <p className="text-sm text-gray-500 line-clamp-3">
                                {description}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
