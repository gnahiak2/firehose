-- CreateTable
CREATE TABLE "UnsubOptOut" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnsubOptOut_pkey" PRIMARY KEY ("userId")
);
