import { ListProjectsData, ListUsersByOrganizationData, ListUsersByOrganizationVariables, UpdateTaskData, UpdateTaskVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListProjects(options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;
export function useListProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;

export function useListUsersByOrganization(vars: ListUsersByOrganizationVariables, options?: useDataConnectQueryOptions<ListUsersByOrganizationData>): UseDataConnectQueryResult<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;
export function useListUsersByOrganization(dc: DataConnect, vars: ListUsersByOrganizationVariables, options?: useDataConnectQueryOptions<ListUsersByOrganizationData>): UseDataConnectQueryResult<ListUsersByOrganizationData, ListUsersByOrganizationVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
