// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolLogo from "../Image/DelhiSchool.jpg";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    phone:    "",
    age:      "",
    email:    "",
    gender:   ""
  });

  const navigate = useNavigate();

  /* generic controlled-input handler */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* on submit: validate, persist, navigate with state */
  const handleSubmit = e => {
    alert("Registration Successful")
    e.preventDefault();
    const indianPattern = /^[6-9]\d{9}$/;           // 10-digit, starts 6-9
    if (!indianPattern.test(form.phone)) {
      alert("Enter a valid 10-digit Indian mobile");
      return;
    }

    /* 1️⃣  store the entire payload for later use */
    sessionStorage.setItem("otpUser", JSON.stringify(form));

    /* 2️⃣  push to /otpverify, carrying the phone in location.state */
    navigate("/otpverify", { state: { mobileNumber: form.phone } });
  };

  return (
    <section className="container-sm my-5">
      <div className="text-center my-4">
        {/* Logo */}
        <img
          src={schoolLogo}
          alt="Delhi Public School logo"
          className="img-fluid mb-3"
          style={{ maxWidth: "120px" }} // keep it tidy on small screens
        />

        {/* School name */}
        <h2 className="h4 fw-bold text-primary mb-2">
          Delhi Public School
        </h2>

        {/* Address */}
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
                    pattern="^[6-9]\d{9}$"
                    placeholder="Phone (10-digit)"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="age"
                    type="number"
                    min="3"
                    placeholder="Age"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
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
                    <option>Other</option>
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
                  /* still pass the phone if it’s been typed already */
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
