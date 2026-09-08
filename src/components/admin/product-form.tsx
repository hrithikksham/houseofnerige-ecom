"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Box,
  Check,
  ChevronDown,
  Eye,
  FileText,
  ImageIcon,
  Layers3,
  Package,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { Button, Input } from "@/components/ui";

import {
  createProduct,
  updateProduct,
} from "@/app/admin/products/actions";

import { ProductImageUpload } from "@/components/admin/product-image-upload";

type ProductImage = {
  id?: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];

  collections: {
    id: string;
    name: string;
  }[];

  product?: {
    id: string;
    name: string;
    sku: string;
    shortDescription: string | null;
    description: string | null;
    regularPrice: string;
    discountPercent: string;
    categoryId: string;
    stockQuantity: number;
    lowStockThreshold: number;
    isNewArrival: boolean;
    isFeatured: boolean;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

    collectionIds: string[];

    images: ProductImage[];

    specification: {
      fabric: string | null;
      colour: string | null;
      sareeLength: string | null;
      blousePieceIncluded: boolean;
      blousePieceLength: string | null;
      workWeave: string | null;
      occasion: string | null;
      careInstructions: string | null;
    } | null;
  };
};

type SectionProps = {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function Section({
  number,
  eyebrow,
  title,
  description,
  icon,
  children,
}: SectionProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-primary/10 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex gap-4 border-b border-primary/10 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.035] text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-terracotta">
              {number}
            </span>

            <span className="h-px w-5 bg-primary/15" />

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary/40">
              {eyebrow}
            </p>
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary/55">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-primary">
        {label}
      </label>

      {description && (
        <p className="mb-3 text-xs leading-5 text-primary/45">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-12 w-full appearance-none rounded-xl border border-primary/15 bg-background px-4 pr-10 text-sm text-primary outline-none transition-all duration-200 focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.04]"
      >
        {children}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary/40"
        strokeWidth={1.5}
      />
    </div>
  );
}

export function ProductForm({
  categories,
  collections,
  product,
}: ProductFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [images, setImages] = useState<ProductImage[]>(
    product?.images ?? []
  );

  const isEditing = Boolean(product);

  function handleSubmit(formData: FormData) {
    setError("");

    if (images.length === 0) {
      setError(
        "Please upload at least one product image."
      );
      return;
    }

    formData.delete("imageUrls");
    formData.delete("imageAltTexts");
    formData.delete("imageSortOrders");
    formData.delete("primaryImageIndex");

    if (isEditing && product) {
      formData.set("id", product.id);
    }

    images.forEach((image, index) => {
      formData.append("imageUrls", image.imageUrl);

      formData.append(
        "imageAltTexts",
        image.altText ?? ""
      );

      formData.append(
        "imageSortOrders",
        String(image.sortOrder ?? index)
      );
    });

    const primaryImageIndex = images.findIndex(
      (image) => image.isPrimary
    );

    formData.append(
      "primaryImageIndex",
      String(
        primaryImageIndex === -1
          ? 0
          : primaryImageIndex
      )
    );

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(formData)
        : await createProduct(formData);

      if (!result.success) {
        setError(
          result.error ??
            "Something went wrong while saving the product."
        );
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto w-full max-w-5xl pb-28"
    >
      {/* Form intro */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
          {isEditing
            ? "Product Editor"
            : "New Product"}
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {isEditing
                ? product?.name
                : "Create product"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/55">
              {isEditing
                ? "Update your product details, inventory, media and storefront settings."
                : "Add all product information before publishing it to your storefront."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-primary/45">
            <span
              className={`size-2 rounded-full ${
                product?.status === "PUBLISHED"
                  ? "bg-emerald-500"
                  : "bg-primary/30"
              }`}
            />

            {product?.status === "PUBLISHED"
              ? "Published"
              : "Draft"}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 01 Basic */}
        <Section
          number="01"
          eyebrow="Product"
          title="Basic information"
          description="The essential details used to identify this saree across your store."
          icon={
            <Package
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="grid gap-6">
            <Field label="Product name">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Handwoven Kanjivaram Silk Saree"
                defaultValue={product?.name ?? ""}
                required
                disabled={isPending}
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="SKU"
                description="Your internal product identifier."
              >
                <Input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="NRG-KAN-001"
                  defaultValue={product?.sku ?? ""}
                  required
                  disabled={isPending}
                />
              </Field>

              <Field
                label="Category"
                description="Choose where this product belongs."
              >
                <Select
                  id="categoryId"
                  name="categoryId"
                  required
                  disabled={
                    isPending ||
                    categories.length === 0
                  }
                  defaultValue={
                    product?.categoryId ?? ""
                  }
                >
                  <option
                    value=""
                    disabled
                  >
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Short description"
              description="A concise introduction shown in product listings and summaries."
            >
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                disabled={isPending}
                defaultValue={
                  product?.shortDescription ?? ""
                }
                placeholder="A short introduction shown with the product..."
                className="w-full resize-y rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm leading-6 text-primary outline-none transition-all placeholder:text-primary/30 focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.04]"
              />
            </Field>
          </div>
        </Section>

        {/* 02 Media */}
        <Section
          number="02"
          eyebrow="Media"
          title="Product images"
          description="Upload multiple saree images. The first primary image becomes the main storefront image."
          icon={
            <ImageIcon
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="rounded-2xl border border-dashed border-primary/15 bg-primary/[0.015] p-3 sm:p-4">
            <ProductImageUpload
              images={images}
              onChange={setImages}
              disabled={isPending}
            />
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary/[0.035] px-4 py-3">
            <ImageIcon
              className="size-4 shrink-0 text-primary/50"
              strokeWidth={1.5}
            />

            <p className="text-xs leading-5 text-primary/50">
              {images.length === 0
                ? "No images uploaded yet."
                : `${images.length} ${
                    images.length === 1
                      ? "image"
                      : "images"
                  } ready to save.`}
            </p>
          </div>
        </Section>

        {/* 03 Organization */}
        <Section
          number="03"
          eyebrow="Organization"
          title="Collections"
          description="Add this product to one or more curated collections."
          icon={
            <Layers3
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          {collections.length === 0 ? (
            <div className="rounded-2xl border border-primary/10 bg-primary/[0.025] px-5 py-6">
              <p className="text-sm text-primary/55">
                No published collections are available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {collections.map((collection) => {
                const checked =
                  product?.collectionIds.includes(
                    collection.id
                  ) ?? false;

                return (
                  <label
                    key={collection.id}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-primary/10 bg-background px-4 py-4 transition-all hover:border-primary/20 hover:bg-primary/[0.015]"
                  >
                    <input
                      type="checkbox"
                      name="collectionIds"
                      value={collection.id}
                      disabled={isPending}
                      defaultChecked={checked}
                      className="peer sr-only"
                    />

                    <span className="flex size-5 items-center justify-center rounded-md border border-primary/20 transition-all peer-checked:border-primary peer-checked:bg-primary">
                      <Check
                        className="size-3 text-soft-white opacity-0 transition-opacity peer-checked:opacity-100"
                        strokeWidth={2.5}
                      />
                    </span>

                    <span className="text-sm font-medium text-primary/75">
                      {collection.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </Section>

        {/* 04 Pricing */}
        <Section
          number="04"
          eyebrow="Pricing"
          title="Price and discount"
          description="Set the original product price and optional customer discount."
          icon={
            <Tag
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Regular price"
              description="The standard selling price in INR."
            >
              <Input
                id="regularPrice"
                name="regularPrice"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={
                  product?.regularPrice ?? ""
                }
                disabled={isPending}
                placeholder="0.00"
              />
            </Field>

            <Field
              label="Discount percentage"
              description="The final price is calculated automatically."
            >
              <Input
                id="discountPercent"
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue={
                  product?.discountPercent ?? "0"
                }
                disabled={isPending}
                placeholder="0"
              />
            </Field>
          </div>
        </Section>

        {/* 05 Inventory */}
        <Section
          number="05"
          eyebrow="Inventory"
          title="Stock"
          description="Control product availability and low stock notifications."
          icon={
            <Box
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Available quantity"
              description="Current units available for purchase."
            >
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                required
                defaultValue={
                  product?.stockQuantity ?? 0
                }
                disabled={isPending}
              />
            </Field>

            <Field
              label="Low stock alert"
              description="Warn when inventory reaches this amount."
            >
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                defaultValue={
                  product?.lowStockThreshold ?? 3
                }
                disabled={isPending}
              />
            </Field>
          </div>
        </Section>

        {/* 06 Specifications */}
        <Section
          number="06"
          eyebrow="Product details"
          title="Specifications"
          description="These details power storefront filters and help customers understand the saree."
          icon={
            <Sparkles
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Fabric">
              <Input
                id="fabric"
                name="fabric"
                type="text"
                defaultValue={
                  product?.specification?.fabric ?? ""
                }
                placeholder="e.g. Pure Silk"
                disabled={isPending}
              />
            </Field>

            <Field label="Colour">
              <Input
                id="colour"
                name="colour"
                type="text"
                defaultValue={
                  product?.specification?.colour ?? ""
                }
                placeholder="e.g. Deep Maroon"
                disabled={isPending}
              />
            </Field>

            <Field label="Saree length (metres)">
              <Input
                id="sareeLength"
                name="sareeLength"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  product?.specification?.sareeLength ??
                  ""
                }
                placeholder="5.5"
                disabled={isPending}
              />
            </Field>

            <Field label="Work / weave">
              <Input
                id="workWeave"
                name="workWeave"
                type="text"
                defaultValue={
                  product?.specification?.workWeave ??
                  ""
                }
                placeholder="e.g. Handwoven Zari"
                disabled={isPending}
              />
            </Field>

            <Field label="Occasion">
              <Input
                id="occasion"
                name="occasion"
                type="text"
                defaultValue={
                  product?.specification?.occasion ??
                  ""
                }
                placeholder="e.g. Wedding"
                disabled={isPending}
              />
            </Field>

            <Field label="Blouse piece">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-primary/15 bg-background px-4 transition-colors hover:border-primary/25">
                <input
                  id="blousePieceIncluded"
                  name="blousePieceIncluded"
                  type="checkbox"
                  defaultChecked={
                    product?.specification
                      ?.blousePieceIncluded ?? false
                  }
                  disabled={isPending}
                  className="size-4 accent-primary"
                />

                <span className="text-sm text-primary/70">
                  Blouse piece included
                </span>
              </label>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Blouse piece length (metres)">
                <Input
                  id="blousePieceLength"
                  name="blousePieceLength"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    product?.specification
                      ?.blousePieceLength ?? ""
                  }
                  placeholder="0.8"
                  disabled={isPending}
                />
              </Field>
            </div>
          </div>
        </Section>

        {/* 07 Description */}
        <Section
          number="07"
          eyebrow="Content"
          title="Product description"
          description="Write the detailed product story shown on the storefront."
          icon={
            <FileText
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <textarea
            id="description"
            name="description"
            rows={9}
            disabled={isPending}
            defaultValue={
              product?.description ?? ""
            }
            placeholder="Write the complete product description..."
            className="w-full resize-y rounded-2xl border border-primary/15 bg-background px-4 py-4 text-sm leading-7 text-primary outline-none transition-all placeholder:text-primary/30 focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.04]"
          />
        </Section>

        {/* 08 Care */}
        <Section
          number="08"
          eyebrow="Care"
          title="Care instructions"
          description="Explain how customers should care for the saree."
          icon={
            <Archive
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <textarea
            id="careInstructions"
            name="careInstructions"
            rows={5}
            disabled={isPending}
            defaultValue={
              product?.specification
                ?.careInstructions ?? ""
            }
            placeholder="e.g. Dry clean only. Store in a breathable garment bag..."
            className="w-full resize-y rounded-2xl border border-primary/15 bg-background px-4 py-4 text-sm leading-7 text-primary outline-none transition-all placeholder:text-primary/30 focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.04]"
          />
        </Section>

        {/* 09 Publishing */}
        <Section
          number="09"
          eyebrow="Publishing"
          title="Storefront settings"
          description="Choose whether this product is saved privately or available for customers."
          icon={
            <Eye
              className="size-5"
              strokeWidth={1.5}
            />
          }
        >
          <div className="space-y-6">
            <Field label="Product status">
              <Select
                id="status"
                name="status"
                defaultValue={
                  product?.status === "ARCHIVED"
                    ? "DRAFT"
                    : product?.status ?? "DRAFT"
                }
                disabled={isPending}
              >
                <option value="DRAFT">
                  Save as Draft
                </option>

                <option value="PUBLISHED">
                  Publish Product
                </option>
              </Select>
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/10 bg-primary/[0.015] p-4 transition-colors hover:border-primary/20">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  defaultChecked={
                    product?.isNewArrival ?? false
                  }
                  disabled={isPending}
                  className="mt-0.5 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-medium text-primary">
                    Mark as new arrival
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-primary/45">
                    Show a New badge on the storefront.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/10 bg-primary/[0.015] p-4 transition-colors hover:border-primary/20">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={
                    product?.isFeatured ?? false
                  }
                  disabled={isPending}
                  className="mt-0.5 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-medium text-primary">
                    Mark as featured
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-primary/45">
                    Make this product available for featured sections.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </Section>
      </div>

      {error && (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-xl sm:left-auto sm:right-6 sm:mx-0 sm:w-[480px]">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-xl shadow-red-900/5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-900">
                Unable to save product
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 transition-colors hover:text-red-700"
              aria-label="Dismiss error"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/10 bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div
              className={`size-2 rounded-full ${
                images.length > 0
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            <p className="text-sm text-primary/50">
              {images.length > 0
                ? `${images.length} ${
                    images.length === 1
                      ? "image"
                      : "images"
                  } attached`
                : "Add at least one product image"}
            </p>
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() =>
                router.push("/admin/products")
              }
              className="min-h-11"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="secondary"
              disabled={
                isPending ||
                categories.length === 0
              }
              className="min-h-11 min-w-[170px]"
            >
              {isPending ? (
                isEditing
                  ? "Saving..."
                  : "Creating..."
              ) : (
                <>
                  <Save className="size-4" />

                  {isEditing
                    ? "Save Changes"
                    : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}