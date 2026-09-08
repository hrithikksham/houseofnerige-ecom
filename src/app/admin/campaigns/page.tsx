import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ImageIcon,
  Pencil,
  Plus,
} from "lucide-react";

import { getActiveCampaign } from "@/lib/campaigns";
import { getCampaigns } from "@/lib/admin/campaigns";

function formatDate(date: Date | null) {
  if (!date) {
    return "No limit";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCampaignState(
  campaign: {
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
  },
  now: Date
) {
  if (!campaign.isActive) {
    return {
      label: "Inactive",
      className:
        "border-primary/10 bg-primary/[0.04] text-primary/50",
    };
  }

  if (
    campaign.startDate &&
    campaign.startDate > now
  ) {
    return {
      label: "Scheduled",
      className:
        "border-terracotta/20 bg-terracotta/10 text-terracotta",
    };
  }

  if (
    campaign.endDate &&
    campaign.endDate < now
  ) {
    return {
      label: "Expired",
      className:
        "border-primary/10 bg-primary/[0.04] text-primary/50",
    };
  }

  return {
    label: "Live",
    className:
      "border-primary/15 bg-primary/[0.08] text-primary",
  };
}

function getDestinationLabel(
  linkType: string
) {
  switch (linkType) {
    case "COLLECTION":
      return "Collection";

    case "PRODUCT":
      return "Product";

    case "CUSTOM":
      return "Custom";

    default:
      return "Destination";
  }
}

export default async function CampaignsPage() {
  const [campaigns, activeCampaign] =
    await Promise.all([
      getCampaigns(),
      getActiveCampaign(),
    ]);

  const now = new Date();

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta">
            Website Content
          </p>

          <h1 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
            Campaign Banners
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/60">
            Manage the single campaign banner displayed
            directly below the homepage navigation. When
            multiple campaigns are eligible, the highest
            priority campaign is shown.
          </p>
        </div>

        <Link
          href="/admin/campaigns/new"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90"
        >
          <Plus
            className="size-4"
            strokeWidth={1.7}
          />
          Add Campaign
        </Link>
      </div>

      {/* Current homepage campaign */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/40">
              Homepage Campaign Slot
            </p>

            <h2 className="mt-2 font-serif text-xl text-primary">
              Current winner
            </h2>
          </div>

          {activeCampaign && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
              <span className="size-2 rounded-full bg-terracotta" />
              Live on homepage
            </span>
          )}
        </div>

        {activeCampaign ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-primary/10 bg-soft-white">
            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
              <div className="relative aspect-[16/7] overflow-hidden bg-primary/[0.04]">
                <Image
                  src={activeCampaign.desktopImage}
                  alt={activeCampaign.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between p-6 lg:p-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-terracotta/20 bg-terracotta/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-terracotta">
                    <span className="size-1.5 rounded-full bg-terracotta" />
                    Live on homepage
                  </div>

                  <h3 className="mt-5 font-serif text-2xl text-primary">
                    {activeCampaign.name}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm text-primary/60">
                    <div className="flex items-center justify-between gap-5">
                      <span>Priority</span>

                      <span className="font-medium text-primary">
                        {activeCampaign.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span>Destination</span>

                      <span className="font-medium text-primary">
                        {getDestinationLabel(
                          activeCampaign.linkType
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span>Mobile image</span>

                      <span className="font-medium text-primary">
                        {activeCampaign.mobileImage
                          ? "Configured"
                          : "Desktop fallback"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/admin/campaigns/${activeCampaign.id}/edit`}
                  className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90"
                >
                  Edit Campaign
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.6}
                  />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex min-h-44 items-center border border-dashed border-primary/15 bg-primary/[0.015] px-6 py-8">
            <div className="max-w-xl">
              <p className="font-medium text-primary">
                No campaign is currently live on the
                homepage.
              </p>

              <p className="mt-2 text-sm leading-6 text-primary/55">
                The campaign slot will automatically
                display the highest-priority campaign that
                is active and within its configured
                schedule.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* All campaigns */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/40">
              All Campaigns
            </p>

            <h2 className="mt-2 font-serif text-xl text-primary">
              Campaign Library
            </h2>
          </div>

          {campaigns.length > 0 && (
            <p className="text-sm text-primary/50">
              {campaigns.length}{" "}
              {campaigns.length === 1
                ? "campaign"
                : "campaigns"}
            </p>
          )}
        </div>

        {campaigns.length === 0 ? (
          <div className="mt-5 flex min-h-80 flex-col items-center justify-center border border-dashed border-primary/15 bg-soft-white p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.03]">
              <ImageIcon
                className="size-6 text-primary/45"
                strokeWidth={1.4}
              />
            </div>

            <h3 className="mt-5 font-serif text-2xl text-primary">
              No campaigns yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-primary/55">
              Create a campaign to control the dedicated
              banner slot below the homepage navigation.
            </p>

            <Link
              href="/admin/campaigns/new"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90"
            >
              <Plus
                className="size-4"
                strokeWidth={1.7}
              />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-5">
            {campaigns.map((campaign) => {
              const state = getCampaignState(
                campaign,
                now
              );

              const isCurrentWinner =
                activeCampaign?.id === campaign.id;

              return (
                <article
                  key={campaign.id}
                  className={`overflow-hidden rounded-2xl border bg-soft-white transition-shadow hover:shadow-sm ${
                    isCurrentWinner
                      ? "border-terracotta/30"
                      : "border-primary/10"
                  }`}
                >
                  <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
                    {/* Banner preview */}
                    <div className="relative aspect-[16/8] overflow-hidden bg-primary/[0.04] lg:aspect-auto lg:min-h-full">
                      <Image
                        src={campaign.desktopImage}
                        alt={campaign.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 280px"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        {/* Campaign information */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${state.className}`}
                            >
                              {state.label}
                            </span>

                            {isCurrentWinner && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                                <span className="size-1.5 rounded-full bg-terracotta" />
                                Shown on homepage
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 font-serif text-2xl text-primary">
                            {campaign.name}
                          </h3>

                          <div className="mt-5 grid gap-4 text-sm text-primary/55 sm:grid-cols-2 xl:grid-cols-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/35">
                                Priority
                              </p>

                              <p className="mt-1.5 font-medium text-primary">
                                {campaign.priority}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/35">
                                Destination
                              </p>

                              <p className="mt-1.5 font-medium text-primary">
                                {getDestinationLabel(
                                  campaign.linkType
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/35">
                                Images
                              </p>

                              <p className="mt-1.5 font-medium text-primary">
                                {campaign.mobileImage
                                  ? "Desktop + Mobile"
                                  : "Desktop only"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex items-start gap-2.5 text-sm text-primary/55">
                            <CalendarDays
                              className="mt-0.5 size-4 shrink-0 text-primary/35"
                              strokeWidth={1.5}
                            />

                            <p>
                              {formatDate(
                                campaign.startDate
                              )}
                              <span className="mx-2 text-primary/30">
                                →
                              </span>
                              {formatDate(
                                campaign.endDate
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Action */}
                        <Link
                          href={`/admin/campaigns/${campaign.id}/edit`}
                          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/10 px-4 text-xs font-medium text-primary transition-colors hover:bg-primary/[0.04]"
                        >
                          <Pencil
                            className="size-3.5"
                            strokeWidth={1.6}
                          />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}