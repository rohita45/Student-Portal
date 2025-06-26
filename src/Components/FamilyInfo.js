// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import schoolLogo from "../Image/DelhiSchool.jpg";

// export default function FamilyInfo() {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("familyData");
//     if (!stored) { navigate("/family"); return; }
//     setData(JSON.parse(stored));
//   }, [navigate]);

//   if (!data) return null;

//   const { parents, children } = data;
//   const FEE_PER_STUDENT = 500;
//   const subTotal   = children.length * FEE_PER_STUDENT;
//   const gstAmount  = +(subTotal * 0.18).toFixed(2);
//   const grandTotal = subTotal + gstAmount;

//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4">Review Your Information</h2>
//             <div className="text-center my-4">
//               {/* Logo */}
//               <img
//                 src={schoolLogo}
//                 alt="Delhi Public School logo"
//                 className="img-fluid mb-3"
//                 style={{ maxWidth: "120px" }} // keep it tidy on small screens
//               />
      
//               {/* School name */}
//               <h2 className="h4 fw-bold text-primary mb-2">
//                 Delhi Public School
//               </h2>
      
//               {/* Address */}
//               <p className="text-secondary lh-sm mb-4">
//                 Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br />
//                 Autadwadi Handewadi, Maharashtra 411060
//               </p>
//             </div>

//       {/* Parents Table */}
//       <div className="table-responsive mb-4">
//         <table className="table table-bordered">
//           <thead className="table-primary">
//             <tr>
//               <th>#</th>
//               <th>Relation</th>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Email</th>
//               <th>Occupation</th>
//               <th>Birth Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parents.map((p, i) => (
//               <tr key={i}>
//                 <td>{i + 1}</td>
//                 <td>{p.relation}</td>
//                 <td>{p.first} {p.last}</td>
//                 <td>{p.phone}</td>
//                 <td>{p.email}</td>
//                 <td>{p.occupation}</td>
//                 <td>{p.birthDate}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Students Table */}
//       <div className="table-responsive mb-4">
//         <table className="table table-bordered table-striped">
//           <thead className="table-success">
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Grade</th>
//               <th>Class Division</th>
//               <th>Section</th>
//               <th>Birth Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {children.map((c, i) => (
//               <tr key={i}>
//                 <td>{i + 1}</td>
//                 <td>{c.first} {c.last}</td>
//                 <td>{c.grade}</td>
//                 <td>{c.classDiv || "-"}</td>
//                 <td>{c.section || "-"}</td>
//                 <td>{c.birthDate}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Payment Summary Table */}
//       <div className="table-responsive mb-4">
//         <table className="table table-bordered">
//           <thead className="table-info">
//             <tr>
//               <th colSpan={2}>Payment Summary</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <th>Students</th>
//               <td>{children.length}</td>
//             </tr>
//             <tr>
//               <th>Fee per Student</th>
//               <td>₹ {FEE_PER_STUDENT.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <th className="text-end">Sub‑Total</th>
//               <td>₹ {subTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <th className="text-end">GST @ 18 %</th>
//               <td>₹ {gstAmount.toFixed(2)}</td>
//             </tr>
//             <tr className="table-primary">
//               <th className="text-end">Grand Total</th>
//               <td><strong>₹ {grandTotal.toFixed(2)}</strong></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="text-end">
//         <button
//           className="btn btn-danger btn-lg"
//           onClick={() =>
//              alert(`Collect ₹${grandTotal.toFixed(2)} via Razorpay here`)}
//         >
//           Pay Now
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolLogo from "../Image/DelhiSchool.jpg";

export default function FamilyInfo() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  /* ──────────────────────────────────────────────── */
  /* Pull data or bounce back                        */
  useEffect(() => {
    const stored = sessionStorage.getItem("familyData");
    if (!stored) {
      navigate("/family");
      return;
    }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return null;
  const { parents, children } = data;

  /* ──────────────────────────────────────────────── */
  /* Fee maths                                        */
  const FEE_PER_STUDENT = 500;
  const subTotal   = children.length * FEE_PER_STUDENT;
  const gstAmount  = +(subTotal * 0.18).toFixed(2);
  const grandTotal = subTotal + gstAmount;

  /* ──────────────────────────────────────────────── */
  /* Handlers                                         */
  const handlePayClick = () => setShowPayModal(true);
  const handleClose    = () => setShowPayModal(false);
  const confirmPayment = () => {
    /* ■■■ Integrate Razorpay here if needed ■■■ */
    /* e.g. openRazorpay(grandTotal, onSuccess)     */
    setShowPayModal(false);
    navigate("/success", {
      state: { amount: grandTotal, students: children.length },
    });
  };

  return (
    <div className="container my-5">
      {/* ── Heading & Logo ────────────────────────── */}
      <div className="text-center my-4">
        <img
          src={schoolLogo}
          alt="Delhi Public School logo"
          className="img-fluid mb-3"
          style={{ maxWidth: "120px" }}
        />
        <h2 className="h4 fw-bold text-primary mb-2">Delhi Public School</h2>
        <p className="text-secondary lh-sm mb-4">
          Nyati Estate Rd, Nyati County, Mohammed Wadi, Pune,<br />
          Autadwadi Handewadi, Maharashtra 411060
        </p>
      </div>
      <h2 className="text-center mb-4">Review Your Information</h2>

      {/* ── Parents Table ─────────────────────────── */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th><th>Relation</th><th>Name</th><th>Phone</th>
              <th>Email</th><th>Occupation</th><th>Birth Date</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{p.relation}</td>
                <td>{p.first} {p.last}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.occupation}</td>
                <td>{p.birthDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Students Table ────────────────────────── */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-striped">
          <thead className="table-success">
            <tr>
              <th>#</th><th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Birth Date</th>
            </tr>
          </thead>
          <tbody>
            {children.map((c, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{c.first} {c.last}</td>
                <td>{c.classDiv || "-"}</td>
                <td>{c.section || "-"}</td>
                <td>{c.birthDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Payment Summary ───────────────────────── */}
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

      {/* ── Pay Now Button ────────────────────────── */}
      <div className="text-center">
        <button className="btn btn-danger btn-lg" onClick={handlePayClick}>
          Pay Now
        </button>
      </div>

      {/* ── Payment Detail Modal ───────────────────── */}
      <Modal show={showPayModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-2"><strong>Students :</strong> {children.length}</p>
          <p className="mb-2"><strong>Subtotal :</strong> ₹ {subTotal.toFixed(2)}</p>
          <p className="mb-2"><strong>GST (18 %) :</strong> ₹ {gstAmount.toFixed(2)}</p>
          <hr />
          <h5 className="text-end">Grand Total : ₹ {grandTotal.toFixed(2)}</h5>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="success" onClick={confirmPayment}>Confirm & Pay</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
