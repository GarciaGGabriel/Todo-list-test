const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // permite CORS
app.use(express.json());

app.post("/tarefas", (req, res) => {
  console.log("Nova tarefa recebida:", req.body);
  res.status(201).json({ message: "Tarefa recebida com sucesso!", tarefa: req.body });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
