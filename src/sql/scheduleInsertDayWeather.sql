INSERT INTO day_weather(date, lat, lng, address, temp_max, temp_min, temp, created_at, updated_at) VALUES(${date}, ${lat}, ${lng}, ${address}, ${tempMax}, ${tempMin}, ${temp}, current_timestamp, current_timestamp);