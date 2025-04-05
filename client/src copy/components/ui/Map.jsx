export default function Map({ location }) {
  return (
    <div className="w-full max-w-md lg:max-w-lg">
      <iframe
        width="100%"
        height={300}
        className="rounded-md shadow-md"
        style={{ border: 0, maxWidth: "600px" }}
        loading="lazy"
        allowfullscreen
        src={`https://www.google.com/maps?q=${
          location === "Whitsunday" ? "Whitsundays" : location
        }&output=embed`}
        aria-label={`Map showing the location of ${
          location === "Whitsunday" ? "Whitsundays" : location
        }`}
      ></iframe>
    </div>
  );
}
