process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Ignora certificados SSL inválidos (apenas para testes locais)

import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor OnFire em http://localhost:${port}`);
});
