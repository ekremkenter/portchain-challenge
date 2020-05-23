import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import DataView from "./views/DataView";
import { Data } from "./api/models";
import Api from "./api/Api";
import "./App.css";
import DataCard from "./views/DataCard";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data>();

  useEffect(function() {
    const api = new Api();
    api
      .getData()
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        alert(e);
      });
  }, []);

  return (
    <div className="App">
      {loading && (
        <div className="flex-center" role="loading">
          <CircularProgress />
        </div>
      )}
      {data && <DataView data={data} />}
      <DataCard title="Base URL" child={<>process.env.REACT_APP_BASE_URL</>} />
    </div>
  );
}
