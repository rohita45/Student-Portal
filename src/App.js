// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Components/Register";
import OTPVerify from "./Components/OTPVerify";
import Member from "./Components/Member";
import FamilyDetail from "./Components/FamilyDetail";
import FamilyInfo from "./Components/FamilyInfo";
import Success from "./Components/Success";


export default function App() {
  const alreadyRegistered = () => sessionStorage.getItem("otpUser");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={alreadyRegistered() ? "/otpverify" : "/register"} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/otpverify" element={<OTPVerify />} />
        <Route path="/member" element={<Member/>}/>
        <Route path="/familyDetail" element={<FamilyDetail/>}/>
        <Route path="/familyInfo" element={<FamilyInfo/>}/>
        <Route path="/success" element={<Success/>}/>
      </Routes>
    </BrowserRouter>
  );
}



