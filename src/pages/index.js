import React from "react";
//import { navigate } from "gatsby";
import { graphql } from "gatsby";
import { navigate } from "gatsby";

import Layout from "../components/layout";
import ProgressStepper from "../components/progressStepper";
import Fade from "@material-ui/core/Fade";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

import RefreshIcon from "@material-ui/icons/Refresh";
import InstallIcon from "@material-ui/icons/AddToQueue";
import IconButton from "@material-ui/core/IconButton";
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

const TitleCmpnt = ({
  title,
  version,
  installed,
  standalone,
  update,
  install,
  cbInstall,
  ...props
}) => (
  <div
    style={{
      /*border: "5px solid blue",*/
      display: "flex",
      flexDirection: "row",
      flex: 1
    }}
  >
    <div style={{ flex: 1 }} />
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
      </div>
    </div>
    <div style={{ /*border: "5px solid blue",*/ display:"flex", flex: 1, justifyContent:'space-around', alignItems:'center' }} >
    {install ? (
      <Tooltip title="Install this app on your device">
        <IconButton
          aria-label="Install this app on your device"
          onClick={cbInstall}
        >
          <InstallIcon />
        </IconButton>
      </Tooltip>
    ) : null}
    {update ? (
      <Tooltip title="Update available, refresh to use it">
        <IconButton aria-label="Update available, refresh to use it">
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ) : null}
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
    this.checkForUpdate = this.checkForUpdate.bind(this);
    this.handleTest = this.handleTest.bind(this);

    this.state = {
      stateMounted: false,
      statePreviousSessionAvailable: false,
      stateImageLoading: false,
      stateImageLoaded: false,
      stateDisplayInstallButton: false,
      stateAppInstalled: false,
      stateAppStandalone: false,
      stateAppUpdateAvailable: false
    };

    this.storedImage = { w: 0, h: 0, data: 0 };
    this.deferredPrompt = null;
  }

  componentDidMount() {
    const localStorageState = localStorage.getItem("savedSession");
    if (localStorageState)
      this.setState({ statePreviousSessionAvailable: true });

    this.setState({ stateMounted: true });

    window.addEventListener( "beforeinstallprompt", this.handleBeforeInstallPrompt );
    window.addEventListener("appinstalled", evt => {
      this.setState({ stateAppInstalled: true });
    });
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.setState({ stateAppStandalone: true });
    }
    /*if (window.global_kdo_update) {
      this.setState({ stateAppUpdateAvailable: true });
    }*/

    this.checkForUpdate();
  }

  checkForUpdate() {
    const stateAppUpdateAvailable = window.global_kdo_update;
    this.setState({ stateAppUpdateAvailable });
    if (!stateAppUpdateAvailable) setTimeout(this.checkForUpdate, 1000); //FIX: cancel this on unmount ?
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    window.removeEventListener( "beforeinstallprompt", this.handleBeforeInstallPrompt );
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

  handleTest() {
    console.log("OK");
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
              install={
                this.state.stateDisplayInstallButton &&
                !this.state.stateAppInstalled
              }
              cbInstall={this.handleAppInstallation}
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
                    onClick={() => navigate("/preview/")}
                  >
                    Resume
                  </PrimaryButton>
                </div>
                <ProgressStepper activeStep={0} />
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
