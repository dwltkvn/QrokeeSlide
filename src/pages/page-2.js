import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";

const SecondPage = props => {
  console.log(props);
  //console.log(props.location.state.pleasant);
  const varvar = props.location.state.pleasant;
  return (
    <Layout>
      <h1>Hi from the second page</h1>
      <p>Welcome to page 2</p>
      <p>{varvar}</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default SecondPage;
