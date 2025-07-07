import { API } from "../../config/api";
import { User } from "../../types/apiTypes";

export interface ILoginPayload {
  email: string;
  password: string;
}

export class AuthService {
  static login(payload: ILoginPayload) {
    interface Response {
      data: {
        jwt: string;
        user: User;
      };
      message: string;
    }

    const url = "/login";
    return API.post<Response>(url, payload);
  }
}
