import { notFound } from "next/navigation";

import {
  getCampaignById,
  getCampaignFormData,
} from "@/lib/admin/campaigns";

import { CampaignForm } from "@/components/admin/campaign-form";

type EditCampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCampaignPage({
  params,
}: EditCampaignPageProps) {
  const { id } = await params;

  const [campaign, formData] = await Promise.all([
    getCampaignById(id),
    getCampaignFormData(),
  ]);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
          Website Content
        </p>

        <h1 className="mt-2 font-serif text-3xl text-primary sm:text-4xl">
          Edit Campaign
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/60">
          Update the campaign banner, destination,
          schedule, priority, and homepage availability.
        </p>
      </div>

      <CampaignForm
        mode="edit"
        campaign={campaign}
        collections={formData.collections}
        products={formData.products}
      />
    </div>
  );
}