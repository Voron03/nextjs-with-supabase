import { Suspense } from "react";
import PageContent from "./PageContent";

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<p className="p-6">Loading...</p>}>
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
