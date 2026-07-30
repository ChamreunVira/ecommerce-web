import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Role, RoleRequest, Permission } from "@/types/role";

class RoleService {
  private rolesEndPoint = "/roles";
  private permissionsEndPoint = "/permissions";

  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const response = await http.get<ApiResponse<Role[]>>(this.rolesEndPoint);
    return response.data;
  }

  async getRoleById(id: number): Promise<ApiResponse<Role>> {
    const response = await http.get<ApiResponse<Role>>(`${this.rolesEndPoint}/${id}`);
    return response.data;
  }

  async createRole(req: RoleRequest): Promise<ApiResponse<Role>> {
    const response = await http.post<ApiResponse<Role>>(this.rolesEndPoint, req);
    return response.data;
  }

  async updateRole(id: number, req: RoleRequest): Promise<ApiResponse<Role>> {
    const response = await http.put<ApiResponse<Role>>(`${this.rolesEndPoint}/${id}`, req);
    return response.data;
  }

  async deleteRole(id: number): Promise<ApiResponse<null>> {
    const response = await http.delete<ApiResponse<null>>(`${this.rolesEndPoint}/${id}`);
    return response.data;
  }

  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await http.get<ApiResponse<Permission[]>>(this.permissionsEndPoint);
    return response.data;
  }
}

export const roleService = new RoleService();
