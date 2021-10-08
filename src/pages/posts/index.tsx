import Head from "next/head";
import styles from "./styles.module.scss"


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