import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

export default function DataCard({
  title,
  child
}: {
  title: string;
  child: JSX.Element;
}) {
  return (
    <Card className="card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {child}
      </CardContent>
    </Card>
  );
}
