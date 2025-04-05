import { ButtonMediumWide } from "../../../components/ui/Buttons";

export default function InfoSection() {
  return (
    <div>
      <div className="info-part  flex flex-col lg:flex-row-reverse items-center justify-center w-full">
        <div className="hero w-full h-full">
          <div className="hero-content flex-col lg:flex-row-reverse text-center justify-between lg:p-10">
            <img
              src="/assets/images/josh-withers-9h479w-syaQ-unsplash.jpg"
              className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-2xl object-cover sm:mt-6"
              alt="Beach Image"
            />
            <div className="lg:mr-10 sm:my-6">
              <p className="mb-4 text-light font-bold text-secondary">
                Opinion collection specialist
              </p>
              <h1 className="text-5xl font-bold text-secondary-content">
                A more detailed introduction to Claros. 
              </h1>
              <p className="py-6 text-secondary-content">
                Introduce who we are, what we do, and provide contact details.
              </p>
              <ButtonMediumWide>Contact our research team.</ButtonMediumWide>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
