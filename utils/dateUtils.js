const moment = require('moment');
const logger = require('./logger');

const formatarData = (data, formato = 'DD/MM/YYYY') => {
    try {
        const dataFormatada = moment(data).format(formato);
        logger.info(`Data formatada: ${dataFormatada}`);
        return dataFormatada;
    } catch (error) {
        logger.error('Erro ao formatar data:', error);
        throw error;
    }
};

const calcularDiferencaDias = (dataInicio, dataFim) => {
    try {
        const diferenca = moment(dataFim).diff(moment(dataInicio), 'days');
        logger.info(`Diferença em dias calculada: ${diferenca}`);
        return diferenca;
    } catch (error) {
        logger.error('Erro ao calcular diferença de dias:', error);
        throw error;
    }
};

module.exports = {
    formatarData,
    calcularDiferencaDias,
};
