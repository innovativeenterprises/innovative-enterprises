import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AgentSolution_Key {
  id: UUIDString;
  __typename?: 'AgentSolution_Key';
}

export interface InsertOrganizationData {
  organization_insert: Organization_Key;
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    description: string;
  } & Project_Key)[];
}

export interface ListUsersByOrganizationData {
  users: ({
    id: UUIDString;
    displayName: string;
    email: string;
  } & User_Key)[];
}

export interface ListUsersByOrganizationVariables {
  organizationId: UUIDString;
}

export interface Metric_Key {
  id: UUIDString;
  __typename?: 'Metric_Key';
}

export interface Organization_Key {
  id: UUIDString;
  __typename?: 'Organization_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface InsertOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<InsertOrganizationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<InsertOrganizationData, undefined>;
  operationName: string;
}
export const insertOrganizationRef: InsertOrganizationRef;

export function insertOrganization(): MutationPromise<InsertOrganizationData, undefined>;
export function insertOrganization(dc: DataConnect): MutationPromise<InsertOrganizationData, undefined>;

interface ListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
  operationName: string;
}
export const listProjectsRef: ListProjectsRef;

export function listProjects(): QueryPromise<ListProjectsData, undefined>;
export function listProjects(dc: DataConnect): QueryPromise<ListProjectsData, undefined>;

interface UpdateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  operationName: string;
}
export const updateTaskRef: UpdateTaskRef;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface ListUsersByOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersByOrganizationVariables): QueryRef<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsersByOrganizationVariables): QueryRef<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;
  operationName: string;
}
export const listUsersByOrganizationRef: ListUsersByOrganizationRef;

export function listUsersByOrganization(vars: ListUsersByOrganizationVariables): QueryPromise<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;
export function listUsersByOrganization(dc: DataConnect, vars: ListUsersByOrganizationVariables): QueryPromise<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;

