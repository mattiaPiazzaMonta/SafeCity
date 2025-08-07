AVVIO PROGETTO SAFECITY: COMANDI

-----installare dipendenze--------
cd backend/safecity-backend
npm install

cd ../../frontend/safecity-frontend
npm install



--------file .env-----------------
Nella cartella backend/safecity-backend/, esiste un file .env: cambiare variabili del database se eseguito in locale per test.




---------migration----------------
npx sequelize-cli db:migrate



--------avvio backend-------------
cd backend/safecity-backend
node index.js



--------avvio frontend------------
cd frontend/safecity-frontend
npm start



NB--------------------------------
-Assicurarsi che il backend sia in ascolto su localhost:5000 (o cambiare la baseURL nel frontend).
-Assicurarsi che PostgreSQL sia installato e in esecuzione
-Crea un database chiamato safecity
-abilitare l'estensione PostGIS
