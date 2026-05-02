from fastapi import APIRouter
from database import get_db_connection

router = APIRouter()

@router.get("/patients")
def get_patients():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Patient")
    patients = cursor.fetchall()

    conn.close()
    return patients