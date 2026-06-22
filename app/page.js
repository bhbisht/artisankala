import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        <Card
          title="Handloom Products"
          description="Discover traditional handwoven products."
        />

        <Card
          title="Handicraft Marketplace"
          description="Connect artisans with customers."
        />
      </div>

      <Footer />
    </>
  );
}