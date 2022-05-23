import siteMetaData from "configs/siteMetaData";
import { NextSeo } from "next-seo";

interface seoProps {
  image?: string;
  desc?: string;
  path?: string;
  title?: string;
  date?: string;
  updated?: string;
}

const Seo = ({ title, desc, image, path, date, updated }: seoProps) => {
  const {
    title: configTitle,
    description: configDescription,
    image: configImage,
    url,
    twitter,
  } = siteMetaData;

  const seo = {
    description: desc || configDescription,
    image: `${url}${image}` || configImage,
    title: `${title} - ${configTitle}` || configTitle,
    url: `${url}${path || ""}`,
    date: date,
    updated: updated || date,
  };
  const formattedDate = seo.date ? new Date(seo.date).toISOString() : "";
  const formattedUpdatedDate = seo.updated
    ? new Date(seo.updated).toISOString()
    : "";
  const featuredImage = {
    url: seo.image,
    alt: seo.title,
  };
  return (
    <>
      <NextSeo
        title={seo.title}
        description={seo.description}
        canonical={seo.url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: formattedDate,
            modifiedTime: formattedUpdatedDate,
          },
          url: seo.url,
          title: seo.title,
          description: seo.description,
          images: [featuredImage],
        }}
        twitter={{
          handle: twitter,
          site: twitter,
          cardType: "summary",
        }}
      />
    </>
  );
};

export { Seo };
