import siteMetaData from "../../configs/siteMetaData";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

interface Props {
  title?: string;
}

const DefaultSeo = (props: Props) => {
  return (
    <>
      <NextDefaultSeo
        title={props.title || siteMetaData.title}
        description={siteMetaData.description}
        canonical={siteMetaData.url}
        openGraph={{
          type: "website",
          locale: "en_US",
          url: siteMetaData.url,
          title: siteMetaData.title,
          description: siteMetaData.description,
          images: [
            {
              url: siteMetaData.image,
              alt: siteMetaData.title,
              width: 1280,
              height: 720,
            },
          ],
        }}
      />
    </>
  );
};

export { DefaultSeo };
