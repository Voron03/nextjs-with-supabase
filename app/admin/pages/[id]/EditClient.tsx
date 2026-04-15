"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ================= TYPES =================
type TextBlock = {
  type: "text" | "title";
  content: string;
};

type ImageBlock = {
  type: "image";
  url: string;
};

type Block = TextBlock | ImageBlock;

export default function EditClient({ id }: { id: string }) {
  const supabase = createClient();

  const [page, setPage] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("id_page", id)
        .single();

      setPage(data);
      setBlocks(data?.data?.blocks || []);
    };

    load();
  }, [id]);

  // ================= ADD BLOCK =================
  const addBlock = (type: Block["type"]) => {
    if (type === "image") {
      setBlocks([...blocks, { type: "image", url: "" }]);
    } else {
      setBlocks([...blocks, { type, content: "" }]);
    }
  };

  // ================= UPDATE BLOCK =================
  const updateBlock = (index: number, value: string) => {
    const copy = [...blocks];
    const block = copy[index];

    if (block.type === "image") {
      (copy[index] as ImageBlock).url = value;
    } else {
      (copy[index] as TextBlock).content = value;
    }

    setBlocks(copy);
  };

  // ================= REMOVE BLOCK =================
  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // ================= SAVE =================
  const save = async () => {
    const firstImage = blocks.find(
      (b): b is ImageBlock => b.type === "image"
    )?.url;

    await supabase
      .from("pages")
      .update({
        data: {
          blocks,
          published: true,
        },
        image_url: firstImage || null,
      })
      .eq("id_page", id);

    alert("Saved");
  };

  // ================= UI =================
  if (!page) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Edit: {page.title}
      </h1>

      {/* ================= TOOLBAR ================= */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => addBlock("title")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Title
        </button>

        <button
          onClick={() => addBlock("text")}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          + Text
        </button>

        <button
          onClick={() => addBlock("image")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Image
        </button>
      </div>

      {/* ================= EDITOR ================= */}
      <div className="space-y-3">
        {blocks.map((block, i) => (
          <div key={i} className="border p-3 rounded bg-white">

            <div className="text-xs text-gray-400 mb-1">
              {block.type}
            </div>

            {/* TEXT / TITLE */}
            {block.type !== "image" && (
              <textarea
                className="w-full border p-2"
                value={block.content}
                onChange={(e) => updateBlock(i, e.target.value)}
              />
            )}

            {/* IMAGE */}
            {block.type === "image" && (
              <>
                <input
                  className="w-full border p-2"
                  placeholder="Image URL"
                  value={block.url}
                  onChange={(e) => updateBlock(i, e.target.value)}
                />

                {block.url && (
                  <img
                    src={block.url}
                    alt="preview"
                    className="mt-2 rounded max-h-48 object-cover"
                  />
                )}
              </>
            )}

            <button
              onClick={() => removeBlock(i)}
              className="text-red-500 text-sm mt-2"
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* ================= SAVE ================= */}
      <button
        onClick={save}
        className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
      >
        Save page
      </button>
    </div>
  );
}
