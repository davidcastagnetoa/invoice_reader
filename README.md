# invoice_reader

Este proyecto requiere iniciar MySQL con el siguiente comando:
mysql -h <DATABASE_HOST> -P <DATABASE_PORT> -u <DATABASE_USER> -p --ssl-ca=<route_to_certificated/>eu-west-3-bundle.pem

Advertencia. Si la conexion a lad DB de produccion da fallos durante el desarrollo, se trata sin duda del cambio de la direccion IP autorizada en el grupo de seguridad de AWS , actualizalo!

Comando de migración para usar el archivo sequelize-config.js:
`npx sequelize-cli db:migrate --config sequelize-config.js`

Comando SQL para pruebas de registro nuevo usuario:

```SQL
INSERT INTO Users (id, name, email, password, cif, client_name, direccion, isPremium ) VALUES ('0001', 'David Castagneto"', 'davidcastagnetoa@gmail.com', 'password01', 'X8106184H', 'Glovo', 'Calle de la Piruleta, 1, Madrid', true);
```
