import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Toast from "../../components/ui/Toasts";
import HeroSection from "../../sections/public-sections/landing-page/HeroSection";
import InfoSection from "../../sections/public-sections/landing-page/InfoSection";
import ServicesSection from "../../sections/public-sections/landing-page/ServicesSection";

export default function LandingPage() {
  const { showLogoutToast } = useContext(AuthContext);

  return (
    <div>
      <HeroSection />
      <InfoSection />
      <ServicesSection />
      {showLogoutToast && <Toast>Successfully logged out</Toast>}
    </div>
  );
}
