export default function Footer() {
  return (
    <>
      <footer className="footer bg-base-100 text-black p-20">
          <p>
            <span className="text-xl">
              Claros project group
              <br />
              A tool for collecting and analysing conflicting opinions.
            </span>
          
            <span>
              Copyright © {new Date().getFullYear()} - All rights reserved
            </span>
          </p>
        <nav aria-label="News Navigation">
          <p className="footer-title text-center">News</p>
          <a className="link link-hover text-center">Tool update</a>
          <a className="link link-hover text-center">New projects</a>
          <a className="link link-hover text-center">New publications</a>
        </nav>
        <nav aria-label="Contact Navigation">
          <p className="footer-title text-center">Contact us</p>
          <a className="link link-hover text-center">Email</a>
          <a className="link link-hover text-center">Address</a>
        </nav>
      </footer>
    </>
  );
}
