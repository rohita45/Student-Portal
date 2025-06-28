// src/pages/FamilyInfo.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolLogo from "../Image/DelhiSchool.jpg";

export default function FamilyInfo() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("familyData");
    if (!stored) { navigate("/"); return; }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return null;
  const { parents, children } = data;

  /* ---------- payment calc ---------- */
  const FEE_PER_STUDENT = 500;
  const subTotal   = children.length * FEE_PER_STUDENT;
  const gstAmount  = +(subTotal * 0.18).toFixed(2);
  const grandTotal = subTotal + gstAmount;

  /* ---------- modal handlers ---------- */
  const handlePayClick  = () => setShowPayModal(true);
  const handleClose     = () => setShowPayModal(false);
  const confirmPayment  = () => {
    setShowPayModal(false);
    navigate("/success", { state: { amount: grandTotal, students: children.length } });
  };

  return (
    <div className="container my-5">
      {/* Heading */}
      <div className="text-center my-4">
        <img src={schoolLogo} alt="Delhi Public School logo"
             className="img-fluid mb-3" style={{ maxWidth:120 }} />
        <h2 className="h4 fw-bold text-primary mb-2">Delhi Public School</h2>
        <p className="text-secondary lh-sm mb-4">
          Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br/>
          Maharashtra 411060
        </p>
      </div>

      <h2 className="text-center mb-4">Review Your Information</h2>

      {/* Parents table */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th><th>Relation</th><th>Name</th><th>Phone</th>
              <th>Email</th><th>Occupation</th><th>Birth Date</th>
              <th>Blood Group</th>{/* NEW */}
            </tr>
          </thead>
          <tbody>
            {parents.map((p,i)=>(
              <tr key={i}>
                <td>{i+1}</td>
                <td>{p.relation}</td>
                <td>{p.first} {p.last}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.occupation}</td>
                <td>{p.birthDate}</td>
                <td>{p.bloodGroup}</td>{/* NEW */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Students table */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-striped">
          <thead className="table-success">
            <tr>
              <th>#</th><th>Name</th><th>Relation</th>{/* NEW */}
              <th>Class</th><th>Section</th><th>Birth Date</th>
              <th>Blood Group</th>{/* NEW */}
            </tr>
          </thead>
          <tbody>
            {children.map((c,i)=>(
              <tr key={i}>
                <td>{i+1}</td>
                <td>{c.first} {c.last}</td>
                <td>{c.relation}</td>{/* NEW */}
                <td>{c.classDiv || "-"}</td>
                <td>{c.section  || "-"}</td>
                <td>{c.birthDate}</td>
                <td>{c.bloodGroup}</td>{/* NEW */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment summary */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead className="table-info">
            <tr><th colSpan={2}>Payment Summary</th></tr>
          </thead>
          <tbody>
            <tr><th>Students</th><td>{children.length}</td></tr>
            <tr><th>Fee per Student</th><td>₹ {FEE_PER_STUDENT.toFixed(2)}</td></tr>
            <tr><th className="text-end">Sub-Total</th><td>₹ {subTotal.toFixed(2)}</td></tr>
            <tr><th className="text-end">GST @ 18 %</th><td>₹ {gstAmount.toFixed(2)}</td></tr>
            <tr className="table-primary">
              <th className="text-end">Grand Total</th>
              <td><strong>₹ {grandTotal.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pay Now button */}
      <div className="text-center">
        <button className="btn btn-danger btn-lg" onClick={handlePayClick}>
          Pay Now
        </button>
      </div>

      {/* Payment modal */}
      <Modal show={showPayModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Students:</strong> {children.length}</p>
          <p><strong>Subtotal:</strong> ₹ {subTotal.toFixed(2)}</p>
          <p><strong>GST (18 %):</strong> ₹ {gstAmount.toFixed(2)}</p>
          <hr/>
          <h5 className="text-end">Grand Total: ₹ {grandTotal.toFixed(2)}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="success" onClick={confirmPayment}>Confirm & Pay</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
