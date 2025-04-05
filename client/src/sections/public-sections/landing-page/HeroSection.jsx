import { ButtonMediumWide } from "../../../components/ui/Buttons";

export default function HeroSection() {
  return (
    <div>
      <div className="hero bg-base-300 min-h-[60vh] z-auto">
        <div className="hero-content text-primary-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-6xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold">
              Claros project
            </h1>
            <p className="py-6">
              Claros tool helps collect conflicting opionins and analze these opinions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
