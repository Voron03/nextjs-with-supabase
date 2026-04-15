import { Suspense } from "react";
import PageContent from "./PageContent";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Chargement de la page...
        </div>
      }
    >
      <PageInner params={params} />
    </Suspense>
  );
}

async function PageInner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PageContent id={id} />;
}