import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCampaignFormData } from "@/lib/admin/campaigns";

import { CampaignForm } from "../../../../components/admin/campaign-form";

export default async function NewCampaignPage() {
  const { collections, products, linkTypes } =
    await getCampaignFormData();

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Back */}
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-2 text-xs text-primary/55 transition-colors hover:text-primary"
      >
        <ArrowLeft
          className="size-3.5"
          strokeWidth={1.6}
        />
        Back to Campaigns
      </Link>

      {/* Header */}
      <div className="mt-7 border-b border-border pb-7">
        <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
          Homepage Content
        </p>

        <h1 className="mt-2 font-serif text-3xl text-primary sm:text-4xl">
          New Campaign
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/60">
          Create a campaign for the single banner slot
          displayed directly below the homepage navigation.
          When multiple campaigns are eligible, the highest
          priority campaign is shown.
        </p>
      </div>

      {/* Campaign form */}
      <div className="mt-8">
        <CampaignForm
          collections={collections}
          products={products}
          linkTypes={linkTypes}
        />
      </div>
    </div>
  );
}