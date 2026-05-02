-- 1. Donor Table
CREATE TABLE IF NOT EXISTS Donor (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    hla_type VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    last_donation_date DATE
);

-- 2. Donor_Resource_Types Table (Multivalued attribute resolution)
CREATE TABLE IF NOT EXISTS Donor_Resource_Types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    resource_type ENUM('blood', 'platelets', 'plasma', 'bone_marrow') NOT NULL,
    UNIQUE(donor_id, resource_type),
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id) ON DELETE CASCADE
);

-- 3. Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    blood_grp_needed VARCHAR(5) NOT NULL,
    resource_needed ENUM('blood', 'platelets', 'plasma', 'bone_marrow') NOT NULL,
    hla_type_needed VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    urgency ENUM('critical', 'moderate', 'low') NOT NULL,
    status ENUM('searching', 'fulfilled') DEFAULT 'searching'
);

-- 4. Donation_Center Table
CREATE TABLE IF NOT EXISTS Donation_Center (
    center_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    type ENUM('blood_bank', 'hospital') NOT NULL
);

-- 5. Center_Inventory Table
CREATE TABLE IF NOT EXISTS Center_Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    resource_type ENUM('blood', 'platelets', 'plasma', 'bone_marrow') NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_available INT NOT NULL CHECK (units_available >= 0),
    FOREIGN KEY (center_id) REFERENCES Donation_Center(center_id) ON DELETE CASCADE
);

-- 6. Donation_Record Table
CREATE TABLE IF NOT EXISTS Donation_Record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    center_id INT NOT NULL,
    resource_type ENUM('blood', 'platelets', 'plasma', 'bone_marrow') NOT NULL,
    donation_date DATE NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES Donation_Center(center_id) ON DELETE CASCADE
);

-- 7. Match_Record Table
CREATE TABLE IF NOT EXISTS Match_Record (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    donor_id INT NOT NULL,
    resource_type ENUM('blood', 'platelets', 'plasma', 'bone_marrow') NOT NULL,
    status ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending',
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id) ON DELETE CASCADE
);
