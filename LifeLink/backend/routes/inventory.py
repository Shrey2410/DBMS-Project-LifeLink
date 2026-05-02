from fastapi import APIRouter
from database import get_db_connection

router = APIRouter()

@router.get("/inventory")
def get_inventory():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT c.name AS center_name, ci.resource_type, ci.units_available
    FROM Center_Inventory ci
    JOIN Donation_Center c ON ci.center_id = c.center_id
    """

    cursor.execute(query)
    data = cursor.fetchall()

    conn.close()
    return data