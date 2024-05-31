"use client";

import { Button } from "@relume_io/relume-ui";
import type { ImageProps, ButtonProps } from "@relume_io/relume-ui";

type Props = {
  heading?: string;
  description?: string;
  buttons?: ButtonProps[];
  image?: ImageProps;
};

export type Header1Props = React.ComponentPropsWithoutRef<"section"> & Props;

export const Header1 = (props: Header1Props) => {
  const { heading, description, buttons } = {
    ...Header1Defaults,
    ...props,
  } as Props;
  return (
    <header className="flex  flex-col">
      <div className="px-[5%]">
        <div className="container">
          <div className=" grid grid-rows-1 grid-cols-1 gap-0 py-12 md:grid-cols-3 md:gap-x-6 md:gap-y-8 md:py-18 lg:gap-x-10 lg:gap-y-16 lg:py-20">
            <h1 className="lg:p-5 col-span-2  mb-5 md:mb-0  text-6xl font-bold  md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <div className=" w-full flex items-center">
              <p className="text-base md:text-md">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header1Defaults: Header1Props = {
  heading: "Prevent dishonesty with proctored assessments",
  description:
    "Our web-based software application offers proctored assessments to ensure candidates cannot cheat during exams. With our advanced technology, businesses can trust the integrity of the assessment process.",
};
