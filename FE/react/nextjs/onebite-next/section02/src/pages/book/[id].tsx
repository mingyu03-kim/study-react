import fetchOneBook from "@/lib/fetch-one-book";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import style from "./[id].module.css";
// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//     const id = context.params?.id;
//     const book = await fetchOneBook(Number(id));
//     return {
//         props: {
//             book
//         },
//     }
// }
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { id: "1" } }, // url parameter는 반드시 string으로만.
      { params: { id: "2" } },
      { params: { id: "3" } },
    ],
    // fallback: false, // false일 경우, 생성해놓지 않은 path로 요청이 들어오면 404페이지 반환.
    // fallback: 'blocking', // blocking일 경우, 생성해놓지 않은 path로 요청이 들어오면 SSR처럼 즉시 페이지 생성 후, SSG처럼 작동
    fallback: true, // true일 경우, 우선 props가 없는 페이지를 사전 렌더링 후, props 계산 후 브라우저로 전송
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  const book = await fetchOneBook(Number(id));
  if (!book) return { notFound: true }; // NotFound 페이지로 이동하는 리턴 props.
  return {
    props: {
      book,
    },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>로딩중...</title>
          <meta property="og:image" content="/thumbnail.png" />
          <meta property="og:title" content="로딩중입니다..." />
          <meta property="og:description" content="로딩중" />
        </Head>
        <div>로딩중입니다.</div>
      </>
    );
  }
  if (!book) return "문제발생";
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;
  return (
    <>
      <Head>
        {/* 메타 태그 작성할 수 있다. */}
        <title>{title}</title>
        <meta property="og:image" content={coverImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className={style.container}>
        <div
          className={style.cover_img_container}
          style={{ backgroundImage: `url('${coverImgUrl}')` }}
        >
          <img src={coverImgUrl} />
        </div>
        <div className={style.title}>{title}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <div className={style.author}>
          {author} | {publisher}
        </div>
        <div className={style.description}>{description}</div>
      </div>
    </>
  );
}
