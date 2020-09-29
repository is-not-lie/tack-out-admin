export interface AddRoleData {
  roleName: string;
  creator: string;
  callback?: (roles: any[]) => void
}

export interface EditRoleData {
  roleName: string;
  editor: string;
  callback?: (roles: any[]) => void
}
