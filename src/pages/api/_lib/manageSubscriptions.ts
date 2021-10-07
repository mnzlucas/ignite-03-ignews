import { stripe } from './../../../services/stripe';
import { query } from 'faunadb';
import { fauna } from './../../../services/fauna';


export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const userRef = await fauna.query(
    query.Select(
      "ref",
      query.Get(
        query.Match(
          query.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id:       subscription.id,
    userId:   userRef,
    status:   subscription.status,
    priceId:  subscription.items.data[0].price.id,
  }

  if (createAction) {
    await fauna.query(
      query.Create(
        query.Collection('subscriptions'), 
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          "ref",
          query.Get(
            query.Match(
              query.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ),
        {data: subscriptionData}
      )
    )
  }
}