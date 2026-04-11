import "./Loader.css";

function Loader() {
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <p className="loader__text">Loading...</p>
    </div>
  );
}

export default Loader;