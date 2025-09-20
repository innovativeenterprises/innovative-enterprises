const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const insertOrganizationRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertOrganization');
}
insertOrganizationRef.operationName = 'InsertOrganization';
exports.insertOrganizationRef = insertOrganizationRef;

exports.insertOrganization = function insertOrganization(dc) {
  return executeMutation(insertOrganizationRef(dc));
};

const listProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProjects');
}
listProjectsRef.operationName = 'ListProjects';
exports.listProjectsRef = listProjectsRef;

exports.listProjects = function listProjects(dc) {
  return executeQuery(listProjectsRef(dc));
};

const updateTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTask', inputVars);
}
updateTaskRef.operationName = 'UpdateTask';
exports.updateTaskRef = updateTaskRef;

exports.updateTask = function updateTask(dcOrVars, vars) {
  return executeMutation(updateTaskRef(dcOrVars, vars));
};

const listUsersByOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsersByOrganization', inputVars);
}
listUsersByOrganizationRef.operationName = 'ListUsersByOrganization';
exports.listUsersByOrganizationRef = listUsersByOrganizationRef;

exports.listUsersByOrganization = function listUsersByOrganization(dcOrVars, vars) {
  return executeQuery(listUsersByOrganizationRef(dcOrVars, vars));
};
