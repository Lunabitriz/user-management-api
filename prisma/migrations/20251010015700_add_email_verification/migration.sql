-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "verificationExpires" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME
);
INSERT INTO "new_User" ("email", "fotoPerfil", "id", "nome", "resetPasswordExpires", "resetPasswordToken", "senha") SELECT "email", "fotoPerfil", "id", "nome", "resetPasswordExpires", "resetPasswordToken", "senha" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
