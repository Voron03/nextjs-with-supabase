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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("id_page", id)
        .single();

      setPage(data);
      setBlocks(data?.data?.blocks || []);

      setLoading(false);
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

  // ================= UPDATE =================
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

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // ================= SAVE =================
  const save = async () => {
    setSaving(true);

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

    setSaving(false);

    alert("Page enregistrée avec succès ✅");
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement de la page...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Modifier la page
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        {page?.title}
      </p>

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 mb-6">

        <button
          onClick={() => addBlock("title")}
          className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-400 transition"
        >
          + Titre
        </button>

        <button
          onClick={() => addBlock("text")}
          className="px-3 py-2 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-500 transition"
        >
          + Texte
        </button>

        <button
          onClick={() => addBlock("image")}
          className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-400 transition"
        >
          + Image
        </button>

      </div>

      {/* BLOCKS */}
      <div className="space-y-4">

        {blocks.map((block, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >

            {/* TYPE */}
            <div className="text-xs text-gray-400 mb-2">
              {block.type === "title" && "Titre"}
              {block.type === "text" && "Texte"}
              {block.type === "image" && "Image"}
            </div>

            {/* TEXT INPUT */}
            {block.type !== "image" && (
              <textarea
                className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder={block.type === "title" ? "Écrire un titre..." : "Écrire du texte..."}
                value={block.content}
                onChange={(e) => updateBlock(i, e.target.value)}
              />
            )}

            {/* IMAGE INPUT */}
            {block.type === "image" && (
              <>
                <input
                  className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-emerald-200 outline-none"
                  placeholder="URL de l'image"
                  value={block.url}
                  onChange={(e) => updateBlock(i, e.target.value)}
                />

                {block.url && (
                  <img
                    src={block.url}
                    className="mt-3 rounded-lg max-h-48 object-cover"
                  />
                )}
              </>
            )}

            {/* DELETE */}
            <button
              onClick={() => removeBlock(i)}
              className="mt-3 text-sm text-red-500 hover:text-red-400"
            >
              Supprimer
            </button>

          </div>
        ))}

      </div>

      {/* SAVE */}
      <button
        onClick={save}
        disabled={saving}
        className="mt-6 w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-400 transition disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer la page"}
      </button>

    </div>
  );
}