import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }else {

    const stripeSession = await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: stripeSession.user.email,
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1Jft79C8hyKk1LAnspUBdzYP',
          quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  }
}

export default subscribe;