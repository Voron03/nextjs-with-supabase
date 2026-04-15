import { createClient } from "@/lib/supabase/server";

export default async function PageContent({ id }: { id: string }) {
    const supabase = await createClient();

    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("id_page", id)
        .single();

    if (!page) {
        return <div className="p-6">Page not found</div>;
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                {page.title}
            </h1>

            {page.data?.blocks?.map((block: any, i: number) => {
                if (block.type === "title") {
                    return (
                        <h1 key={i} className="text-3xl font-bold mb-4">
                            {block.content}
                        </h1>
                    );
                }

                if (block.type === "text") {
                    return (
                        <p key={i} className="text-gray-700 mb-3">
                            {block.content}
                        </p>
                    );
                }

                return null;
            })}
        </main>
    );
}
