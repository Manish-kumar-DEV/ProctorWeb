import { Footer } from "./components/Footer";
import { Header } from "./components/homepage/Header";
import { Header1 } from "./components/homepage/Header1";
import { Navbar } from "./components/Navbar";
import { FooterQuote } from "./components/homepage/FooterQuote";

import { Streamline } from "./components/homepage/Streamline";
import { WhyProctorWeb } from "./components/homepage/WhyProctorWeb";

export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <Header1 />
      <WhyProctorWeb />
      <Streamline />
      <FooterQuote />
      <Footer />
    </>
  );
}
