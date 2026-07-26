import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    location: '',
    Carpet_Area: '',
    Bathroom: '',
    Balcony: '',
    Car_Parking: '',
    Furnishing: 'Unfurnished',
    Transaction: 'Resale',
    Ownership: 'Freehold'
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 
                     'Pune', 'Ahmedabad', 'Kolkata', 'Surat', 'Jaipur'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', {
        ...formData,
        Carpet_Area: parseFloat(formData.Carpet_Area),
        Bathroom: parseInt(formData.Bathroom),
        Balcony: parseInt(formData.Balcony),
        Car_Parking: parseInt(formData.Car_Parking)
      });
      
      setResult(response.data);
    } catch (err) {
      setError('حدث خطأ في التنبؤ. تأكد من صحة البيانات.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🏠 توقع سعر العقار</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>الموقع</label>
          <select name="location" value={formData.location} onChange={handleChange} required>
            <option value="">اختر الموقع</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>المساحة (قدم مربع)</label>
          <input
            type="number"
            name="Carpet_Area"
            value={formData.Carpet_Area}
            onChange={handleChange}
            required
            min="100"
          />
        </div>

        <div className="form-group">
          <label>عدد الحمامات</label>
          <input
            type="number"
            name="Bathroom"
            value={formData.Bathroom}
            onChange={handleChange}
            required
            min="1"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>عدد البلكونات</label>
          <input
            type="number"
            name="Balcony"
            value={formData.Balcony}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>

        <div className="form-group">
          <label>مواقف السيارات</label>
          <input
            type="number"
            name="Car_Parking"
            value={formData.Car_Parking}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>

        <div className="form-group">
          <label>نوع التأثيث</label>
          <select name="Furnishing" value={formData.Furnishing} onChange={handleChange}>
            <option value="Unfurnished">غير مفروش</option>
            <option value="Semi-Furnished">نصف مفروش</option>
            <option value="Furnished">مفروش</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'جاري التنبؤ...' : '💰 توقع السعر'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h2>السعر المتوقع</h2>
          <div className="price">
            {result.predicted_price.toLocaleString()} 
            <span className="currency">روبية</span>
          </div>
          <p>💰 { (result.predicted_price / 100000).toFixed(2) } لاك</p>
        </div>
      )}
    </div>
  );
}

export default App;