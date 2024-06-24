-- CreateEnum
CREATE TYPE "Species" AS ENUM ('dog', 'cat');

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "species" "Species" NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "birthYear" INTEGER NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo_url" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pets_name_species_idx" ON "pets"("name", "species");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
