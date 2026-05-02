from fastapi import APIRouter
from database import get_db_connection

router = APIRouter()

@router.get("/match/{patient_id}")
def match_donors(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT d.*
    FROM Donor d
    JOIN Patient p ON p.patient_id = %s
    JOIN Donor_Resource_Types dr ON d.donor_id = dr.donor_id
    WHERE d.blood_group = p.blood_grp_needed
    AND dr.resource_type = p.resource_needed
    AND d.city = p.city
    AND d.is_available = TRUE
    """

    cursor.execute(query, (patient_id,))
    result = cursor.fetchall()

    conn.close()
    return result