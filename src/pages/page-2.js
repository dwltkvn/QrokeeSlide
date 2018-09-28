import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";

const SecondPage = props => {
  console.log(props);
  //console.log(props.location.state.pleasant);
  //const varvar = props.location.state.size.w;
  return (
    <Layout>
      <h1>Hi from the second page</h1>
      <p>Welcome to page 2</p>
      <Link to="/">Go back to the homepage</Link>
      <img
        width={props.location.state.size.w}
        height={props.location.state.size.h}
        src={props.location.state.data}
        alt=""
      />
    </Layout>
  );
};

export default SecondPage;
