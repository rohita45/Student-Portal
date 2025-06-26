// src/pages/FamilyForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import schoolLogo from "../Image/DelhiSchool.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FamilyForm() {
    const navigate = useNavigate();

  /* ---------- state ---------- */
  const [parents, setParents] = useState([
    {
      first: "", last: "", relation: "Father", phone: "",
      email: "", occupation: "", birthDate: ""
    },
    {
      first: "", last: "", relation: "Mother", phone: "",
      email: "", occupation: "", birthDate: ""
    }
  ]);

  const [children, setChildren] = useState([
    { first: "", last: "", classDiv: "", section: "", birthDate: "" }
  ]);

  /* ---------- helpers ---------- */
  const change = (set, i, k, v) =>
    set(arr => arr.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const addChild = () =>
    setChildren(c => [
      ...c,
      { first: "", last: "", classDiv: "", section: "", birthDate: "" }
    ]);

  const resetForm = () => {
    setParents([
      { first: "", last: "", relation: "Mother", phone: "", email: "", occupation: "", birthDate: "" },
      { first: "", last: "", relation: "Father", phone: "", email: "", occupation: "", birthDate: "" },
    ]);
    setChildren([{ first: "", last: "", grade: "", classDiv: "", section: "", birthDate: "" }]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { parents, children };
    sessionStorage.setItem("familyData", JSON.stringify(payload));
    navigate("/familyInfo");          // <── go to the new page
  };

  /* ---------- UI ---------- */
  return (
    <div className="container my-4">
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
      <h2 className="text-center mb-4">Fill Details</h2>

      <form onSubmit={handleSubmit}>
        {/* === Parents === */}
        <h4>Parents / Guardians</h4>
        {parents.map((p, idx) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <h6>{idx === 0 ? "First Parent" : "Second Parent"}</h6>

            <div className="row g-3">
              {/* First Name */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-first`} className="form-label">First Name</label>
                <input id={`p${idx}-first`} className="form-control"
                  value={p.first} onChange={e => change(setParents, idx, "first", e.target.value)} required />
              </div>

              {/* Last Name */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-last`} className="form-label">Last Name</label>
                <input id={`p${idx}-last`} className="form-control"
                  value={p.last} onChange={e => change(setParents, idx, "last", e.target.value)} required />
              </div>

              {/* Relation */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-rel`} className="form-label">Relation</label>
                <select id={`p${idx}-rel`} className="form-select"
                  value={p.relation} onChange={e => change(setParents, idx, "relation", e.target.value)} required>
                  <option>Mother</option><option>Father</option><option>Guardian</option>
                </select>
              </div>

              {/* Birth Date */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-dob`} className="form-label">Birth&nbsp;Date</label>
                <input id={`p${idx}-dob`} type="date" className="form-control"
                  value={p.birthDate} onChange={e => change(setParents, idx, "birthDate", e.target.value)} required />
              </div>

              {/* Phone */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-phone`} className="form-label">Phone</label>
                <input id={`p${idx}-phone`} type="tel" className="form-control"
                  value={p.phone} onChange={e => change(setParents, idx, "phone", e.target.value)} required />
              </div>

              {/* Email */}
              <div className="col-md-3">
                <label htmlFor={`p${idx}-email`} className="form-label">Email</label>
                <input id={`p${idx}-email`} type="email" className="form-control"
                  value={p.email} onChange={e => change(setParents, idx, "email", e.target.value)} required />
              </div>

              {/* Occupation */}
              <div className="col-md-6">
                <label htmlFor={`p${idx}-occ`} className="form-label">Occupation</label>
                <input id={`p${idx}-occ`} className="form-control"
                  value={p.occupation} onChange={e => change(setParents, idx, "occupation", e.target.value)} required />
              </div>
            </div>
          </div>
        ))}

        {/* === Children === */}
        <h4 className="mt-4">Children / Students</h4>
        {children.map((c, idx) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <h6>Student&nbsp;{idx + 1}</h6>

            <div className="row g-3">
              {/* First Name */}
              <div className="col-md-3">
                <label htmlFor={`c${idx}-first`} className="form-label">First Name</label>
                <input id={`c${idx}-first`} className="form-control"
                  value={c.first} onChange={e => change(setChildren, idx, "first", e.target.value)} required />
              </div>

              {/* Last Name */}
              <div className="col-md-3">
                <label htmlFor={`c${idx}-last`} className="form-label">Last Name</label>
                <input id={`c${idx}-last`} className="form-control"
                  value={c.last} onChange={e => change(setChildren, idx, "last", e.target.value)} required />
              </div>
              
              {/* Class Division */}
              <div className="col-md-2">
                <label htmlFor={`c${idx}-div`} className="form-label">Class</label>
                <input id={`c${idx}-div`} className="form-control"
                  value={c.classDiv} onChange={e => change(setChildren, idx, "classDiv", e.target.value)} required />
              </div>

              {/* Section */}
              <div className="col-md-2">
                <label htmlFor={`c${idx}-sec`} className="form-label">Section</label>
                <input id={`c${idx}-sec`} className="form-control"
                  value={c.section} onChange={e => change(setChildren, idx, "section", e.target.value)} required />
              </div>

              {/* Birth Date */}
              <div className="col-md-3">
                <label htmlFor={`c${idx}-dob`} className="form-label">Birth&nbsp;Date</label>
                <input id={`c${idx}-dob`} type="date" className="form-control"
                  value={c.birthDate} onChange={e => change(setChildren, idx, "birthDate", e.target.value)} required />
              </div>
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="d-flex gap-3">
          <button type="button" className="btn btn-outline-secondary" onClick={addChild}>
            Add Child
          </button>
          <button type="button" className="btn btn-outline-warning" onClick={resetForm}>
            Reset
          </button>
          <button type="submit" className="btn btn-primary ms-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
