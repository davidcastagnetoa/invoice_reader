# invoice_reader

Este proyecto requiere iniciar MySQL con el siguiente comando:
mysql -h <DATABASE_HOST> -P <DATABASE_PORT> -u <DATABASE_USER> -p --ssl-ca=<route_to_certificated/>eu-west-3-bundle.pem

Advertencia. Si la conexion a lad DB de produccion da fallos durante el desarrollo, se trata sin duda del cambio de la direccion IP autorizada en el grupo de seguridad de AWS , actualizalo!

Comando de migración para usar el archivo sequelize-config.js:
`npx sequelize-cli db:migrate --config sequelize-config.js`

- Comando SQL para pruebas de registro nuevo usuario:

```SQL
INSERT INTO Users (id, name, email, password, cif, client_name, direccion, isPremium ) VALUES ('0001', 'David Castagneto"', 'davidcastagnetoa@gmail.com', 'password01', 'X8106184H', 'Glovo', 'Calle de la Piruleta, 1, Madrid', true);
```

- Iniciar DB en Produccion

````bash
mysql -h invoicify.cn22s4s0cx6n.eu-west-3.rds.amazonaws.com -P 3306 -u abathurCris -p --ssl-ca=/mnt/c/Users/david.castagneto/Documents/Personal_Projects/factura-extractor-api/eu-west-3-bundle.pem
```

- Consulta CURL

```bash
curl -X POST http://localhost:5000/api/invoices/process \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2ZDNhOTc5LWI4MTEtNGJjZS1hZjVkLTQ2MWJiODc1MmQ4YiIsImVtYWlsIjoiZGF2aWRjYXN0YWduZXRvYUBhb2wuY29tIiwiaWF0IjoxNzM1MjIzMjk4LCJleHAiOjE3MzUyMzc2OTh9.pqvbEKGErwJs49pGaiDDZGPO2O2wMf5k_JXlg4iFMfg" \
-F "user_id=36d3a979-b811-4bce-af5d-461bb8752d8b" \
-F "file=@/c/Users/david.castagneto/Documents/Personal_Projects/factura-extractor-api/uploads/example02.pdf"
````
