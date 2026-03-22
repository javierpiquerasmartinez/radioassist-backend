/*
  Warnings:

  - You are about to drop the `HistorialInforme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistorialInforme" DROP CONSTRAINT "HistorialInforme_usuarioId_fkey";

-- DropTable
DROP TABLE "HistorialInforme";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "templateUsed" TEXT NOT NULL,
    "originalDictation" TEXT NOT NULL,
    "generatedReport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
