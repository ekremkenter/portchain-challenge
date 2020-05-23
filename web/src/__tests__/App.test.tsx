import React from "react";
import { getByText, render, screen, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";

import App from "../App";

import mockData from "../__mocks__/data.json";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

test("renders learn react link", async () => {
  const { getByText } = render(<App />);
  // const linkElement = getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
  // wait for search results to be rendered
});

test("loads and displays greeting", async () => {
  const url = `${process.env.REACT_APP_BASE_URL!}/data`;

  axiosMock.get.mockResolvedValue({
    status: 200,
    data: mockData
  });

  render(<App />);
  expect(screen.getByRole("loading")).toBeInTheDocument();
  await wait(() => {
    expect(screen.getByText("Port call delays")).toBeInTheDocument();
  });

  expect(axiosMock.get).toHaveBeenCalledTimes(1);
  expect(axiosMock.get).toHaveBeenCalledWith(url);
  expect(screen.getByRole("data")).toBeInTheDocument();

  // expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  // expect(screen.getByRole("button")).toHaveAttribute("disabled");
});
