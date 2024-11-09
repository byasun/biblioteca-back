const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const app = require('./app');

const PORT = process.argv.includes("--port=$PORT") ? process.env.PORT : 8080;

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
