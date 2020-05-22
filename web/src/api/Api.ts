import axios from "axios";
import { ApiResponse, Data } from "./models";

export default class Api {
  readonly baseUrl: string;

  constructor(baseUrl = process.env.REACT_APP_BASE_URL) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      throw new Error("Base url is empty");
    }
  }

  async getData(): Promise<Data> {
    try {
      const response = await axios.get<ApiResponse>(`${this.baseUrl}/data`);
      if (response.status === 200) {
        const apiResponse = response.data;
        if (apiResponse.success) {
          return apiResponse.data;
        } else {
          console.log(apiResponse.message);
        }
      } else {
        console.log(response.data);
      }
    } catch (e) {
      console.log(e);
    }
    throw new Error("Unable to get response");
  }
}
