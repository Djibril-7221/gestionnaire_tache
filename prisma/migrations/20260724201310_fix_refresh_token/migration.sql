/*
  Warnings:

  - You are about to drop the column `user_id` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `utilisateur_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "user_id",
ADD COLUMN     "utilisateur_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
