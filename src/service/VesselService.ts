import { Vessel, VesselScheduleResponse } from "../models";
import axios, { AxiosInstance } from "axios";

export default class VesselService {
  private static instance: AxiosInstance;

  static init(baseURL: string = "https://import-coding-challenge-api.portchain.com/api/v2") {
    this.instance = axios.create({
      baseURL,
      timeout: 10000
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