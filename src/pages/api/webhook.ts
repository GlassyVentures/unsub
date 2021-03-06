import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "@/libs/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};
const endpointSecret = process.env.STRIPE_WEBHOOK!;

const stripe = new Stripe(process.env.STRIPE_PRIV!, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).end();
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.read(), sig!, endpointSecret);
  } catch (err) {
    console.log(err);
  }

  switch (event?.type) {
    case "payment_intent.succeeded":
      const obj: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;

      const email = obj.charges.data[0]?.billing_details.email;

      email &&
        (await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            earlyAccess: true,
          },
        }));
      break;
    default:
      console.log("Unhandled Webhook");
  }

  res.status(200).send("acknowledged");
}
