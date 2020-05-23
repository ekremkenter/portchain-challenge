import React from "react";
import { getByText, render, screen, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import App from "../App";
import mockData from "../__mocks__/data.json";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;
const spyAlert = jest.spyOn(window, "alert");
spyAlert.mockImplementation(() => {});

describe("App.test", function() {
  afterEach(function() {
    spyAlert.mockReset();
  });

  test("loads and displays data", async () => {
    const url = `${process.env.REACT_APP_BASE_URL!}/data`;

    axiosMock.get.mockResolvedValue({
      status: 200,
      data: mockData
    });

    const { getByText } = render(<App />);
    expect(screen.getByRole("loading")).toBeInTheDocument();
    await wait(() => {
      expect(getByText("Port call delays")).toBeInTheDocument();
    });

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(url);
    expect(screen.getByRole("data")).toBeInTheDocument();
  });

  test("fails to load response", async () => {
    axiosMock.get.mockResolvedValue({
      status: 400
    });

    render(<App />);
    expect(screen.getByRole("loading")).toBeInTheDocument();
    await wait(() => {
      expect(window.alert).toHaveBeenCalledTimes(1);
    });
  });
});
