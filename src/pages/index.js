import React from "react";
import { navigate } from "gatsby";
import { graphql } from "gatsby";

import Layout from "../components/layout";

import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";

import HelpIcon from "@material-ui/icons/Help";

const styles = theme => ({
  margedBtn: { margin: theme.spacing.unit * 2 }
});

const PrimaryButton = ({ children, ...props }) => (
  <Button variant="contained" color="primary" {...props}>
    {children}
  </Button>
);

const TitleCmpnt = ({ title, version, ...props }) => (
  <div
    style={{
      /*border: "5px solid blue",*/
      display: "flex",
      "flexDirection": "column"
    }}
  >
    <h1 style={{ margin: 0 }}>{title}</h1>
    <div style={{ "alignSelf": "flex-end" }}>v{version}</div>
  </div>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);

    this.state = {
      stateMounted: false,
    };
  }

  componentDidMount() {
    this.setState({ stateMounted: true });
  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  render() {
    const { classes } = this.props;
    return (
      <Layout>
        <div
          style={{
            /*border: "5px solid black",*/
            display: "flex",
            "flexDirection": "column",
            "justifyContent": "space-around",
            flex: 1
          }}
        >
          <div
            style={{
              /*border: "5px solid blue",*/
              display: "flex",
              "flexDirection": "row",
              "justifyContent": "center"
            }}
          >
            <TitleCmpnt
              title={this.props.data.site.siteMetadata.title}
              version={this.props.data.site.siteMetadata.version}
            />
          </div>
          <div
            style={{
              border: "5px solid blue",
              flex: 2
            }}
          />
          <div
            style={{
              /*border: "5px solid blue",*/
              display: "flex",
              "flexDirection": "row",
              "justifyContent": "center",
              flex: 1
            }}
          >
            <Fade in={this.state.stateMounted}>
              <div
                style={{
                  /*border: "5px solid red",*/
                  display: "flex",
                  "flexDirection": "row",
                  "alignItems": "center",
                  "flexWrap": "wrap"
                }}
              >
                <PrimaryButton className={classes.margedBtn}>
                  Select Image
                </PrimaryButton>
                <PrimaryButton className={classes.margedBtn}>
                  Resume
                </PrimaryButton>
                <PrimaryButton className={classes.margedBtn}>
                  Install
                </PrimaryButton>
                <HelpIcon />
              </div>
            </Fade>
          </div>
          <div
            style={{
              border: "5px solid blue",
              flex: 1
            }}
          />
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        version
      }
    }
  }
`;
export default withStyles(styles)(IndexPage);
