-- CreateEnum
CREATE TYPE "HomepageSectionType" AS ENUM ('HERO', 'EDITORIAL', 'FEATURED_PRODUCTS', 'COLLECTIONS', 'TEXT');

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "HomepageSectionType" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "eyebrow" TEXT,
    "description" TEXT,
    "desktopImage" TEXT,
    "mobileImage" TEXT,
    "linkType" "LinkType",
    "linkValue" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageFeaturedProduct" (
    "sectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomepageFeaturedProduct_pkey" PRIMARY KEY ("sectionId","productId")
);

-- CreateIndex
CREATE INDEX "HomepageSection_status_idx" ON "HomepageSection"("status");

-- CreateIndex
CREATE INDEX "HomepageSection_sortOrder_idx" ON "HomepageSection"("sortOrder");

-- CreateIndex
CREATE INDEX "HomepageSection_type_idx" ON "HomepageSection"("type");

-- CreateIndex
CREATE INDEX "HomepageFeaturedProduct_productId_idx" ON "HomepageFeaturedProduct"("productId");

-- CreateIndex
CREATE INDEX "HomepageFeaturedProduct_sortOrder_idx" ON "HomepageFeaturedProduct"("sortOrder");

-- CreateIndex
CREATE INDEX "CampaignBanner_startDate_idx" ON "CampaignBanner"("startDate");

-- CreateIndex
CREATE INDEX "CampaignBanner_endDate_idx" ON "CampaignBanner"("endDate");

-- AddForeignKey
ALTER TABLE "HomepageFeaturedProduct" ADD CONSTRAINT "HomepageFeaturedProduct_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "HomepageSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepageFeaturedProduct" ADD CONSTRAINT "HomepageFeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
