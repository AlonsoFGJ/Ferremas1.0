const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Ferremas1.0',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

