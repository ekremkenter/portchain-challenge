import { Vessel, VesselScheduleResponse } from "../models";
import axios, { AxiosInstance } from "axios";
import moment from "moment";

export default class VesselService {
  readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) {
      throw new Error("BaseURL required");
    }
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      transformResponse: [VesselService.transformer]
    });
  }

  static transformer = (data: any) => {
    function reviver(key: string, value: any) {
      if (["arrival", "departure", "createdDate"].includes(key) && value) {
        return moment(value);
      }
      return value;
    }

    return JSON.parse(data, reviver);
  };

  async getVessels(): Promise<Array<Vessel>> {
    const response = await this.instance.get<Array<Vessel>>("/vessels");
    if (response.status != 200) {
      throw new Error("Unable to get vessels");
    }
    return response.data;
  }

  async getVesselSchedule(vesselImo: number): Promise<VesselScheduleResponse> {
    const response = await this.instance.get<VesselScheduleResponse>(
      `/schedule/${vesselImo}`
    );
    if (response.status != 200) {
      throw Error("Unable to get vessel schedule");
    }
    return response.data;
  }
}
