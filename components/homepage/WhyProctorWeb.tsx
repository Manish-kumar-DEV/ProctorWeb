"use client";

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps, ImageProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type Props = {
  tagline?: string;
  heading?: string;
  description?: string;
  buttons?: ButtonProps[];
  image?: ImageProps;
  features?: any[];
};

export type WhyProctorWebProps = React.ComponentPropsWithoutRef<"section"> &
  Props;

export const WhyProctorWeb = (props: WhyProctorWebProps) => {
  const { tagline, heading, features, description, buttons, image } = {
    ...WhyProctorWebDefaults,
    ...props,
  } as Props;
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 ">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-7xl">
              {heading}
            </h2>
            <p className="md:text-md antialiased">{description}</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 py-2 md:grid-cols-2 antialiased mt-8">
              {features?.map((feature, index) => (
                <div key={`${feature.heading}-${index}`}>
                  <div className="mb-3 md:mb-4">
                    <img
                      src={feature.icon.src}
                      className="size-10"
                      alt={feature.icon.alt}
                    />
                  </div>
                  <h1 className="mb-3 text-xl font-semibold md:mb-4 md:text-xl">
                    {feature.heading}
                  </h1>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src={"/At the office-amico.png"}
              className="w-full object-cover"
              alt={image?.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const WhyProctorWebDefaults: WhyProctorWebProps = {
  tagline: "Why Proctored Web?",
  heading:
    "Increase Candidate Evaluation Reliability and Integrity with Proctored Assessments",
  description:
    "Discover the benefits of using proctored assessments for your business. Ensure reliable and trustworthy candidate evaluations.",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight className="size-6" />,
    },
  ],
  image: {
    src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
    alt: "Placeholder image",
  },
  features: [
    {
      icon: {
        src: "https://relume-assets.s3.amazonaws.com/relume-icon.svg",
        alt: "Relume logo 1",
      },
      heading: "Reliability",
      description:
        "Proctored assessments provide a reliable way to evaluate candidates, minimizing cheating and fraud.",
    },
    {
      icon: {
        src: "https://relume-assets.s3.amazonaws.com/relume-icon.svg",
        alt: "Relume logo 2",
      },
      heading: "Integrity",
      description:
        "Maintain the integrity of your candidate evaluations with proctored assessments that prevent cheating.",
    },
  ],
};
