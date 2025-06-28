// src/pages/FamilyForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolLogo from "../Image/DelhiSchool.jpg";

/* ─────── regex + helpers ─────── */
const PHONE_RX  = /^[6-9]\d{9}$/;
const EMAIL_RX  =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
const BLOOD_RX  = /^(A|B|AB|O)[+-]$/;
const BLOOD_OPTS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const TODAY_ISO = new Date().toISOString().split("T")[0];
const yearsBetween = (olderISO, youngerISO) =>
  (new Date(youngerISO) - new Date(olderISO)) / 31_557_600_000;

/* ─────── rule constants ─────── */
const MIN_PARENT_CHILD_GAP = 18;   // parents ≥ 18 yr older
const MIN_YEARS_PER_CLASS  = 1;    // 1 class ≈ 1 year

/* ─────── blank row factories ─────── */
const blankParent = () => ({
  first:"", last:"", relation:"Father",
  phone:"", email:"", occupation:"",
  birthDate:"", bloodGroup:"A+"
});
const blankChild = () => ({
  first:"", last:"", relation:"Son",   // NEW
  classDiv:"", section:"",
  birthDate:"", bloodGroup:"A+"
});

export default function FamilyForm() {
  const navigate = useNavigate();

  const [parents,  setParents ] = useState([
    blankParent(), { ...blankParent(), relation:"Mother" }
  ]);
  const [children, setChildren] = useState([ blankChild() ]);
  const [error,    setError   ] = useState("");

  const change = (setFn, i, k, v) =>
    setFn(arr => arr.map((row,idx)=>(idx===i?{...row,[k]:v}:row)));

  const addChild  = () => setChildren(c => [...c, blankChild()]);
  const resetForm = () => {
    setParents([ blankParent(), { ...blankParent(), relation:"Mother" } ]);
    setChildren([ blankChild() ]);
    setError("");
  };

  /* ─────── validation ─────── */
  const validate = () => {
    /* parents */
    for (const [i,p] of parents.entries()) {
      if (!p.first||!p.last||!p.phone||!p.email||!p.birthDate||!p.occupation)
        return `All fields are required for Parent ${i+1}`;
      if (!PHONE_RX.test(p.phone))  return `Invalid phone for Parent ${i+1}`;
      if (!EMAIL_RX.test(p.email))  return `Invalid e-mail for Parent ${i+1}`;
      if (!BLOOD_RX.test(p.bloodGroup))
        return `Invalid blood group for Parent ${i+1}`;
      if (new Date(p.birthDate) > new Date())
        return `Parent ${i+1} birth date cannot be in the future`;
      if (yearsBetween(p.birthDate,TODAY_ISO) < 18)
        return `Parent ${i+1} must be ≥ 18 years old`;
    }

    /* children */
    for (const [i,c] of children.entries()) {
      if (!c.first||!c.last||!c.relation||!c.classDiv||!c.section||!c.birthDate)
        return `All fields are required for Student ${i+1}`;
      if (!BLOOD_RX.test(c.bloodGroup))
        return `Invalid blood group for Student ${i+1}`;
      if (new Date(c.birthDate) > new Date())
        return `Student ${i+1} birth date cannot be in the future`;
    }

    /* parent ↔ child gap */
    for (const child of children) {
      for (const parent of parents) {
        if (yearsBetween(parent.birthDate,child.birthDate) < MIN_PARENT_CHILD_GAP)
          return `${parent.first||"Parent"} must be ≥ ${MIN_PARENT_CHILD_GAP} years older than ${child.first||"Student"}`;
      }
    }

    /* sibling gap by class */
    for (let i=0;i<children.length;i++){
      for (let j=i+1;j<children.length;j++){
        const A=children[i], B=children[j];
        const cA=parseInt(A.classDiv,10), cB=parseInt(B.classDiv,10);
        if (Number.isNaN(cA)||Number.isNaN(cB)||cA===cB) continue;

        const older = cA>cB?A:B, younger = cA>cB?B:A;
        const classDiff=Math.abs(cA-cB);
        const ageDiff=yearsBetween(older.birthDate,younger.birthDate);
        if (ageDiff < classDiff*MIN_YEARS_PER_CLASS){
          return `${older.first||"Student"} (Class ${Math.max(cA,cB)}) must be ≥ ${classDiff} year(s) older than ${younger.first||"Student"}`;
        }
      }
    }
    return "";
  };

  const handleSubmit = e =>{
    e.preventDefault();
    const msg=validate();
    if(msg){setError(msg);return;}
    setError("");
    sessionStorage.setItem("familyData",JSON.stringify({parents,children}));
    navigate("/familyInfo");
  };

  /* ─────── UI ─────── */
  return (
    <div className="container my-4">
      {/* header */}
      <div className="text-center my-4">
        <img src={schoolLogo} alt="Delhi Public School logo"
             className="img-fluid mb-3" style={{maxWidth:120}}/>
        <h2 className="h4 fw-bold text-primary mb-2">Delhi Public School</h2>
        <p className="text-secondary lh-sm mb-4">
          Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br/>
          Maharashtra 411060
        </p>
      </div>

      <h2 className="text-center mb-4">Family Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Parents */}
        <h4>Parents / Guardians</h4>
        {parents.map((p,idx)=>(
          <div key={idx} className="border rounded p-3 mb-3">
            <h6>{idx===0?"First Parent":"Second Parent"}</h6>
            <div className="row g-3">
              {/* names */}
              <div className="col-md-3">
                <label className="form-label">First Name</label>
                <input className="form-control" value={p.first}
                       onChange={e=>change(setParents,idx,"first",e.target.value)}
                       required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={p.last}
                       onChange={e=>change(setParents,idx,"last",e.target.value)}
                       required/>
              </div>
              {/* relation */}
              <div className="col-md-3">
                <label className="form-label">Relation</label>
                <select className="form-select" value={p.relation}
                        onChange={e=>change(setParents,idx,"relation",e.target.value)} required>
                  <option>Father</option><option>Mother</option><option>Guardian</option>
                </select>
              </div>
              {/* birth date */}
              <div className="col-md-3">
                <label className="form-label">Birth Date</label>
                <input type="date" className="form-control" max={TODAY_ISO}
                       value={p.birthDate}
                       onChange={e=>change(setParents,idx,"birthDate",e.target.value)}
                       required/>
              </div>

              {/* contact */}
              <div className="col-md-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" pattern={PHONE_RX.source}
                       value={p.phone}
                       onChange={e=>change(setParents,idx,"phone",e.target.value)}
                       required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" pattern={EMAIL_RX.source}
                       value={p.email}
                       onChange={e=>change(setParents,idx,"email",e.target.value)}
                       required/>
              </div>
              {/* blood */}
              <div className="col-md-2">
                <label className="form-label">Blood Group</label>
                <select className="form-select" value={p.bloodGroup}
                        onChange={e=>change(setParents,idx,"bloodGroup",e.target.value)} required>
                  {BLOOD_OPTS.map(bg=><option key={bg}>{bg}</option>)}
                </select>
              </div>
              {/* occupation */}
              <div className="col-md-4">
                <label className="form-label">Occupation</label>
                <input className="form-control" value={p.occupation}
                       onChange={e=>change(setParents,idx,"occupation",e.target.value)}
                       required/>
              </div>
            </div>
          </div>
        ))}

        {/* Children */}
        <h4 className="mt-4">Children / Students</h4>
        {children.map((c,idx)=>(
          <div key={idx} className="border rounded p-3 mb-3">
            <h6>Student {idx+1}</h6>
            <div className="row g-3">
              {/* names */}
              <div className="col-md-3">
                <label className="form-label">First Name</label>
                <input className="form-control" value={c.first}
                       onChange={e=>change(setChildren,idx,"first",e.target.value)}
                       required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={c.last}
                       onChange={e=>change(setChildren,idx,"last",e.target.value)}
                       required/>
              </div>
              {/* relation */}
              <div className="col-md-3">
                <label className="form-label">Relation</label>
                <select className="form-select" value={c.relation}
                        onChange={e=>change(setChildren,idx,"relation",e.target.value)} required>
                  <option>Son</option><option>Daughter</option><option>Other</option>
                </select>
              </div>
              {/* class & section */}
              <div className="col-md-3">
                <label className="form-label">Class</label>
                <input className="form-control" value={c.classDiv}
                       onChange={e=>change(setChildren,idx,"classDiv",e.target.value)}
                       required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">Sec.</label>
                <input className="form-control" value={c.section}
                       onChange={e=>change(setChildren,idx,"section",e.target.value)}
                       required/>
              </div>
              {/* birth date */}
              <div className="col-md-3">
                <label className="form-label">Birth Date</label>
                <input type="date" className="form-control" max={TODAY_ISO}
                       value={c.birthDate}
                       onChange={e=>change(setChildren,idx,"birthDate",e.target.value)}
                       required/>
              </div>
              {/* blood */}
              <div className="col-md-3">
                <label className="form-label">Blood Group</label>
                <select className="form-select" value={c.bloodGroup}
                        onChange={e=>change(setChildren,idx,"bloodGroup",e.target.value)} required>
                  {BLOOD_OPTS.map(bg=><option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* buttons */}
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
