export default function Card({ imgSrc, imgAlt, cardTitle, cardContent }) {
  return (
    <div className="card card-compact bg-base-300 w-full shadow-xl">
      <figure>
        <img src={imgSrc} alt={imgAlt} className="w-full h-60 object-cover" />
      </figure>
      <div className="card-body text-primary-content">
        <h2 className="card-title">{cardTitle}</h2>
        <p>{cardContent}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-secondary mt-4 text-primary-content">Find out more</button>
        </div>
      </div>
    </div>
  );
}
