import React, { useEffect, useState } from "react";
import "./App.css";
import { Data } from "./api/models";
import Api from "./api/Api";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@material-ui/core";
import DataView from "./views/DataView";

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
      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Base URL
          </Typography>
          {process.env.REACT_APP_BASE_URL}
        </CardContent>
      </Card>
    </div>
  );
}
