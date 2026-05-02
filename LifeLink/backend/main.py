from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import donor, patient, match, inventory

app = FastAPI()

# Enable CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(donor.router)
app.include_router(patient.router)
app.include_router(match.router)
app.include_router(inventory.router)

@app.get("/")
def home():
    return {"message": "LifeLink API running"}