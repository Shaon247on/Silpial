import Designed from "@/components/landing/Designed";
import Documents from "@/components/landing/Documents";
import Hero from "@/components/landing/Hero";
import Improve from "@/components/landing/Improve";
import Safe from "@/components/landing/Safe";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Documents/>
      <Designed/>
      <Safe/>
      <Improve/>
    </div>
  );
}
