"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  Monitor,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { LinkType } from "@/generated/prisma/client";
import { createClient } from "@/lib/supabase/client";

import {
  createCampaign,
  updateCampaign,
} from "@/app/admin/campaigns/actions";

type CollectionOption = {
  id: string;
  name: string;
};

type ProductOption = {
  id: string;
  name: string;
};

type CampaignFormValues = {
  id?: string;
  name: string;
  desktopImage: string;
  mobileImage: string | null;
  linkType: LinkType;
  linkValue: string;
  startDate: string;
  endDate: string;
  priority: number;
  isActive: boolean;
};

type CampaignFormProps = {
  collections: CollectionOption[];
  products: ProductOption[];
  linkTypes: LinkType[];
  campaign?: CampaignFormValues;
};

const CAMPAIGN_BUCKET = "campaign-banners";

const initialValues: CampaignFormValues = {
  name: "",
  desktopImage: "",
  mobileImage: "",
  linkType: LinkType.COLLECTION,
  linkValue: "",
  startDate: "",
  endDate: "",
  priority: 0,
  isActive: false,
};

function getInitialValues(
  campaign?: CampaignFormValues
) {
  return {
    ...initialValues,
    ...campaign,
    mobileImage: campaign?.mobileImage ?? "",
  };
}

function formatDateValue(value: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function getFileExtension(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function getDestinationLabel(
  linkType: LinkType
) {
  switch (linkType) {
    case LinkType.COLLECTION:
      return "Collection";

    case LinkType.PRODUCT:
      return "Product";

    case LinkType.CUSTOM:
      return "Custom URL";

    default:
      return "Destination";
  }
}

export function CampaignForm({
  collections,
  products,
  linkTypes,
  campaign,
}: CampaignFormProps) {
  const router = useRouter();

  const desktopInputRef =
    useRef<HTMLInputElement>(null);

  const mobileInputRef =
    useRef<HTMLInputElement>(null);

  const [values, setValues] =
    useState(() => getInitialValues(campaign));

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [uploadingImage, setUploadingImage] =
    useState<"desktop" | "mobile" | null>(
      null
    );

  useEffect(() => {
    setValues({
      ...getInitialValues(campaign),
      startDate: formatDateValue(
        campaign?.startDate ?? null
      ),
      endDate: formatDateValue(
        campaign?.endDate ?? null
      ),
    });
  }, [campaign]);

  function updateValue<
    Key extends keyof CampaignFormValues,
  >(key: Key, value: CampaignFormValues[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadCampaignImage(
    file: File,
    type: "desktop" | "mobile"
  ) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Campaign images must be smaller than 10 MB."
      );
      return;
    }

    setError(null);
    setUploadingImage(type);

    try {
      const supabase = createClient();

      const extension =
        getFileExtension(file);

      const fileName =
        `${type}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const filePath =
        `campaigns/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from(CAMPAIGN_BUCKET)
          .upload(filePath, file, {
            cacheControl: "31536000",
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(CAMPAIGN_BUCKET)
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error(
          "Could not create a public URL for the image."
        );
      }

      if (type === "desktop") {
        updateValue(
          "desktopImage",
          data.publicUrl
        );
      } else {
        updateValue(
          "mobileImage",
          data.publicUrl
        );
      }
    } catch (uploadError) {
      console.error(
        "Campaign image upload failed:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload the campaign image."
      );
    } finally {
      setUploadingImage(null);

      if (type === "desktop") {
        if (desktopInputRef.current) {
          desktopInputRef.current.value = "";
        }
      }

      if (type === "mobile") {
        if (mobileInputRef.current) {
          mobileInputRef.current.value = "";
        }
      }
    }
  }

  function handleDesktopImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadCampaignImage(
        file,
        "desktop"
      );
    }
  }

  function handleMobileImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadCampaignImage(
        file,
        "mobile"
      );
    }
  }

  function removeImage(
    type: "desktop" | "mobile"
  ) {
    if (type === "desktop") {
      updateValue("desktopImage", "");
      return;
    }

    updateValue("mobileImage", "");
  }

  function handleLinkTypeChange(
    linkType: LinkType
  ) {
    setValues((current) => ({
      ...current,
      linkType,
      linkValue: "",
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);

    if (!values.name.trim()) {
      setError("Campaign name is required.");
      return;
    }

    if (!values.desktopImage) {
      setError(
        "Please upload a desktop campaign image."
      );
      return;
    }

    if (!values.linkValue.trim()) {
      setError(
        "Please select a campaign destination."
      );
      return;
    }

    if (
      values.startDate &&
      values.endDate &&
      new Date(values.endDate) <
        new Date(values.startDate)
    ) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (campaign?.id) {
        formData.set("id", campaign.id);
      }

      formData.set(
        "name",
        values.name.trim()
      );

      formData.set(
        "desktopImage",
        values.desktopImage
      );

      formData.set(
        "mobileImage",
        values.mobileImage || ""
      );

      formData.set(
        "linkType",
        values.linkType
      );

      formData.set(
        "linkValue",
        values.linkValue.trim()
      );

      formData.set(
        "startDate",
        values.startDate
      );

      formData.set(
        "endDate",
        values.endDate
      );

      formData.set(
        "priority",
        String(values.priority)
      );

      if (values.isActive) {
        formData.set("isActive", "on");
      }

      const result = campaign?.id
        ? await updateCampaign(formData)
        : await createCampaign(formData);

      if (!result.success) {
        setError(
          result.error ??
            "Something went wrong. Please try again."
        );
        return;
      }

      router.push("/admin/campaigns");
      router.refresh();
    } catch (submitError) {
      console.error(
        "Campaign save failed:",
        submitError
      );

      setError(
        "Something went wrong while saving the campaign."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isUploading =
    uploadingImage !== null;

  const destinationOptions =
    values.linkType === LinkType.COLLECTION
      ? collections
      : products;

  const destinationValue =
    values.linkType === LinkType.CUSTOM
      ? values.linkValue
      : destinationOptions.find(
          (item) =>
            item.id === values.linkValue
        )?.name;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Campaign details */}
      <section className="border border-border bg-soft-white">
        <div className="border-b border-border px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
            Campaign Details
          </p>

          <h2 className="mt-2 font-serif text-2xl text-primary">
            Campaign information
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary/55">
            Internal information used to identify this
            homepage campaign.
          </p>
        </div>

        <div className="p-6">
          <label className="block">
            <span className="text-xs font-medium text-primary">
              Campaign name
            </span>

            <input
              type="text"
              value={values.name}
              onChange={(event) =>
                updateValue(
                  "name",
                  event.target.value
                )
              }
              placeholder="Diwali 2026"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="border border-border bg-soft-white">
        <div className="border-b border-border px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
            Visual
          </p>

          <h2 className="mt-2 font-serif text-2xl text-primary">
            Campaign imagery
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary/55">
            Upload the desktop banner and, optionally,
            a dedicated mobile banner. Images are stored
            in Supabase Storage.
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {/* Desktop image */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Monitor
                className="size-4 text-primary/50"
                strokeWidth={1.5}
              />

              <p className="text-xs font-medium text-primary">
                Desktop banner
              </p>

              <span className="text-[10px] text-terracotta">
                Required
              </span>
            </div>

            <input
              ref={desktopInputRef}
              type="file"
              accept="image/*"
              onChange={
                handleDesktopImageChange
              }
              className="sr-only"
              disabled={
                isSubmitting || isUploading
              }
            />

            {values.desktopImage ? (
              <div className="overflow-hidden border border-border">
                <div className="relative aspect-[16/7] bg-background">
                  <Image
                    src={values.desktopImage}
                    alt="Desktop campaign preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border p-3">
                  <button
                    type="button"
                    onClick={() =>
                      desktopInputRef.current?.click()
                    }
                    disabled={
                      isSubmitting || isUploading
                    }
                    className="text-xs text-primary transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Replace image
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage("desktop")
                    }
                    disabled={
                      isSubmitting || isUploading
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-primary/55 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  desktopInputRef.current?.click()
                }
                disabled={
                  isSubmitting || isUploading
                }
                className="flex aspect-[16/7] w-full flex-col items-center justify-center border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.015] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage === "desktop" ? (
                  <Loader2 className="size-6 animate-spin text-primary/50" />
                ) : (
                  <Upload
                    className="size-6 text-primary/45"
                    strokeWidth={1.4}
                  />
                )}

                <span className="mt-3 text-sm text-primary">
                  {uploadingImage === "desktop"
                    ? "Uploading..."
                    : "Upload desktop banner"}
                </span>

                <span className="mt-1 text-xs text-primary/45">
                  Recommended: wide 16:7 image
                </span>
              </button>
            )}
          </div>

          {/* Mobile image */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Smartphone
                className="size-4 text-primary/50"
                strokeWidth={1.5}
              />

              <p className="text-xs font-medium text-primary">
                Mobile banner
              </p>

              <span className="text-[10px] text-primary/40">
                Optional
              </span>
            </div>

            <input
              ref={mobileInputRef}
              type="file"
              accept="image/*"
              onChange={
                handleMobileImageChange
              }
              className="sr-only"
              disabled={
                isSubmitting || isUploading
              }
            />

            {values.mobileImage ? (
              <div className="overflow-hidden border border-border">
                <div className="relative aspect-[4/5] bg-background">
                  <Image
                    src={values.mobileImage}
                    alt="Mobile campaign preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border p-3">
                  <button
                    type="button"
                    onClick={() =>
                      mobileInputRef.current?.click()
                    }
                    disabled={
                      isSubmitting || isUploading
                    }
                    className="text-xs text-primary transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Replace image
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage("mobile")
                    }
                    disabled={
                      isSubmitting || isUploading
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-primary/55 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  mobileInputRef.current?.click()
                }
                disabled={
                  isSubmitting || isUploading
                }
                className="flex aspect-[4/5] w-full flex-col items-center justify-center border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.015] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage === "mobile" ? (
                  <Loader2 className="size-6 animate-spin text-primary/50" />
                ) : (
                  <ImageIcon
                    className="size-6 text-primary/45"
                    strokeWidth={1.4}
                  />
                )}

                <span className="mt-3 text-sm text-primary">
                  {uploadingImage === "mobile"
                    ? "Uploading..."
                    : "Upload mobile banner"}
                </span>

                <span className="mt-1 text-xs text-primary/45">
                  Recommended: portrait 4:5 image
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Destination */}
      <section className="border border-border bg-soft-white">
        <div className="border-b border-border px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
            Destination
          </p>

          <h2 className="mt-2 font-serif text-2xl text-primary">
            Campaign link
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary/55">
            Choose where customers go when they select
            the campaign banner.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {linkTypes.map((linkType) => {
              const isSelected =
                values.linkType === linkType;

              return (
                <button
                  key={linkType}
                  type="button"
                  onClick={() =>
                    handleLinkTypeChange(linkType)
                  }
                  disabled={isSubmitting}
                  className={`border px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-soft-white"
                      : "border-border bg-background text-primary hover:border-primary/30"
                  }`}
                >
                  <p className="text-xs font-medium">
                    {getDestinationLabel(
                      linkType
                    )}
                  </p>
                </button>
              );
            })}
          </div>

          {values.linkType ===
          LinkType.CUSTOM ? (
            <label className="block">
              <span className="text-xs font-medium text-primary">
                Custom destination
              </span>

              <input
                type="text"
                value={values.linkValue}
                onChange={(event) =>
                  updateValue(
                    "linkValue",
                    event.target.value
                  )
                }
                placeholder="/collections/diwali"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-primary/45">
                Must start with `/`.
              </p>
            </label>
          ) : (
            <label className="block">
              <span className="text-xs font-medium text-primary">
                Select{" "}
                {getDestinationLabel(
                  values.linkType
                ).toLowerCase()}
              </span>

              <select
                value={values.linkValue}
                onChange={(event) =>
                  updateValue(
                    "linkValue",
                    event.target.value
                  )
                }
                disabled={isSubmitting}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  Select a destination
                </option>

                {destinationOptions.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </label>
          )}
        </div>
      </section>

      {/* Schedule and priority */}
      <section className="border border-border bg-soft-white">
        <div className="border-b border-border px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
            Eligibility
          </p>

          <h2 className="mt-2 font-serif text-2xl text-primary">
            Schedule and priority
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary/55">
            A campaign is eligible when active and within
            its configured date range. If several campaigns
            are eligible, the highest priority is shown.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-primary">
              Start date
            </span>

            <input
              type="date"
              value={values.startDate}
              onChange={(event) =>
                updateValue(
                  "startDate",
                  event.target.value
                )
              }
              disabled={isSubmitting}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-primary/45">
              Leave empty to make the campaign eligible
              immediately.
            </p>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-primary">
              End date
            </span>

            <input
              type="date"
              value={values.endDate}
              onChange={(event) =>
                updateValue(
                  "endDate",
                  event.target.value
                )
              }
              disabled={isSubmitting}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-primary/45">
              Leave empty to keep the campaign eligible
              indefinitely.
            </p>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-primary">
              Priority
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={values.priority}
              onChange={(event) =>
                updateValue(
                  "priority",
                  Math.max(
                    0,
                    Number(event.target.value) || 0
                  )
                )
              }
              disabled={isSubmitting}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-primary outline-none transition-colors focus:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-primary/45">
              Higher numbers take precedence.
            </p>
          </label>

          <label className="flex min-h-12 items-center justify-between gap-5 border border-border bg-background px-4">
            <div>
              <p className="text-xs font-medium text-primary">
                Campaign active
              </p>

              <p className="mt-1 text-xs text-primary/45">
                Inactive campaigns cannot appear on the
                homepage.
              </p>
            </div>

            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) =>
                updateValue(
                  "isActive",
                  event.target.checked
                )
              }
              disabled={isSubmitting}
              className="size-4 accent-primary"
            />
          </label>
        </div>
      </section>

      {/* Summary */}
      <section className="border border-border bg-background px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
          Homepage Slot
        </p>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-primary">
              Campaign summary
            </h2>

            <div className="mt-3 space-y-1 text-sm text-primary/60">
              <p>
                Status:{" "}
                <span className="text-primary">
                  {values.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </p>

              <p>
                Priority:{" "}
                <span className="text-primary">
                  {values.priority}
                </span>
              </p>

              <p>
                Destination:{" "}
                <span className="text-primary">
                  {destinationValue ||
                    "Not selected"}
                </span>
              </p>
            </div>
          </div>

          {values.desktopImage && (
            <a
              href={values.desktopImage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary/55 transition-colors hover:text-primary"
            >
              Open desktop image
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/campaigns")
          }
          disabled={isSubmitting}
          className="min-h-12 border border-border px-5 text-xs font-medium uppercase tracking-[0.12em] text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting || isUploading
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 text-xs font-medium uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}

          {isSubmitting
            ? "Saving..."
            : campaign?.id
              ? "Save Campaign"
              : "Create Campaign"}
        </button>
      </div>
    </form>
  );
}