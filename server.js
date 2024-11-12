const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const cors = require('cors');
const app = require('./app');

const PORT = process.env.PORT;

// Conectar ao banco de dados e iniciar o servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
});