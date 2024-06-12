"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function ReactSwagger() {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    fetch("/api/swagger")
      .then(async (res) => {
        let data = await res.json();
        setData(data);
      })
      .catch((error) => console.error(error));
  }, []);
  if (data === undefined) {
    return <>Loading....</>;
  }
  return <SwaggerUI spec={data} />;
}

export default ReactSwagger;
