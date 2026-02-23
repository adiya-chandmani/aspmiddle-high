-- CreateTable
CREATE TABLE "matriculation_records" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "university" TEXT NOT NULL,
    "country" TEXT,
    "student_name" TEXT,
    "program" TEXT,
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matriculation_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matriculation_records_year_idx" ON "matriculation_records"("year");
