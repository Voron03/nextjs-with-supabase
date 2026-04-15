import { Suspense } from "react";
import EditClient from "./EditClient";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-6">Loading page...</div>}>
      <PageContent params={params} />
    </Suspense>
  );
}

async function PageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditClient id={id} />;
}
