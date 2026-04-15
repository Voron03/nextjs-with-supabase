"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Block = {
  type: "text" | "title";
  content: string;
};

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

  // ================= BLOCK ACTIONS =================
  const addBlock = (type: Block["type"]) => {
    setBlocks([...blocks, { type, content: "" }]);
  };

  const updateBlock = (index: number, value: string) => {
    const copy = [...blocks];
    copy[index].content = value;
    setBlocks(copy);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // ================= SAVE =================
  const save = async () => {
    await supabase
      .from("pages")
      .update({
        data: {
          blocks,
          published: true,
        },
      })
      .eq("id_page", id);

    alert("Saved");
  };

  if (!page) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Edit: {page.title}
      </h1>

      {/* ===== TOOLBAR ===== */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => addBlock("title")} className="bg-blue-500 text-white px-3 py-1">
          + Title
        </button>

        <button onClick={() => addBlock("text")} className="bg-gray-500 text-white px-3 py-1">
          + Text
        </button>
      </div>

      {/* ===== EDITOR ===== */}
      <div className="space-y-3">
        {blocks.map((block, i) => (
          <div key={i} className="border p-3 rounded bg-white">

            <div className="text-xs text-gray-400 mb-1">
              {block.type}
            </div>

            <textarea
              className="w-full border p-2"
              value={block.content}
              onChange={(e) => updateBlock(i, e.target.value)}
            />

            <button
              onClick={() => removeBlock(i)}
              className="text-red-500 text-sm mt-1"
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* ===== SAVE ===== */}
      <button
        onClick={save}
        className="mt-5 bg-green-500 text-white px-4 py-2"
      >
        Save page
      </button>
    </div>
  );
}
