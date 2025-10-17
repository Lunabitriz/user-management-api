-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "accountTheme" TEXT NOT NULL DEFAULT 'sunset'
);
INSERT INTO "new_User" ("email", "fotoPerfil", "id", "nome", "senha", "accountTheme") SELECT "email", "fotoPerfil", "id", "nome", "senha", "accountTheme" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
