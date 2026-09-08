import {
  PackageCheck,
  RotateCcw,
  Ruler,
  Sparkles,
  Truck,
} from "lucide-react";

type ProductSpecificationsProps = {
  product: {
    description: string | null;
    specifications: {
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

export function ProductSpecifications({
  product,
}: ProductSpecificationsProps) {
  const specification = product.specifications;

  const details = [
    {
      label: "Fabric",
      value: specification?.fabric,
    },
    {
      label: "Colour",
      value: specification?.colour,
    },
    {
      label: "Saree Length",
      value: specification?.sareeLength,
    },
    {
      label: "Blouse Piece",
      value: specification
        ? specification.blousePieceIncluded
          ? "Included"
          : "Not included"
        : null,
    },
    {
      label: "Blouse Length",
      value: specification?.blousePieceLength,
    },
    {
      label: "Work / Weave",
      value: specification?.workWeave,
    },
    {
      label: "Occasion",
      value: specification?.occasion,
    },
  ].filter((item) => item.value);

  return (
    <section className="border-t border-[#20444E]/10">
      {/* Description */}
      {product.description && (
        <div className="grid gap-8 border-b border-[#20444E]/10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
              About this saree
            </p>

            <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#181F1C]">
              Description
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="whitespace-pre-line text-sm leading-7 text-[#181F1C]/65 sm:text-base">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Specifications */}
      {details.length > 0 && (
        <div className="grid gap-8 border-b border-[#20444E]/10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#D8E8EA] text-[#20444E]">
              <Ruler
                className="size-4"
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
              Product details
            </p>

            <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#181F1C]">
              Specifications
            </h2>
          </div>

          <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-6 border-b border-[#20444E]/10 py-4"
              >
                <dt className="text-sm text-[#181F1C]/45">
                  {item.label}
                </dt>

                <dd className="text-right text-sm font-medium text-[#181F1C]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Care */}
      {specification?.careInstructions && (
        <div className="grid gap-8 border-b border-[#20444E]/10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#D8E8EA] text-[#20444E]">
              <Sparkles
                className="size-4"
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
              Product care
            </p>

            <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#181F1C]">
              Care instructions
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="whitespace-pre-line text-sm leading-7 text-[#181F1C]/65 sm:text-base">
              {specification.careInstructions}
            </p>
          </div>
        </div>
      )}

      {/* Shipping */}
      <div className="grid gap-8 border-b border-[#20444E]/10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="flex size-10 items-center justify-center rounded-full bg-[#D8E8EA] text-[#20444E]">
            <Truck
              className="size-4"
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
            Delivery
          </p>

          <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#181F1C]">
            Shipping
          </h2>
        </div>

        <div className="max-w-3xl">
          <p className="text-sm leading-7 text-[#181F1C]/65 sm:text-base">
            Shipping is calculated according to the delivery settings
            configured for your order. Final shipping charges are shown
            clearly during checkout before payment.
          </p>
        </div>
      </div>

      {/* Returns */}
      <div className="grid gap-8 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="flex size-10 items-center justify-center rounded-full bg-[#D8E8EA] text-[#20444E]">
            <RotateCcw
              className="size-4"
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
            Returns
          </p>

          <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#181F1C]">
            Returns & exchange
          </h2>
        </div>

        <div className="max-w-3xl">
          <p className="text-sm leading-7 text-[#181F1C]/65 sm:text-base">
            Please review the store&apos;s Returns & Exchange policy before
            placing your order. Eligibility and return conditions depend on
            the final store policy and product condition.
          </p>

          <div className="mt-5 flex items-center gap-3 text-xs text-[#355D68]">
            <PackageCheck
              className="size-4 shrink-0"
              strokeWidth={1.5}
            />

            <span>
              Product availability is revalidated before payment.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}