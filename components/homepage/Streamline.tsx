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
  sections?: any[];
};

export type StreamlineProps = React.ComponentPropsWithoutRef<"section"> & Props;

export const Streamline = (props: StreamlineProps) => {
  const { tagline, heading, features, sections, description, buttons, image } =
    {
      ...StreamlineDefaults,
      ...props,
    } as Props;
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 ">
      <div className="container">
        <div className="grid grid-rows-1 grid-cols-1 gap-y-12 md:grid-cols-3 md:items-center md:gap-x-12 lg:gap-x-20">
          <div className="col-span-2">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-7xl">
              {heading}
            </h2>
            <p className="md:text-md antialiased">{description}</p>
          </div>
        </div>

        <section className="py-16 md:py-18 lg:py-20">
          <div className="container grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12 lg:gap-y-16">
            {sections?.map((section, index) => (
              <div
                key={`${section.heading}-${index}`}
                className="flex w-full flex-col "
              >
                <div className="mb-6 md:mb-8">
                  <img src={section.image.src} alt={section.image.alt} />
                </div>
                <p className="mb-3 font-semibold md:mb-4">{section.tagline}</p>
                <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  {section.heading}
                </h3>
                <p>{section.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export const StreamlineDefaults: StreamlineProps = {
  tagline: "Streamline",
  heading: "Efficiently Monitor and Prevent Cheating in Assessments",
  description:
    "Our web-based software application offers real-time monitoring, automated cheating detection, and detailed reporting to help businesses ensure the integrity of their assessments.",
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
  sections: [
    {
      image: {
        src: "/Data report-pana.png",
        alt: "Placeholder image 1",
      },

      heading: "Real-time Monitoring",
      description:
        "Monitor candidates' activities in real-time during assessments.",
    },
    {
      image: {
        src: "/Code typing-rafiki.png",
        alt: "Placeholder image 2",
      },

      heading: "Cheating Detection",
      description:
        "Utilize advanced algorithms to detect cheating behavior automatically.",
    },
    {
      image: {
        src: "/Consulting-amico.png",
        alt: "Placeholder image 3",
      },

      heading: "Detailed Reporting",
      description:
        "Generate comprehensive reports on assessment results and cheating incidents.",
    },
  ],
};
