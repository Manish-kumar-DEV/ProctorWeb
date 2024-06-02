"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Button as RelumeButton, Input, Label } from "@relume_io/relume-ui";
import type { ImageProps, ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import MainLogo from "@/components/MainLogo";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";

type Props = {
  logo: ImageProps;
  signUpText: string;
  signUpLink: {
    text: string;
    url: string;
  };
  title: string;
  description: string;
  logInButton: ButtonProps;
  logInWithGoogleButton: ButtonProps;
  forgotPassword: {
    text: string;
    url: string;
  };
  footerText: string;
};

export type LoginProps = React.ComponentPropsWithoutRef<"section"> & Props;
export default function Login(props: LoginProps) {
  const {
    logo,
    signUpText,
    signUpLink,
    title,
    description,
    logInButton,
    logInWithGoogleButton,
    forgotPassword,
    footerText,
  } = {
    ...LoginDefaults,
    ...props,
  } as Props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, isLoading, isError, user } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onLogin(email, password)
      .then((e) => {
        console.log("login successfull", e);
      })
      .catch((err) => {
        console.error("login error", err);
      });
  };

  useEffect(() => {
    if (isError) {
      toast.error("Error in Login! Check credentials", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setEmail("");
      setPassword("");
    }
  }, [isError]);

  return (
    <section className="px-[5%]">
      <div className="relative flex min-h-svh flex-col items-stretch justify-center overflow-auto py-24 lg:py-20">
        <div className="absolute bottom-auto left-0 right-0 top-0 flex h-16 w-full items-center justify-between md:h-18">
          <div>
            <MainLogo />
          </div>
          <div className="inline-flex gap-x-1">
            <p className="hidden md:block">{signUpText}</p>
            <Link
              href={signUpLink.url}
              className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
            >
              {signUpLink.text}
            </Link>
          </div>
        </div>
        <div className="container max-w-sm">
          <div className="mb-6 text-center md:mb-8">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {title}
            </h1>
            <p className="md:text-md">{description}</p>
          </div>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
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
                type="submit"
                className={`bg-primary-200 w-full dark:bg-primary-500 text-black dark:text-white text-md py-6`}
              >
                {logInButton.title}
              </Button>
              <RelumeButton
                variant={logInWithGoogleButton.variant}
                size={logInWithGoogleButton.size}
                iconLeft={logInWithGoogleButton.iconLeft}
                iconRight={logInWithGoogleButton.iconRight}
                className="gap-x-3"
              >
                {logInWithGoogleButton.title}
              </RelumeButton>
            </div>
          </form>
          <div className="mt-5 w-full text-center md:mt-6">
            <Link
              href={forgotPassword.url}
              className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
            >
              {forgotPassword.text}
            </Link>
          </div>
        </div>
        <footer className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center md:h-18">
          <p className="text-sm">{footerText}</p>
        </footer>
      </div>
    </section>
  );
}

export const LoginDefaults: LoginProps = {
  logo: {
    src: "https://relume-assets.s3.amazonaws.com/logo-image.svg",
    alt: "Logo text",
  },
  signUpText: "Don't have an account?",
  signUpLink: {
    text: "Sign up",
    url: "/signup",
  },
  title: "Log In",
  description: "Lorem ipsum dolor sit amet adipiscing elit.",
  logInButton: {
    title: "Log in",
  },
  logInWithGoogleButton: {
    variant: "secondary",
    title: "Log in with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  forgotPassword: {
    text: "Forgot your password?",
    url: "#",
  },
  footerText: "© 2024 ProctorWeb",
};
