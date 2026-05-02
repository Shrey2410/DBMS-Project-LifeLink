from fastapi import APIRouter
from database import get_db_connection

router = APIRouter()

@router.get("/donors")
def get_donors():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Donor")
    donors = cursor.fetchall()

    conn.close()
    return donors