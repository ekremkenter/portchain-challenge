import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import DataView from "./views/DataView";
import DataCard from "./views/DataCard";
import Api from "./api/Api";
import { Data } from "./api/models";
import "./App.css";

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
      <DataCard
        title="Base URL"
        child={<>{process.env.REACT_APP_BASE_URL}</>}
      />
    </div>
  );
}
