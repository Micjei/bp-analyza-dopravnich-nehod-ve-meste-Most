import Map from "../components/Map";
import WelcomePopup from "@/components/WelcomePopup";
export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Map />
      <WelcomePopup />
    </div>
  );
}
