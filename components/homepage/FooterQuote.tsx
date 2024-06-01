"use client";

import type { ImageProps } from "@relume_io/relume-ui";

type Props = {
  heading?: string;
  description?: string;
  image?: ImageProps;
};

export type FooterQuoteProps = React.ComponentPropsWithoutRef<"section"> &
  Props;

export const FooterQuote = (props: FooterQuoteProps) => {
  const { heading, description, image } = {
    ...FooterQuoteDefaults,
    ...props,
  } as Props;
  return (
    <section className="relative px-[5%]">
      <div className="container">
        <div className="flex items-center py-16 md:py-24 lg:py-28">
          <div className="max-w-md">
            <h3 className="mb-5 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-6 md:text-5xl lg:text-6xl">
              {heading}
            </h3>
            <p className="text-base text-text-alternative md:text-md">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <img
          src={image?.src}
          className="size-full object-cover"
          alt={image?.alt}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const FooterQuoteDefaults: FooterQuoteProps = {
  heading: "Transforming the Future of Candidate Assessment",
  description:
    "Unlock the Power of Secure, Proctored Assessments with our Cutting-Edge Web Application Software. Elevate your Hiring Process, prevent Cheating and identify Top Talent!",
  image: {
    src: "/pexels-1.jpg",
    alt: "Placeholder image",
  },
};
