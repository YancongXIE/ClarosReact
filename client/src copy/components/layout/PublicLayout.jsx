import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />;
    </>
  );
}
