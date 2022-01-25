import { PrismaClient } from "@prisma/client";
import { getGoogleTokens } from "libs/auth/google";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const primsa = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const code: string = req.query.code as string;
  const { tokens, info } = await getGoogleTokens(code);

  const user = await primsa.user.findFirst({
    where: {
      email: session!.user!.email,
    },
  });

  await primsa.account.upsert({
    where: {
      email: info.email,
    },
    update: {
      email: info.email,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expires_at: Math.floor(tokens.expiry_date! / 1000),
      id_token: tokens.id_token,
    },
    create: {
      userId: user!.id,
      type: "oauth",
      provider: "google",
      providerAccountId: info.providedAccountId,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expires_at: Math.floor(tokens.expiry_date! / 1000),
      token_type: "Bearer",
      scope: tokens.scope,
      email: info.email,
      id_token: tokens.id_token,
    },
  });

  res.redirect("http://localhost:3000/Subscriptions");
}
