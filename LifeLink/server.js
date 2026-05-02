const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Get all donors
app.get('/donors', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Donor');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 2. Get all patients
app.get('/patients', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Patient');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. Find matching donors for a patient
app.get('/match/:patient_id', async (req, res) => {
    try {
        const { patient_id } = req.params;
        const query = `
            SELECT d.donor_id, d.name AS donor_name, d.blood_group, d.city, d.phone, drt.resource_type 
            FROM Donor d
            JOIN Donor_Resource_Types drt ON d.donor_id = drt.donor_id
            JOIN Patient p ON d.blood_group = p.blood_grp_needed 
                           AND d.city = p.city 
                           AND drt.resource_type = p.resource_needed
            WHERE p.patient_id = ? AND d.is_available = TRUE;
        `;
        const [rows] = await db.execute(query, [patient_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 4. Inventory lookup
app.get('/inventory', async (req, res) => {
    try {
        const query = `
            SELECT dc.name AS center_name, dc.city, dc.phone, ci.resource_type, ci.blood_group, ci.units_available
            FROM Donation_Center dc
            JOIN Center_Inventory ci ON dc.center_id = ci.center_id
            WHERE ci.units_available > 0;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 5. Add new donor
app.post('/donor', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const { name, blood_group, hla_type, city, phone, resources } = req.body;
        
        // Insert Donor
        const [result] = await conn.execute(
            'INSERT INTO Donor (name, blood_group, hla_type, city, phone, is_available) VALUES (?, ?, ?, ?, ?, TRUE)',
            [name, blood_group, hla_type || null, city, phone]
        );
        const donorId = result.insertId;

        // Insert Resource Types (multivalued attribute)
        if (resources && resources.length > 0) {
            for (let resource of resources) {
                await conn.execute(
                    'INSERT INTO Donor_Resource_Types (donor_id, resource_type) VALUES (?, ?)',
                    [donorId, resource]
                );
            }
        }

        await conn.commit();
        res.json({ message: 'Donor added successfully', donor_id: donorId });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        conn.release();
    }
});

// 6. Add new patient
app.post('/patient', async (req, res) => {
    try {
        const { name, blood_grp_needed, resource_needed, hla_type_needed, city, phone, urgency } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO Patient (name, blood_grp_needed, resource_needed, hla_type_needed, city, phone, urgency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, blood_grp_needed, resource_needed, hla_type_needed || null, city, phone, urgency, 'searching']
        );
        res.json({ message: 'Patient added successfully', patient_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
