const dotenv = require('dotenv');
const cors = require('cors');
const app = require('./app');

// Carrega as variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 8080;

// Configuração do CORS com a URL do frontend vinda do .env
app.use(cors({
    origin: process.env.FRONTEND_URL,  // URL do seu frontend do .env
}));

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
