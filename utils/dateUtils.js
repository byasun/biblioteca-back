const moment = require('moment');

const formatarData = (data, formato = 'DD/MM/YYYY') => {
    return moment(data).format(formato);
};

const calcularDiferencaDias = (dataInicio, dataFim) => {
    return moment(dataFim).diff(moment(dataInicio), 'days');
};

module.exports = {
    formatarData,
    calcularDiferencaDias
};
