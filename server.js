const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const cors = require('cors');
const app = require('./app');

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
