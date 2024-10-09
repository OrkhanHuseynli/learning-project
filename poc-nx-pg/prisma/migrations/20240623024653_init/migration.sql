/*
  Warnings:

  - Added the required column `created_by` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'site_owner', 'site_editor', 'viewer');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '83unsu837w92owos-w-2?sksoppwsjd',
ADD COLUMN     "roles" "Role"[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
