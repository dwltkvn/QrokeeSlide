import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header";
import "./layout.css";

const Layout = ({ children, location }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: "description", content: "Sample" },
            { name: "keywords", content: "sample, something" },
            {
              name: "viewport",
              content:
                "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
            }
          ]}
        >
          <script src="https://cdn.jsdelivr.net/npm/jimp@0.5.3/browser/lib/jimp.min.js" />
          <html lang="en" />
        </Helmet>
        <div>{children}</div>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
