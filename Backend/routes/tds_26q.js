// POST /api/tds24q/create
const express = require("express");
const router = express.Router();
const db = require("../db"); // assumes you have mysql2 setup


// Utility to insert multiple challans or deductees
async function insertMultiple(table, returnId, dataArray, fields) {
  if (!dataArray.length) return;
  const placeholders = dataArray.map(() => `(${new Array(fields.length).fill("?").join(",")})`).join(",");
  const values = dataArray.flatMap(data => fields.map(f => data[f]));
  
  const sql = `INSERT INTO ${table} (return_id, ${fields.join(",")}) VALUES ${placeholders}`;
  await db.query(sql, [returnId, ...values]);
}

// POST: create a new Form 26Q return with data
router.post("/api/tds26q", async (req, res) => {
  const {
    deductorDetails,
    challanDetails,
    deducteeDetails,
    verification,
    assessmentYear,
  } = req.body;

  try {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert returns main info
      const [result] = await conn.query(
        `INSERT INTO tds_26q_returns (
          tan, assessment_year, pan_of_deductor, deductor_category, deductor_name, branch_serial_no,
          deductor_flat_no, deductor_premises_name, deductor_road_street, deductor_area, deductor_town_city, deductor_state,
          deductor_country, deductor_pin_code, deductor_std_code, deductor_telephone, deductor_email,
          resp_status, resp_designation, resp_name, resp_father_name, resp_pan,
          verification_capacity, verification_place, verification_date, verification_full_name, verification_designation, verification_signature
        ) VALUES (?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )`,
        [
          deductorDetails.tan,
          assessmentYear,
          deductorDetails.panOfDeductor,
          deductorDetails.category,
          deductorDetails.deductorName,
          deductorDetails.branchSrlNo || null,
          deductorDetails.address.flatNo,
          deductorDetails.address.premisesName,
          deductorDetails.address.roadStreet,
          deductorDetails.address.area,
          deductorDetails.address.town,
          deductorDetails.address.state,
          deductorDetails.address.country,
          deductorDetails.address.pinCode,
          deductorDetails.stdCodeNo,
          deductorDetails.telephoneNo,
          deductorDetails.email,
          deductorDetails.responsiblePerson.status,
          deductorDetails.responsiblePerson.designation,
          deductorDetails.responsiblePerson.name,
          deductorDetails.responsiblePerson.fatherName,
          deductorDetails.responsiblePerson.pan,
          verification.capacity,
          verification.declarationPlace,
          verification.declarationDate,
          verification.fullName,
          verification.designation,
          verification.signature
        ]
      );

      const returnId = result.insertId;

      // 2. Insert challan details
      if (challanDetails && challanDetails.length) {
        const challanFields = [
          "serial_no", "bsr_code", "date_of_deposit", "challan_serial_no", "tax", "surcharge", "education_cess",
          "other_charges", "interest", "penalty", "fee", "total_amount", "transfer_voucher_no", "status"
        ];
        const challanData = challanDetails.map((ch, index) => ({
          serial_no: ch.serialNo || index + 1,
          bsr_code: ch.bsrCode,
          date_of_deposit: ch.dateOfDeposit,
          challan_serial_no: ch.challanSerialNo,
          tax: ch.tax || 0,
          surcharge: ch.surcharge || 0,
          education_cess: ch.educationCess || 0,
          other_charges: ch.other || 0,
          interest: ch.interest || 0,
          penalty: ch.penalty || 0,
          fee: ch.fee || 0,
          total_amount: ch.total || 0,
          transfer_voucher_no: ch.transferVoucherNo || null,
          status: ch.status || "Deposited"
        }));

        const placeholders = challanDetails.map(() => 
          "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");

        const values = challanData.flatMap(ch => [
          returnId,
          ch.serial_no,
          ch.bsr_code,
          ch.date_of_deposit,
          ch.challan_serial_no,
          ch.tax,
          ch.surcharge,
          ch.education_cess,
          ch.other_charges,
          ch.interest,
          ch.penalty,
          ch.fee,
          ch.total_amount,
          ch.transfer_voucher_no,
          ch.status
        ]);

        const insertChallansSql = `
          INSERT INTO tds_26q_challans (
            return_id, serial_no, bsr_code, date_of_deposit, challan_serial_no, tax, surcharge, education_cess,
            other_charges, interest, penalty, fee, total_amount, transfer_voucher_no, status
          ) VALUES ${placeholders}
        `;
        await conn.query(insertChallansSql, values);
      }

      // 3. Insert deductee details
      if (deducteeDetails && deducteeDetails.length) {
        const deducteeFields = [
          "serial_no", "pan_of_deductee", "name_of_deductee", "amount_paid", "tax_deducted", "tax_deposited",
          "date_of_payment", "nature_of_payment", "section_deducted", "rate_of_deduction", "certificate_no", "date_of_certificate",
          "amount_paid_credited", "gst_no", "remark_code"
        ];
        const deducteeData = deducteeDetails.map((de, index) => ({
          serial_no: de.serialNo || index + 1,
          pan_of_deductee: de.panOfDeductee,
          name_of_deductee: de.nameOfDeductee,
          amount_paid: de.amountPaid || 0,
          tax_deducted: de.amountOfTax || 0,
          tax_deposited: de.taxDeposited || 0,
          date_of_payment: de.dateOfPayment,
          nature_of_payment: de.natureOfPayment || null,
          section_deducted: de.sectionUnderDeducted,
          rate_of_deduction: de.rateOfDeduction || 0,
          certificate_no: de.certSerialNo || null,
          date_of_certificate: de.dateOfTDSCertificate || null,
          amount_paid_credited: de.amountPaidCredited || 0,
          gst_no: de.gstIdentificationNo || null,
          remark_code: de.remarkCode || null,
        }));

        const placeholders = deducteeDetails.map(() =>
          "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");

        const values = deducteeData.flatMap(dd => [
          returnId,
          dd.serial_no,
          dd.pan_of_deductee,
          dd.name_of_deductee,
          dd.amount_paid,
          dd.tax_deducted,
          dd.tax_deposited,
          dd.date_of_payment,
          dd.nature_of_payment,
          dd.section_deducted,
          dd.rate_of_deduction,
          dd.certificate_no,
          dd.date_of_certificate,
          dd.amount_paid_credited,
          dd.gst_no,
          dd.remark_code
        ]);

        const insertDeducteesSql = `
          INSERT INTO tds_26q_deductees (
            return_id, serial_no, pan_of_deductee, name_of_deductee, amount_paid, tax_deducted, tax_deposited,
            date_of_payment, nature_of_payment, section_deducted, rate_of_deduction, certificate_no, date_of_certificate,
            amount_paid_credited, gst_no, remark_code
          ) VALUES ${placeholders}
        `;
        await conn.query(insertDeducteesSql, values);
      }

      await conn.commit();
      conn.release();
      res.json({ success: true, message: "Form 26Q saved successfully.", returnId });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Error inserting Form 26Q:", err);
      res.status(500).json({ error: "Failed to save Form 26Q", details: err.message });
    }
  } catch (connErr) {
    console.error("Database connection error:", connErr);
    res.status(500).json({ error: "Database connection error", details: connErr.message });
  }
});

// GET: List all returns by assessment year with summary
router.get("/api/tds26q", async (req, res) => {
  const year = req.query.year;
  if (!year) return res.status(400).json({ error: "'year' query parameter is required" });

  try {
    const sql = `
      SELECT
        r.id,
        r.assessment_year AS assessmentYear,
        r.tan,
        r.pan_of_deductor AS panOfDeductor,
        r.deductor_name AS deductorName,
        r.deductor_category AS category,
        COUNT(d.id) AS totalDeductees,
        COALESCE(SUM(d.tax_deducted), 0) AS totalTaxDeducted,
        COALESCE(SUM(c.total_amount), 0) AS totalTaxDeposited,
        MAX(r.created_at) AS createdAt
      FROM tds_26q_returns r
      LEFT JOIN tds_26q_deductees d ON r.id = d.return_id
      LEFT JOIN tds_26q_challans c ON r.id = c.return_id
      WHERE r.assessment_year = ?
      GROUP BY r.id
      ORDER BY r.createdAt DESC
    `;
    const [rows] = await db.query(sql, [year]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching Form 26Q returns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
