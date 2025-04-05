export default function Toast({ children }) {
  return (
    <div className="toast">
      <div className="alert alert-info">
        <span>{children}</span>
      </div>
    </div>
  );
}
