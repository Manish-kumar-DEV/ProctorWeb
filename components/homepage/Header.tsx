"use client";

import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps, ImageProps } from "@relume_io/relume-ui";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";
import { FlipWords } from "../FlipWords";

type Props = {
  heading?: string;
  description?: string;
  buttons?: ButtonProps[];
  images?: ImageProps[];
};

export type HeaderProps = React.ComponentPropsWithoutRef<"section"> & Props;

export const Header = (props: HeaderProps) => {
  const { heading, description, buttons, images } = {
    ...HeaderDefaults,
    ...props,
  } as Props;

  const transformRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: transformRef });
  const animatedScrollYProgress = useSpring(scrollYProgress, {
    bounce: 0,
  });
  const yFirst = useTransform(
    animatedScrollYProgress,
    [0, 1],
    ["0vh", "-87.5vh"]
  );
  const ySecond = useTransform(
    animatedScrollYProgress,
    [0, 1],
    ["0vh", "-39.6vh"]
  );

  return (
    <section
      ref={transformRef}
      className="relative h-[150vh] px-[5%] md:h-[300vh]"
    >
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        <div className="absolute bottom-0 left-0 right-auto top-0 z-10">
          <motion.div
            className="flex flex-col gap-[26vw] pt-[70vh]"
            style={{ y: yFirst }}
          >
            {images?.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={clsx("relative h-[35vw] pt-[120%] sm:h-auto", {
                  "w-[30vw] md:w-[28vw] lg:w-[22vw]": index === 0,
                  "left-[52vw] mt-[-46vw] w-[30vw] md:w-[28vw] lg:left-[58vw] lg:w-[22vw]":
                    index === 1,
                  "left-[4vw] mt-[-5vw] w-[28vw] md:w-[26vw] lg:w-[20vw]":
                    index === 2,
                  "left-[64vw] mt-[-45vw] w-[26vw] md:w-[24vw] lg:w-[18vw]":
                    index === 3,
                })}
              >
                <img
                  src={image.src}
                  className="absolute inset-0 size-full object-cover"
                  alt={image.alt}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-0 left-auto right-0 top-0 z-0"
          style={{ y: ySecond }}
        >
          <div className="flex flex-col gap-[26vw] pt-[70vh]">
            {images?.slice(4).map((image, index) => (
              <div
                key={index}
                className={clsx(
                  "relative h-[35vw] pt-[120%] opacity-75 sm:h-auto",
                  {
                    "w-[28vw] md:w-[26vw] lg:w-[20vw]": index === 0,
                    "right-[50vw] mt-[-44vw] w-[26vw] md:w-[24vw] lg:right-[54vw] lg:w-[18vw]":
                      index === 1,
                  }
                )}
              >
                <img
                  src={image.src}
                  className="absolute inset-0 size-full object-cover"
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </motion.div>
        <div className="container relative flex h-full max-w-xl items-center pb-24 pt-16 text-center md:pt-24 lg:py-28">
          <div>
            <h1 className=" mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Transforming
              <div>
                <FlipWords words={["Assessments", "Hiring", "Quizzes"]} />
              </div>
            </h1>
            <p className="relative z-20 md:text-md ">{description}</p>
            <div className="relative z-20 mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              {buttons?.map((button, index) => (
                <Button
                  key={`${button.title}-${index}`}
                  variant={button.variant}
                  size={button.size}
                  iconRight={button.iconRight}
                  iconLeft={button.iconLeft}
                >
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 mt-[35rem] md:mt-[100vh]" />
      </div>
    </section>
  );
};

export const HeaderDefaults: HeaderProps = {
  heading: "Transforming Assessment",
  description:
    "Elevate your hiring process with our cutting-edge web application software. Designed to streamline the assessment process, ProctorWeb is the perfect solution for any business looking to improve their hiring process.",
  buttons: [
    {
      title: "Learn More",
    },
    {
      title: "Sign Up",
      variant: "secondary",
    },
  ],
  images: [
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 1",
    },
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 2",
    },
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 3",
    },
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 4",
    },
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 5",
    },
    {
      src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
      alt: "Placeholder image 6",
    },
  ],
};
