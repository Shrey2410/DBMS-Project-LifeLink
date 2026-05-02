-- 1. Get all donors
SELECT * FROM Donor;

-- 2. Get all patients
SELECT * FROM Patient;

-- 3. Find matching donors for a specific patient (Assume patient_id = 1)
-- Joins Donor, Patient, and Donor_Resource_Types to find matching blood group, city, resource type and availability.
SELECT 
    d.donor_id, d.name AS donor_name, d.blood_group, d.city, d.phone, drt.resource_type 
FROM Donor d
JOIN Donor_Resource_Types drt ON d.donor_id = drt.donor_id
JOIN Patient p ON d.blood_group = p.blood_grp_needed 
               AND d.city = p.city 
               AND drt.resource_type = p.resource_needed
WHERE p.patient_id = 1 
  AND d.is_available = TRUE;

-- 4. Inventory lookup
-- JOIN Donation_Center and Center_Inventory showing available resources (> 0)
SELECT 
    dc.name AS center_name, dc.city, dc.phone, ci.resource_type, ci.blood_group, ci.units_available
FROM Donation_Center dc
JOIN Center_Inventory ci ON dc.center_id = ci.center_id
WHERE ci.units_available > 0;

-- 5. Donor eligibility
-- Filter donors based on last_donation_date (e.g., > 90 days or NULL if never donated)
SELECT * 
FROM Donor 
WHERE last_donation_date IS NULL OR DATEDIFF(CURDATE(), last_donation_date) > 90;

-- 6. Insert operations
-- Add new donor
INSERT INTO Donor (name, blood_group, hla_type, city, phone, is_available, last_donation_date) 
VALUES ('John Doe', 'O+', NULL, 'New York', '123-456-7890', TRUE, NULL);

-- Add resource types for the new donor
INSERT INTO Donor_Resource_Types (donor_id, resource_type) 
VALUES (LAST_INSERT_ID(), 'blood'), (LAST_INSERT_ID(), 'plasma');

-- Add new patient
INSERT INTO Patient (name, blood_grp_needed, resource_needed, hla_type_needed, city, phone, urgency, status) 
VALUES ('Jane Smith', 'O+', 'blood', NULL, 'New York', '098-765-4321', 'critical', 'searching');

-- Add match record
INSERT INTO Match_Record (patient_id, donor_id, resource_type, status) 
VALUES (1, 1, 'blood', 'pending');

-- 7. Update operations
-- Update donor availability
UPDATE Donor SET is_available = FALSE WHERE donor_id = 1;

-- Update patient status
UPDATE Patient SET status = 'fulfilled' WHERE patient_id = 1;

-- Update inventory when units are consumed/donated
UPDATE Center_Inventory SET units_available = units_available - 1 
WHERE center_id = 1 AND resource_type = 'blood' AND blood_group = 'O+';
