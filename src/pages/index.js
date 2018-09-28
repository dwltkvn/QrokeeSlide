import React from "react";
import { Link } from "gatsby";
import { navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "@material-ui/core/Button";

const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
    <Button
      variant="contained"
      color="primary"
      onClick={() =>
        navigate("/page-2/", { state: { pleasant: "reasonably2" } })
      }
      role="link"
      state={{
        pleasant: "reasonably"
      }}
    >
      Button
    </Button>
  </Layout>
);

export default IndexPage;
