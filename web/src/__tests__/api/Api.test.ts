import "@testing-library/jest-dom/extend-expect";
import Api from "../../api/Api";

import axios from "axios";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

test("api should be called with a base url", async () => {
  expect(() => new Api("")).toThrow();
});

test("response is not success", async () => {
  axiosMock.get.mockResolvedValue({
    status: 200,
    data: {
      success: false,
      message: "Error"
    }
  });

  await expect(new Api("test").getData()).rejects.toThrow();
});

test("response is not success", async () => {
  axiosMock.get.mockResolvedValue({
    status: 200,
    data: {
      success: false,
      message: "Error"
    }
  });

  await expect(new Api("test").getData()).rejects.toThrow();
});

test("request fails", async () => {
  axiosMock.get.mockRejectedValue({
    status: 500
  });

  await expect(new Api("test").getData()).rejects.toThrow();
});
