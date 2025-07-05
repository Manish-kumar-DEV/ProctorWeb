"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Button as RelumeButton, Input, Label } from "@relume_io/relume-ui";
import type { ImageProps, ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import MainLogo from "@/components/MainLogo";
import Link from "next/link";
import Image from "next/image";

type Props = {
  logo: ImageProps;
  logoLink: string;
  title: string;
  description: string;
  signUpButton: ButtonProps;
  signUpWithGoogleButton: ButtonProps;
  image: ImageProps;
  logInText: string;
  logInLink: {
    text: string;
    url: string;
  };
  footerText: string;
};

export type SignupProps = React.ComponentPropsWithoutRef<"section"> & Props;

export default function Signup(props: SignupProps) {
  const {
    logo,
    logoLink,
    title,
    description,
    signUpButton,
    signUpWithGoogleButton,
    image,
    logInText,
    logInLink,
    footerText,
  } = {
    ...SignupDefaults,
    ...props,
  } as Props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { onSignup } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSignup({ name, email, password })
      .then(() => {
        console.log("Success in signup");
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error("Error in signup:", err);
      });
  };

  return (
    <section>
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
        <div className="absolute bottom-auto left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <MainLogo />
        </div>
        <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="container mb-6 max-w-lg text-center md:mb-8">
              <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                {title}
              </h1>
              <p className="md:text-md">{description}</p>
            </div>
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2">
                  Name*
                </Label>
                <Input
                  type="text"
                  id="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2">
                  Email*
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2">
                  Password*
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid-col-1 grid gap-4">
                <Button
                  radius="none"
                  className={`bg-primary-200 w-full dark:bg-primary-500 text-black dark:text-white text-md py-6`}
                  // iconLeft={signUpButton.iconLeft}
                  // iconRight={signUpButton.iconRight}
                >
                  {signUpButton.title}
                </Button>
                <RelumeButton
                  variant={signUpWithGoogleButton.variant}
                  size={signUpWithGoogleButton.size}
                  iconLeft={signUpWithGoogleButton.iconLeft}
                  iconRight={signUpWithGoogleButton.iconRight}
                  className="gap-x-3"
                >
                  {signUpWithGoogleButton.title}
                </RelumeButton>
              </div>
            </form>
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>{logInText}</p>
              <Link
                href={logInLink.url}
                className="underline focus-visible:outline-none"
              >
                {logInLink.text}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-background-secondary lg:block relative">
          <Image
            src={"/annie-spratt-hX_hf2lPpUU-unsplash.jpg"}
            fill={true}
            objectFit="cover"
            alt={image?.alt || "signup_page_image"}
          />
        </div>
        <footer className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center pr-[5%] md:h-18 lg:justify-start lg:px-[5%]">
          <p className="text-sm">{footerText}</p>
        </footer>
      </div>
    </section>
  );
}

const SignupDefaults: SignupProps = {
  logo: {
    src: "https://relume-assets.s3.amazonaws.com/logo-image.svg",
    alt: "Logo text",
  },
  logoLink: "#",
  title: "Sign Up",
  description: "Create an account to start taking assessments",
  signUpButton: {
    title: "Sign up",
  },
  signUpWithGoogleButton: {
    variant: "secondary",
    title: "Sign up with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  image: {
    src: "https://relume-assets.s3.amazonaws.com/placeholder-image.svg",
    alt: "Placeholder image",
  },
  logInText: "Already have an account?",
  logInLink: {
    text: "Log in",
    url: "/login",
  },
  footerText: "© 2024 ProctorWeb",
};
