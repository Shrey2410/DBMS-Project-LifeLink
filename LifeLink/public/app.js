const API_URL = 'http://localhost:3000';

async function fetchDonors() {
    try {
        const response = await fetch(`${API_URL}/donors`);
        const donors = await response.json();
        const tbody = document.querySelector('#donorsTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        donors.forEach(donor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${donor.donor_id}</td>
                <td>${donor.name}</td>
                <td>${donor.blood_group}</td>
                <td>${donor.city}</td>
                <td>${donor.phone}</td>
                <td>${donor.is_available ? 'Yes' : 'No'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error fetching donors:', err);
    }
}

async function fetchPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const patients = await response.json();
        const tbody = document.querySelector('#patientsTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        patients.forEach(patient => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${patient.patient_id}</td>
                <td>${patient.name}</td>
                <td>${patient.blood_grp_needed}</td>
                <td>${patient.resource_needed}</td>
                <td>${patient.city}</td>
                <td>${patient.urgency}</td>
                <td>${patient.status}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error fetching patients:', err);
    }
}

async function fetchInventory() {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        const inventory = await response.json();
        const tbody = document.querySelector('#inventoryTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        inventory.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.center_name}</td>
                <td>${item.city}</td>
                <td>${item.resource_type}</td>
                <td>${item.blood_group}</td>
                <td>${item.units_available}</td>
                <td>${item.phone}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error fetching inventory:', err);
    }
}

async function findMatch(e) {
    e.preventDefault();
    const patientId = document.getElementById('patientId').value;
    try {
        const response = await fetch(`${API_URL}/match/${patientId}`);
        const matches = await response.json();
        const tbody = document.querySelector('#matchTable tbody');
        tbody.innerHTML = '';
        
        if (matches.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No available matching donors found.</td></tr>';
            return;
        }

        matches.forEach(match => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${match.donor_id}</td>
                <td>${match.donor_name}</td>
                <td>${match.blood_group}</td>
                <td>${match.resource_type}</td>
                <td>${match.city}</td>
                <td>${match.phone}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error finding matches:', err);
    }
}

async function handleDonorSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert multiple select to array
    const select = document.getElementById('resources');
    data.resources = Array.from(select.selectedOptions).map(opt => opt.value);

    try {
        const response = await fetch(`${API_URL}/donor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        e.target.reset();
        fetchDonors();
    } catch (err) {
        console.error('Error submitting donor:', err);
        alert('Failed to register donor.');
    }
}

async function handlePatientSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/patient`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        e.target.reset();
        fetchPatients();
    } catch (err) {
        console.error('Error submitting patient:', err);
        alert('Failed to register patient.');
    }
}

// Event Listeners initialization based on current page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('donorsTable')) fetchDonors();
    if (document.getElementById('patientsTable')) fetchPatients();
    if (document.getElementById('inventoryTable')) fetchInventory();
    
    const donorForm = document.getElementById('donorForm');
    if (donorForm) donorForm.addEventListener('submit', handleDonorSubmit);

    const patientForm = document.getElementById('patientForm');
    if (patientForm) patientForm.addEventListener('submit', handlePatientSubmit);

    const matchForm = document.getElementById('matchForm');
    if (matchForm) matchForm.addEventListener('submit', findMatch);
});
