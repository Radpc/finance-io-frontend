import { API, getAuthorizedHeader } from "../../config/api";
import { ICreatePaymentDTO } from "./DTO/create-payment";

export class PaymentService {
  static getPayments() {
    const url = "/payments";
    return API.get(url, { headers: getAuthorizedHeader() });
  }

  static createPayment(payload: ICreatePaymentDTO) {
    const url = "/payments";
    return API.post(url, payload, { headers: getAuthorizedHeader() });
  }
}
