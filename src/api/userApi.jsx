import { privateApiClient } from "./apiClient"; 

export const adminGetAllUsers = (params) => privateApiClient.get(`/users`, { params });

export const adminUpdateUserStatus = (id, active) => privateApiClient.patch(`/users/${id}/status`, { active });
