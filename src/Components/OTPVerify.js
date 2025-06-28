import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { generateOTP } from "../utils/generateOtp";
import schoolLogo from "../Image/DelhiSchool.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

/* reusable constants */
const PHONE_RX = /^[1-9]\d{9}$/;        // 10-digit Indian mobile

export default function OTPVerify() {
  const location  = useLocation();
  const navigate  = useNavigate();

  /* phone captured on /register (if any) */
  const registeredPhone =
    JSON.parse(sessionStorage.getItem("otpUser") || "{}").phone ||   // survives reload :contentReference[oaicite:1]{index=1}
    location.state?.mobileNumber ||                                  // passed via router state :contentReference[oaicite:2]{index=2}
    "";

  /* component state */
  const [mobile, setMobile]         = useState(registeredPhone);
  const [isMatched, setMatched]     = useState(!!registeredPhone);   // auto path?
  const [otp, setOtp]               = useState("");
  const [sentOtp, setSentOtp]       = useState("");
  const [timer, setTimer]           = useState(0);
  const [resendsLeft, setResendsLeft] = useState(3);
  const [triesLeft, setTriesLeft]     = useState(3);
  const firstSendDone               = useRef(false);                 // Strict-Mode guard :contentReference[oaicite:3]{index=3}

  /* auto-send exactly once when phone already known */
  useEffect(() => {
    if (!isMatched || firstSendDone.current) return;
    sendOtp();
    firstSendDone.current = true;
  }, [isMatched]);

  /* 1-second countdown tick */
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);        // classic timer :contentReference[oaicite:4]{index=4}
    return () => clearInterval(id);
  }, [timer]);

  /* --- helpers --- */
  const sendOtp = () => {
    const code = generateOTP();                                      // random 6-digit helper :contentReference[oaicite:5]{index=5}
    setSentOtp(code);
    setTimer(45);
    alert(`Demo OTP: ${code}`);      // swap for real SMS API
  };

  const handleCheckMobile = () => {
    /* 1️⃣ basic format check */
    if (!PHONE_RX.test(mobile)) {
      alert("Enter a valid 10-digit Indian mobile.");
      return;
    }

    /* 2️⃣ phone was supplied by /register → must match exactly */
    if (registeredPhone && mobile !== registeredPhone) {
      alert("This number does not match the one you registered with.");
      return;
    }

    /* 3️⃣ no registered phone? ask user to register first */
    if (!registeredPhone) {
      alert("No registration found for this tab. Please register first.");
      return;
    }

    /* all good → mark matched & send OTP */
    setMatched(true);
    sendOtp();
  };

  const handleVerify = () => {
    if (otp === sentOtp) {
      // alert("✅ Verified!");
      // sessionStorage.removeItem("otpUser");
      // navigate("/familyDetail");
      const user = JSON.parse(sessionStorage.getItem("otpUser") || "{}");
     sessionStorage.setItem("loggedInUser", JSON.stringify(user)); // reuse later
     sessionStorage.removeItem("otpUser");                         // tidy up
     alert("✅ Verified!");
     navigate("/member", { replace: true });
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

  /* --- UI --- */
  return (
    <div className="container-sm my-5">
      {/* header */}
      <div className="text-center my-4">
        <img src={schoolLogo} alt="Delhi Public School logo"
             className="img-fluid mb-3" style={{ maxWidth: "120px" }} />
        <h2 className="h4 fw-bold text-primary mb-2">Delhi Public School</h2>
        <p className="text-secondary lh-sm mb-4">
          Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br />
          Autadwadi Handewadi, Maharashtra 411060
        </p>
      </div>

      {/* card */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-3">Verify OTP</h2>

              {/* phone entry (shown only when no match yet) */}
              {!isMatched && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Registered Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"     /* Bootstrap styling :contentReference[oaicite:6]{index=6} */
                      maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      placeholder="10-digit number"
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleCheckMobile}
                    disabled={mobile.length !== 10}
                  >
                    Send OTP
                  </button>
                </>
              )}

              {/* OTP area */}
              {isMatched && (
                <>
                  <div className="mb-4 text-center">
                    <p className="mb-1">OTP sent to:</p>
                    <span className="fw-bold">{mobile}</span>
                  </div>

                  <div className="mb-3 text-center">
                    <label className="form-label">Enter OTP</label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      isInputNum
                      shouldAutoFocus
                      renderInput={(inputProps, idx) => (
                        <input
                          {...inputProps}
                          key={idx}
                          className="form-control text-center mx-1 fs-4"
                          style={{ width: "3rem" }}
                        />
                      )}
                    />                                        {/* react-otp-input :contentReference[oaicite:7]{index=7} */}
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
                    <p className="text-muted mb-0">Tries left: {triesLeft}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
