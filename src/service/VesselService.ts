import { Vessel, VesselScheduleResponse } from "../models";
import axios, { AxiosInstance } from "axios";
import moment from "moment";

export default class VesselService {
  private static instance: AxiosInstance;

  static transformer = (data: any) => {
    function reviver(key: string, value: any) {
      if (["arrival", "departure", "createdDate"].includes(key) && value) {
        return moment(value);
      }
      return value;
    }

    return JSON.parse(data, reviver);
  };

  static init(baseURL: string = "https://import-coding-challenge-api.portchain.com/api/v2") {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      transformResponse: [this.transformer]
    });
  }

  static async getVessels(): Promise<Array<Vessel>> {
    if (!this.instance) {
      throw new Error("Initialize VesselService first");
    }
    const response = await this.instance.get<Array<Vessel>>("/vessels");
    if (response.status != 200) {
      throw new Error("Unable to get vessels");
    }
    return response.data;
  }

  static async getVesselSchedule(vesselImo: number): Promise<VesselScheduleResponse> {
    if (!this.instance) {
      throw new Error("Initialize VesselService first");
    }
    const response = await this.instance.get<VesselScheduleResponse>(`/schedule/${vesselImo}`);
    if (response.status != 200) {
      throw Error("Unable to get vessel schedule");
    }
    return response.data;
  }

}