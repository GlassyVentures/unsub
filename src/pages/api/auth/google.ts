import { google } from "googleapis";
import { prisma } from "@/libs/prisma";

const getCurrentTokens = async (accountId: string, refresh_token: string) => {
  const url =
    "https://oauth2.googleapis.com/token?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_ID!,
      client_secret: process.env.GOOGLE_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    await prisma.account.delete({
      where: {
        id: accountId,
      },
    });
    throw refreshedTokens;
  }

  await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      refresh_token: refreshedTokens.refreshToken ?? refresh_token,
      access_token: refreshedTokens.accessToken,
      expires_at: Math.round((Date.now() + refreshedTokens.expires_in) / 1000),
    },
  });
  return {
    refresh_token: refreshedTokens.refresh_token,
    access_token: refreshedTokens.access_token,
  };
};

export const rotateGoogleTokens = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) throw new Error("User somehow not found");

  const accountInfo = user.accounts.filter(
    (account) => account.provider === "google"
  )[0]; // Email is unique.

  if (!accountInfo) return;
  if (accountInfo!.expires_at! * 1000 > Date.now()) return;

  const tokens = {
    refresh_token: accountInfo.refresh_token,
    access_token: accountInfo.access_token,
  };

  await getCurrentTokens(accountInfo.id, tokens.refresh_token!).catch((e) => {
    console.log(e);
    throw new Error("Account token is expired");
  });
};
