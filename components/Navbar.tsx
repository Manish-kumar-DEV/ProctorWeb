"use client";

import { useState } from "react";
// import { Button } from "@relume_io/relume-ui";
import type { ImageProps, ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";
import ThemeSwitch from "./ThemeSwitch";
import MainLogo from "./MainLogo";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@nextui-org/react";

type LinkProps = {
  title: string;
  url: string;
};

type MenuLinkProps = LinkProps & {
  subLinks?: LinkProps[];
};

type Props = {
  logo?: ImageProps;
  links?: MenuLinkProps[];
  buttons?: ButtonProps[];
};

export type NavbarProps = React.ComponentPropsWithoutRef<"section"> & Props;

const topLineVariants = {
  open: {
    translateY: 8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: -45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1 },
  },
  closed: {
    width: "1.5rem",
    transition: { delay: 0.3, duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: 45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const dropDownVariants = {
  open: {
    height: "var(--height-open, 100dvh)",
    transition: { duration: 0.2 },
  },
  close: {
    height: "var(--height-closed, 0)",
    transition: { duration: 0.3 },
  },
};

export const Navbar = (props: NavbarProps) => {
  const { logo, links, buttons } = {
    ...NavbarDefaults,
    ...props,
  } as Props;
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex fixed top-0 z-10 w-full items-center shadow-md backdrop-filter backdrop-blur-lg  bg-opacity-30  lg:min-h-16 lg:px-[5%]">
      <div className="size-full lg:flex lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <MainLogo />
          <div className="flex items-center">
            <div className="p-4 lg:hidden">
              <ThemeSwitch />
            </div>
            <button
              className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={mobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={topLineVariants}
              />
              <motion.div
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={mobileMenuOpen ? "open" : "closed"}
                variants={middleLineVariants}
              />
              <motion.div
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={mobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={bottomLineVariants}
              />
            </button>
          </div>
        </div>
        <motion.div
          animate={mobileMenuOpen ? "open" : "close"}
          initial="close"
          variants={dropDownVariants}
          className="overflow-hidden px-[5%] lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          {links?.map((link, index) => (
            <div
              key={`${link.title}-${index}`}
              className="first:pt-4 lg:first:pt-0"
            >
              {link.subLinks && link.subLinks.length > 0 ? (
                <NavItemDropdown subLinks={link.subLinks} title={link.title} />
              ) : (
                <Link
                  href={link.url}
                  className="relative mx-auto block py-3 text-md ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 lg:px-4 lg:py-2 lg:text-base"
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
          <div className="hidden lg:block">
            <ThemeSwitch />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 lg:ml-4 lg:mt-0 lg:flex-row">
            {!isAuthenticated ? (
              <>
                <Link href={"/signup"}>
                  <Button className="w-full bg-white text-black" radius="none">
                    Sign Up
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button
                    className={`bg-primary-200 w-full dark:bg-primary-500 text-black dark:text-white`}
                    radius="none"
                  >
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button
                  radius="none"
                  className="bg-primary-200 dark:bg-primary-500 text-black dark:text-white"
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

const NavItemDropdown = ({
  title,
  subLinks,
}: {
  title: string;
  subLinks: LinkProps[];
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <nav
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button
        className="flex w-full items-center justify-between gap-2 py-3 text-left text-md ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 lg:flex-none lg:justify-start lg:px-4 lg:py-2 lg:text-base"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <AnimatePresence>
          <motion.div
            animate={dropdownOpen ? "rotated" : "initial"}
            variants={{
              rotated: { rotate: 180 },
              initial: { rotate: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <RxChevronDown className="size-4" />
          </motion.div>
        </AnimatePresence>
      </button>
      {dropdownOpen && (
        <AnimatePresence>
          <motion.ul
            animate={dropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                visibility: "visible",
                opacity: "var(--opacity-open, 100%)",
                y: 0,
              },
              close: {
                visibility: "hidden",
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
              },
            }}
            transition={{ duration: 0.3 }}
            className="bg-white lg:absolute lg:border lg:border-border-primary lg:p-2 lg:[--y-close:25%]"
          >
            {subLinks.map((subLink, index) => (
              <li
                key={`${subLink.title}-${index}`}
                className="relative mx-auto whitespace-nowrap py-3 pl-[5%] text-left align-top text-md lg:px-4 lg:py-2 lg:text-base"
              >
                <Link
                  href={subLink.url}
                  className="ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
                >
                  {subLink.title}
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </nav>
  );
};

export const NavbarDefaults: NavbarProps = {
  logo: {
    src: "/Logo_Black.png",
    alt: "Logo image",
  },
  links: [
    { title: "About Us", url: "#" },
    { title: "Careers", url: "#" },
    { title: "Contact Us", url: "#" },
  ],
  buttons: [
    {
      title: "Sign Up",
      variant: "secondary",
      size: "sm",
    },
    {
      title: "Login",
      size: "sm",
    },
  ],
};

Navbar.displayName = "Navbar";
