import HomeClient from "../components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tristan Budd - Home",
};

export default function Home() {
  return <HomeClient />;
}
