import { GetServerSideProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../service/stripe';
import Head from 'next/head';
import Image from 'next/image';

import styles from './home.module.scss';
import avatarImg from '../../public/images/avatar.svg';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

function Home({ product }: HomeProps) {
  return (
    <>
      <Head >
        <title>Início | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId= {product.priceId}/>
        </section>
        <Image src={avatarImg} alt="A girl coding" />
      </main>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1Jft79C8hyKk1LAnspUBdzYP')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount /100),
  };

  return {
    props: {
      product,
    }
  }
}