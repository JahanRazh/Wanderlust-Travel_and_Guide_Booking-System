import pandas as pd
import numpy as np
import sys
import json
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# === Load and clean dataset ===
df = pd.read_csv('SriLanka_Weather_Dataset.csv')
df['time'] = pd.to_datetime(df['time'])
df = df.rename(columns={
    'time': 'date',
    'temperature_2m_mean': 'temperature_mean',
    'rain_sum': 'rainfall_sum',
    'weathercode': 'weather_code'
})
df = df[['city', 'date', 'temperature_mean', 'rainfall_sum', 'weather_code']]
df.dropna(inplace=True)

# === Add date features ===
df['day_of_year'] = df['date'].dt.dayofyear
df['month'] = df['date'].dt.month
df['year'] = df['date'].dt.year
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# === Encode categorical variables ===
le_city = LabelEncoder()
df['city_encoded'] = le_city.fit_transform(df['city'])

le_weather = LabelEncoder()
df['weather_code_encoded'] = le_weather.fit_transform(df['weather_code'])

# === Features and target ===
features = ['temperature_mean', 'rainfall_sum', 'day_of_year', 'month', 'year', 'day_of_week', 'is_weekend', 'city_encoded']
target = 'weather_code_encoded'

# === Train model ===
X = df[features]
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# === Weather code mapping ===
weather_code_map = {
    '0': 'Clear',
    '1': 'Mainly clear',
    '2': 'Partly cloudy',
    '3': 'Overcast',
    '45': 'Fog',
    '48': 'Depositing rime fog',
    '51': 'Drizzle: light',
    '53': 'Drizzle: moderate',
    '55': 'Drizzle: dense',
    '61': 'Rain: slight',
    '63': 'Rain: moderate',
    '65': 'Rain: heavy',
    '71': 'Snow fall: slight',
    '80': 'Rain showers: slight',
    '81': 'Rain showers: moderate',
    '95': 'Thunderstorm'
}

# === Main prediction logic ===
def predict_weather(city_input, date_input):
    if city_input not in df['city'].unique():
        return { "error": f"City '{city_input}' not found in dataset." }

    try:
        date = pd.to_datetime(date_input)
    except ValueError:
        return { "error": "Invalid date format. Use YYYY-MM-DD." }

    # Extract date features
    day_of_year = date.dayofyear
    month = date.month
    year = date.year
    day_of_week = date.dayofweek
    is_weekend = int(day_of_week in [5, 6])

    # Historical city data
    city_data = df[df['city'] == city_input]
    temperature_mean = round(city_data['temperature_mean'].mean(), 1)
    rainfall_sum = round(city_data['rainfall_sum'].mean(), 1)
    city_encoded = le_city.transform([city_input])[0]

    # Input for model
    input_data = pd.DataFrame([{
        'temperature_mean': temperature_mean,
        'rainfall_sum': rainfall_sum,
        'day_of_year': day_of_year,
        'month': month,
        'year': year,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'city_encoded': city_encoded
    }])

    # Predict
    predicted_code = model.predict(input_data)[0]
    predicted_raw = le_weather.inverse_transform([predicted_code])[0]
    weather_label = weather_code_map.get(str(predicted_raw), str(predicted_raw))

    # Temperature category
    if temperature_mean >= 32:
        temp_type = "Very Hot"
    elif temperature_mean >= 28:
        temp_type = "Hot"
    elif temperature_mean >= 22:
        temp_type = "Warm"
    elif temperature_mean >= 16:
        temp_type = "Cool"
    else:
        temp_type = "Cold"

    return {
        "city": city_input,
        "date": date_input,
        "temperature": f"{temperature_mean}°C ({temp_type})",
        "rainfall": f"{rainfall_sum} mm",
        "conditions": weather_label
    }

# === Command-line execution ===
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({ "error": "Usage: python weather_predictor.py <city> <YYYY-MM-DD>" }))
    else:
        city_arg = sys.argv[1]
        date_arg = sys.argv[2]
        result = predict_weather(city_arg, date_arg)
        print(json.dumps(result))
