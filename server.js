const dotenv = require('dotenv');
const cors = require('cors');
const app = require('./app');

// Carrega as variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 5000;

// Configuração do CORS
app.use(cors({
    origin: 'https://brave-smoke-0bf91ef0f.5.azurestaticapps.net',  // URL do frontend no Azure
}));

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
