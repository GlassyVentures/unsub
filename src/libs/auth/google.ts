import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  "http://localhost:3000/api/auth/google"
);

const prisma = new PrismaClient();

export const getGoogleUrl = () => {
  const scopes = [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    // If you only need one scope you can pass it as a string
    scope: scopes,
  });
  return url;
};

export const getCurrentTokens = async (
  email: string,
  refresh_token: string
) => {
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
        email: email,
      },
    });
    throw refreshedTokens;
  }

  prisma.account.update({
    where: {
      email: email,
    },
    data: {
      refresh_token: refreshedTokens.refreshToken ?? refresh_token,
      access_token: refreshedTokens.accessToken,
      expires_at: Date.now() + refreshedTokens.expires_in,
    },
  });
  return {
    refresh_token: refreshedTokens.refresh_token,
    access_token: refreshedTokens.access_token,
  };
};

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  const data = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${tokens.id_token}`
  )
    .then((res) => res.json())
    .then((data) => data);

  const info = { email: data.email, providedAccountId: data.user_id };
  return { tokens, info };
};
