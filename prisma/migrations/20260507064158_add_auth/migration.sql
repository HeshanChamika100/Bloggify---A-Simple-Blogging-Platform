/*
  Warnings:

  - Added the required column `password` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Author" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
