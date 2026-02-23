-- CreateEnum
CREATE TYPE "MatriculationOutcome" AS ENUM ('ACCEPTED', 'MATRICULATED');

-- AlterTable
ALTER TABLE "matriculation_records" ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "outcome" "MatriculationOutcome" NOT NULL DEFAULT 'MATRICULATED';

-- CreateIndex
CREATE INDEX "matriculation_records_outcome_idx" ON "matriculation_records"("outcome");
