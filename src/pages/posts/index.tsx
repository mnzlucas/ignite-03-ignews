import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "./styles.module.scss"
import Prismic from "@prismicio/client"
import {getPrismicClient} from '../../services/prismic'

function Posts() {
  return(
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time> 12 de sei la</time>
            <strong>Creating something New</strong>
            <p>Something abou something</p>
          </a>
          <a>
            <time> 12 de sei la</time>
            <strong>Creating something New</strong>
            <p>Something abou something</p>
          </a>
          <a>
            <time> 12 de sei la</time>
            <strong>Creating something New</strong>
            <p>Something abou something</p>
          </a>
          <a>
            <time> 12 de sei la</time>
            <strong>Creating something New</strong>
            <p>Something abou something</p>
          </a>
        </div>
      </main>

    </>
  );
}

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })
  console.log(JSON.stringify(response, null,2))

  return {
    props: {}
  }
}