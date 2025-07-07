import { API, getAuthorizedHeader } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { Category } from "@/types/apiTypes";

interface IListCategoriesParams {
  page: number;
  pageSize: number;
}

type ICreateCategoryRemove = Pick<Category, "id" | "createdAt" | "updatedAt">;
type ICreateCategory = Omit<Category, keyof ICreateCategoryRemove>;

export class CategoryService {
  static getCategories(params: IListCategoriesParams) {
    const url = "/categories";
    type Response = ControllerResponse<PaginatedResponse<Category>>;

    return API.get<Response>(url, {
      headers: getAuthorizedHeader(),
      params,
    });
  }

  static createCategory(payload: ICreateCategory) {
    const url = "/categories";
    type Response = ControllerResponse<Category>;
    return API.post<Response>(url, payload, { headers: getAuthorizedHeader() });
  }
}
