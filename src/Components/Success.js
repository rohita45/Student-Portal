import { useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Success() {
  const { state } = useLocation();
  const amount   = state?.amount   ?? 0;
  const students = state?.students ?? 0;

  return (
    <div className="container text-center mt-5">
      <div className="success">
        <img
          src="https://em-content.zobj.net/source/microsoft-teams/363/thumbs-up_1f44d.png"
          alt="Thumbs up"
        />
      </div>
      <h1 className="display-5 text-success mb-3">Registration Successful!</h1>
      <p className="lead">
        Thank you for paying ₹{amount.toFixed(2)} for {students} student
        {students !== 1 && "s"}.
      </p>
      <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
    </div>
  );
}

