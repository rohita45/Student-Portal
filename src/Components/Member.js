import React from "react";
import { useNavigate } from "react-router-dom";
import schoolLogo from "../Image/DelhiSchool.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Member() {
  const navigate = useNavigate();
  const user     = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}");

  if (!user.username) {           // safety guard
    navigate("/", { replace: true });
    return null;
  }

  const prefix = user.gender === "Female" ? "Mrs." : "Mr.";

  return (
    <section className="container-sm my-5">
      <div className="text-center my-4">
        <img src={schoolLogo} alt="logo"
             className="img-fluid mb-3" style={{ maxWidth: 120 }} />
        <h2 className="h4 fw-bold text-primary mb-1">
          Welcome, {prefix} {user.username}
        </h2>
        <p className="text-muted mb-4">Delhi Public School, Pune</p>
      </div>

      <div className="btn-group w-100" role="group">
        <button className="btn btn-outline-primary"
                onClick={() => navigate("/familyDetail")}>
          Fill Family Form
        </button>
        {/* <button className="btn btn-outline-primary"
                onClick={() => navigate("/parent-links")}>
          Link Parents &nbsp;⇄&nbsp; Students
        </button> */}
      </div>
    </section>
  );
}
