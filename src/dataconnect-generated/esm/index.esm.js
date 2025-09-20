import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};

export const insertOrganizationRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertOrganization');
}
insertOrganizationRef.operationName = 'InsertOrganization';

export function insertOrganization(dc) {
  return executeMutation(insertOrganizationRef(dc));
}

export const listProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProjects');
}
listProjectsRef.operationName = 'ListProjects';

export function listProjects(dc) {
  return executeQuery(listProjectsRef(dc));
}

export const updateTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTask', inputVars);
}
updateTaskRef.operationName = 'UpdateTask';

export function updateTask(dcOrVars, vars) {
  return executeMutation(updateTaskRef(dcOrVars, vars));
}

export const listUsersByOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsersByOrganization', inputVars);
}
listUsersByOrganizationRef.operationName = 'ListUsersByOrganization';

export function listUsersByOrganization(dcOrVars, vars) {
  return executeQuery(listUsersByOrganizationRef(dcOrVars, vars));
}

