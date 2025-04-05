export default function Guide() {
  return (
    <div className="relative" tabIndex={0}>
      <div className="ml-12 mt-6">
        <h1 className="text-primary text-primary-content font-bold text-4xl">
          How to use the app: A Quick Guide 🤓
        </h1>
      </div>
      <div className="flex">
        <div className="m-12 flex-1 pr-10">
          <p className="text-xl text-primary-content">
            A short introduction to the app.
          </p>
          <h1 className="text-3xl font-semibold text-primary-content mt-10" id="adr">
            About the ranking app
          </h1>
          <p className="mt-3 text-primary-content">
            {" "}
            Introduce how to use the ranking app
          </p>
          <h1 className="text-3xl font-semibold text-primary-content mt-4" id="adr">
            About the dashboard
          </h1>
          <p className="mt-3 text-primary-content">
            {" "}
            Introduce how to use the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
