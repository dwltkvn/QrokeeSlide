import React from "react";
//import { navigate } from "gatsby";
import { graphql } from "gatsby";
import { navigate } from "gatsby";

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

const TitleCmpnt = ({ title, version, installed, standalone, update, ...props }) => (
  <div
    style={{
      /*border: "5px solid blue",*/
      display: "flex",
      flexDirection: "column"
    }}
  >
    <h1 style={{ margin: 0 }}>{title}</h1>
    <div style={{ alignSelf: "flex-end" }}>
      v{version}
      {installed ? <span> (Installed)</span> : null}
      {standalone ? <span> (Standalone)</span> : null}
      {update ? <span> (Updatable)</span> : null}
    </div>
  </div>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.handleAppInstallation = this.handleAppInstallation.bind(this);
    this.handleBeforeInstallPrompt = this.handleBeforeInstallPrompt.bind(this);

    this.state = {
      stateMounted: false,
      statePreviousSessionAvailable: false,
      stateImageLoading: false,
      stateImageLoaded: false,
      stateDisplayInstallButton: false,
      stateAppInstalled: false,
      stateAppStandalone: false,
      stateAppUpdateAvailable: false,
    };

    this.storedImage = { w: 0, h: 0, data: 0 };
    this.deferredPrompt = null;
  }

  componentDidMount() {
    const localStorageState = localStorage.getItem("savedSession");
    if (localStorageState)
      this.setState({ statePreviousSessionAvailable: true });

    this.setState({ stateMounted: true });

    window.addEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt
    );
    window.addEventListener("appinstalled", evt => {
      this.setState({ stateAppInstalled: true });
    });
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.setState({ stateAppStandalone: true });
    }
    if(window.global_kdo_update) {
      this.setState({ stateAppUpdateAvailable : true })
    }
    
    fetch('./.netlify/functions/version')
      .then(response => response.text() )
      .then(data => {
                      if(this.props.data.site.siteMetadata.version!==data)
                        this.setState({stateAppUpdateAvailable:true});
                      return true;
                    })
      .catch(error => console.log(error) );
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    window.removeEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt
    );
  }

  handleBeforeInstallPrompt(e) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.setState({ stateDisplayInstallButton: true });
  }

  handleAppInstallation() {
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(result => {
      if (result.outcome === "accepted") {
        this.setState({ stateDisplayInstallButton: false });
      }
      this.deferredPrompt = null;
    });
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

      navigate("/preview/", { state: { image: this.storedImage } });
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
              installed={this.state.stateAppInstalled}
              standalone={this.state.stateAppStandalone}
              update={this.state.stateAppUpdateAvailable}
            />
          </div>
          <div
            className={classes.heroBorder}
            style={{
              flex: 2,
              backgroundImage: "url('" + this.storedImage.data + "')",
              backgroundSize: "cover"
            }}
          />
          <div
            style={
              {
                //border: "5px solid blue"
                //display: "flex"
                //flexDirection: "row",
                //justifyContent: "center",
                //flex: 1
              }
            }
          >
            <Fade in={this.state.stateMounted}>
              <div
                style={
                  {
                    //border: "5px solid green",
                    //display: "flex"
                    //flexDirection: "column"
                  }
                }
              >
                <div
                  style={{
                    //border: "5px solid red",
                    display: "flex",
                    //flexDirection: "row",
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
                    onClick={ () => navigate("/preview/") }
                  >
                    Resume
                  </PrimaryButton>
                  {!this.state.stateDisplayInstallButton ||
                  this.state.stateAppInstalled ? null : (
                    <div>
                      <PrimaryButton
                        className={classes.margedBtn}
                        onClick={() => this.handleAppInstallation()}
                      >
                        Install
                      </PrimaryButton>
                      <Tooltip
                        disableFocusListener
                        disableTouchListener
                        title="Install this app on your mobile!"
                      >
                        <HelpIcon />
                      </Tooltip>
                    </div>
                  )}
                </div>
                <ProgressStepper activeStep={0}/>
              </div>
            </Fade>
          </div>
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
