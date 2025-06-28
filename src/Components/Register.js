import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolLogo from "../Image/DelhiSchool.jpg";

/* ── reusable constants ──────────────────────────────── */
const PHONE_RX = /^[6-9]\d{9}$/;            // Indian 10-digit mobile
const EMAIL_RX =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    phone:    "",
    email:    "",
    gender:   ""
  });
  const navigate = useNavigate();

  /* generic controlled-input handler */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* on submit: validate, persist, navigate with state */
  const handleSubmit = e => {
    e.preventDefault();

    /* phone first */
    if (!PHONE_RX.test(form.phone)) {
      alert("Enter a valid 10-digit Indian mobile");
      return;
    }

    /* strict e-mail */
    if (!EMAIL_RX.test(form.email)) {
      alert("Enter a valid e-mail address (e.g. user.name@domain.co)");
      return;
    }

    /* store payload for later use */
    sessionStorage.setItem("otpUser", JSON.stringify(form));

    /* push to /otpverify, carrying the phone in location.state */
    navigate("/otpverify", { state: { mobileNumber: form.phone } });
    alert("Registration successful");
  };

  return (
    <section className="container-sm my-5">
      <div className="text-center my-4">
        <img
          src={schoolLogo}
          alt="Delhi Public School logo"
          className="img-fluid mb-3"
          style={{ maxWidth: "120px" }}
        />
        <h2 className="h4 fw-bold text-primary mb-2">
          Delhi Public School
        </h2>
        <p className="text-secondary lh-sm mb-4">
          Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br />
          Autadwadi Handewadi, Maharashtra 411060
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Register</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    name="username"
                    placeholder="Name"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="phone"
                    type="tel"
                    pattern="[6-9]\d{9}"
                    maxLength={10}
                    placeholder="Phone (10-digit)"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="email"
                    type="email"
                    pattern="^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$"
                    title="e.g. user.name@domain.co (max 64 chars before @, no consecutive dots)"
                    maxLength={254}
                    placeholder="email"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <select
                    name="gender"
                    className="form-select"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Already registered?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() =>
                    navigate("/otpverify", {
                      state: { mobileNumber: form.phone }
                    })
                  }
                >
                  Verify&nbsp;OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
