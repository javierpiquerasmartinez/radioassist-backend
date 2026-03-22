/*
  Warnings:

  - You are about to drop the column `plantillaUsada` on the `HistorialInforme` table. All the data in the column will be lost.
  - You are about to drop the `Plantilla` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `templateUsed` to the `HistorialInforme` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plantilla" DROP CONSTRAINT "Plantilla_usuarioId_fkey";

-- AlterTable
ALTER TABLE "HistorialInforme" DROP COLUMN "plantillaUsada",
ADD COLUMN     "templateUsed" TEXT NOT NULL;

-- DropTable
DROP TABLE "Plantilla";

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
