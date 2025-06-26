import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";           // v3 API requires renderInput
import { generateOTP } from "../utils/generateOtp";
import schoolLogo from "../Image/DelhiSchool.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OTPVerify() {
  const location  = useLocation();
  const navigate  = useNavigate();

  /* mobile number saved during registration */
  const registeredNo =
    JSON.parse(sessionStorage.getItem("otpUser") || "{}").phone ||
    location.state?.mobileNumber ||
    "";

  /* --------------- state --------------- */
  const [mobile, setMobile]           = useState("");
  const [isMatched, setMatched]       = useState(false);

  const [otp, setOtp]                 = useState("");
  const [sentOtp, setSentOtp]         = useState("");
  const [timer, setTimer]             = useState(0);     // 45-second countdown
  const [resendsLeft, setResendsLeft] = useState(3);
  const [triesLeft, setTriesLeft]     = useState(3);

  /* --------------- ticking clock --------------- */
  useEffect(() => {
    if (!isMatched || timer === 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);                      // cleanup interval
  }, [isMatched, timer]);

  /* --------------- helpers --------------- */
  const sendOtp = () => {
    const code = generateOTP();
    setSentOtp(code);
    setTimer(45);
    alert(`Demo OTP: ${code}`);                          // swap for SMS API
  };

  const handleCheckMobile = () => {
    if (mobile !== registeredNo) {
      alert("Mobile number not found – use the one from registration.");
      return;
    }
    setMatched(true);
    sendOtp();
  };

  const handleVerify = () => {
    if (otp === sentOtp) {
      alert("✅ Verified!");
      sessionStorage.removeItem("otpUser");
      navigate("/familyDetail");
      return;
    }
    const left = triesLeft - 1;
    setTriesLeft(left);
    setOtp("");
    if (left === 0) {
      alert("❌ Too many wrong attempts. Start again.");
      window.location.reload();
    } else {
      alert(`Incorrect code – ${left} attempt(s) left.`);
    }
  };

  const handleResend = () => {
    if (resendsLeft === 0) return;
    sendOtp();
    setResendsLeft(r => r - 1);
  };

  /* --------------- UI --------------- */
  return (
    <div className="container-sm my-5">
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
              <h2 className="card-title text-center mb-1">Delhi Public School</h2>
              <p className="small text-muted text-center mb-4">
                Nyati Estate Rd., Mohammed Wadi, Pune 411060
              </p>

              {/* phone field */}
              <div className="mb-3">
                <label className="form-label">Registered Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  maxLength={10}
                  pattern="^[6-9]\\d{9}$"                  /* India mobile pattern */
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  disabled={isMatched}
                />
              </div>

              {!isMatched && (
                <button
                  className="btn btn-primary w-100 mb-4"
                  onClick={handleCheckMobile}
                  disabled={mobile.length !== 10}
                >
                  Send OTP
                </button>
              )}

              {/* OTP area stays hidden until phone matches */}
              {isMatched && (
                <>
                  <div className="mb-3 text-center">
                    <label className="form-label">Enter OTP</label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      isInputNum
                      shouldAutoFocus
                      /* v3: render each box yourself */
                      renderInput={(inputProps, idx) => (
                        <input
                          {...inputProps}
                          key={idx}
                          className="form-control text-center mx-1 fs-4"
                          style={{ width: "3rem" }}
                        />
                      )}
                    />
                  </div>

                  <button
                    className="btn btn-success w-100 mb-3"
                    onClick={handleVerify}
                    disabled={otp.length !== 6}
                  >
                    Validate OTP
                  </button>

                  <div className="text-center small">
                    {timer > 0 ? (
                      <p className="mb-1">Resend in {timer}s</p>
                    ) : (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleResend}
                        disabled={resendsLeft === 0}
                      >
                        {resendsLeft > 0
                          ? `Resend OTP (${resendsLeft} left)`
                          : "No resends left"}
                      </button>
                    )}
                    <p className="text-muted mb-0">
                      Tries left: {triesLeft}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

