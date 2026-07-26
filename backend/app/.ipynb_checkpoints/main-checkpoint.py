from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# تحميل النموذج من مجلد models (برا مجلد backend)
model = joblib.load("../models/house_price.pkl")
with open("../models/locations.json", "r") as f:
    locations = json.load(f)

class PredictionRequest(BaseModel):
    location: str
    Carpet_Area: float
    Bathroom: int
    Balcony: int
    Car_Parking: int
    Furnishing: str
    Transaction: str
    Ownership: str

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        data = pd.DataFrame([{
            'Carpet_Area': request.Carpet_Area,
            'Bathroom': request.Bathroom,
            'Balcony': request.Balcony,
            'Car_Parking': request.Car_Parking,
            'Floor': 0,
            'location': request.location,
            'Furnishing': request.Furnishing,
            'Transaction': request.Transaction,
            'Ownership': request.Ownership
        }])
        prediction = model.predict(data)[0]
        return {"predicted_price": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))