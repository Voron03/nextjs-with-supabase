import { createClient } from "@/lib/supabase/server";

export default async function PageContent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id_page", id)
    .single();

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Page introuvable
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">

      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          {page.title}
        </h1>

        <p className="mt-3 text-gray-500 text-sm">
          Article publié
        </p>

      </div>

      {/* CONTENT */}
      <article className="max-w-2xl mx-auto px-6 pb-20 space-y-6">

        {page.data?.blocks?.map((block: any, i: number) => {

          // ================= TITLE =================
          if (block.type === "title") {
            return (
              <h2
                key={i}
                className="text-2xl md:text-3xl font-bold text-gray-900 mt-8"
              >
                {block.content}
              </h2>
            );
          }

          // ================= TEXT =================
          if (block.type === "text") {
            return (
              <p
                key={i}
                className="text-gray-700 leading-7 text-base md:text-lg"
              >
                {block.content}
              </p>
            );
          }

          // ================= IMAGE =================
          if (block.type === "image") {
            return (
              <div
                key={i}
                className="my-6 overflow-hidden rounded-2xl shadow-md border border-gray-100"
              >
                <img
                  src={block.url}
                  alt="image"
                  className="w-full object-cover max-h-[420px] hover:scale-[1.02] transition duration-500"
                />
              </div>
            );
          }

          return null;
        })}

      </article>

    </main>
  );
}