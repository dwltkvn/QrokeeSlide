import React from "react";
//import { navigate } from "gatsby";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import ProgressStepper from "../components/progressStepper";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";

import HelpIcon from "@material-ui/icons/Help";
//import ImgHero from "../images/gatsby-icon.png";

const styles = theme => ({
  margedBtn: { margin: theme.spacing.unit * 2 },
  heroBorder: {
    borderTop: "5px solid " + theme.palette.primary.main,
    borderBottom: "5px solid " + theme.palette.primary.main
  }
  //heroBorder : { borderStyle: "solid", borderWidth: "5px"}
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
      flexDirection: "column"
    }}
  >
    <h1 style={{ margin: 0 }}>{title}</h1>
    <div style={{ alignSelf: "flex-end" }}>v{version}</div>
  </div>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);

    this.state = {
      stateMounted: false,
      statePreviousSessionAvailable: false,
      stateImageLoading: false,
      stateImageLoaded: false
    };

    this.storedImage = { w: 0, h: 0, data: 0 };
  }

  componentDidMount() {
    const localStorageState = localStorage.getItem("savedSession");
    if (localStorageState)
      this.setState({ statePreviousSessionAvailable: true });

    this.setState({ stateMounted: true });
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  onFilesSelected(e) {
    this.setState({ stateImageLoading: true });
    var reader = new FileReader();
    reader.onload = this.onFileLoaded;
    reader.readAsDataURL(this.inputRef.files[0]);
    //reader.readAsBinaryString(this.inputRef.files[0]);
  }

  onFileLoaded(e) {
    //this.imgData = e.target.result;
    this.setState({ stateImageLoading: false });

    const img = new Image();
    img.onload = () => {
      this.storedImage = { w: img.width, h: img.height, data: e.target.result };
      localStorage.setItem("savedSession", JSON.stringify(this.storedImage));
      this.setState({ stateImageLoaded: true });
    };
    img.src = e.target.result;
  }

  render() {
    const { classes } = this.props;
    return (
      <Layout>
        <div
          style={{
            /*border: "5px solid black",*/
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            flex: 1
          }}
        >
          <div
            style={{
              /*border: "5px solid blue",*/
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <TitleCmpnt
              title={this.props.data.site.siteMetadata.title}
              version={this.props.data.site.siteMetadata.version}
            />
          </div>
          <div
            className={classes.heroBorder}
            style={{
              ...classes.heroBorder,
              flex: 2,
              backgroundImage: "url('" + this.storedImage.data + "')",
              backgroundSize: "cover"
            }}
          />
          <div
            style={{
              /*border: "5px solid blue",*/
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1
            }}
          >
            <Fade in={this.state.stateMounted}>
              <div>
                <div
                  style={{
                    //border: "5px solid red",
                    display: "flex",
                    flexDirection: "row",
                    //alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap"
                  }}
                >
                  <input
                    id="uploadInput"
                    type="file"
                    name="myFiles"
                    onChange={() => this.onFilesSelected()}
                    ref={elem => (this.inputRef = elem)}
                    style={{ display: "none" }}
                  />
                  <PrimaryButton
                    className={classes.margedBtn}
                    onClick={() => this.inputRef.click()}
                  >
                    Select Image
                  </PrimaryButton>
                  <PrimaryButton
                    className={classes.margedBtn}
                    disabled={!this.state.statePreviousSessionAvailable}
                  >
                    Resume
                  </PrimaryButton>
                  <PrimaryButton className={classes.margedBtn}>
                    Install
                  </PrimaryButton>
                  <Tooltip title="Install this app on your mobile!">
                    <HelpIcon />
                  </Tooltip>
                </div>
                <div>
                  <ProgressStepper />
                </div>
              </div>
            </Fade>
          </div>
          <div
            style={{
              /*border: "5px solid blue",*/
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
