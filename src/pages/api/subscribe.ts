import { query } from 'faunadb';
import { fauna } from './../../services/fauna';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string,
  }
  data: {
    stripe_customer_id: string,
  }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  } else {

    const stripeSession = await getSession({ req });

    const faunaUser = await fauna.query<User>(
      query.Get(
        query.Match(
          query.Index('user_by_email'),
          query.Casefold(stripeSession.user.email)
        )
      )
    )

    let customerId = faunaUser.data.stripe_customer_id;

    if (!customerId) {

      const stripeCustomer = await stripe.customers.create({
        email: stripeSession.user.email,
      })

      await fauna.query(
        query.Update(
          query.Ref(query.Collection('users'), faunaUser.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )
      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
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