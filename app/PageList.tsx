import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PagesList() {
    const supabase = await createClient();

    const { data: pages } = await supabase
        .from("pages")
        .select("*");

    return (
        <div className="space-y-4">
            {pages?.map((page) => (
                <Link
                    key={page.id_page}
                    href={`/pages/${page.id_page}`}
                    className="block p-4 border rounded hover:bg-gray-50 transition"
                >
                    <h2 className="text-lg font-semibold">
                        {page.title}
                    </h2>
                </Link>
            ))}
        </div>
    );
}
