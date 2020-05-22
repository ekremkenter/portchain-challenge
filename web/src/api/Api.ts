import axios from "axios";

export default class Api {
  readonly baseUrl: string;


  constructor(baseUrl = process.env.REACT_APP_BASE_URL) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      throw new Error("Base url is empty");
    }
  }

  async getData() {
    try {
      const response = await axios.get(`${this.baseUrl}/data`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log(response.data);
      }
    } catch (e) {
      console.log(e);
    }
    throw new Error("Unable to get response");
  }

}