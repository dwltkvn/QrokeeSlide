import React from "react";
import { navigate } from "gatsby";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Nouislider from "../components/nouisliderWrapper";

import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import WebWorkerUtility from "../workers/webWorkerUtility";
import Worker1 from "../workers/worker1";

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
      "flex-direction": "column"
    }}
  >
    <h1 style={{ margin: 0 }}>{title}</h1>
    <div style={{ "align-self": "flex-end" }}>v{version}</div>
  </div>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.displaySelectedImage = this.displaySelectedImage.bind(this);
    this.setNbSlideH = this.setNbSlideH.bind(this);
    this.setNbSlideW = this.setNbSlideW.bind(this);
    this.restorePreviousSession = this.restorePreviousSession.bind(this);

    this.state = {
      stateImageLoaded: false,
      stateNbSlide: { w: 0, h: 2 },
      stateImg: { w: 0, h: 0 },
      stateIntensity: 0.5,
      statePreviousSessionAvailable: false,
      stateImageLoading: false,
      stateVFlip: false,
      stateHFlip: false,
      stateCount: 0,
      stateMounted: false
    };
  }

  componentDidMount() {
    //window.addEventListener("event", this.handleEvent);
    const localStorageState = localStorage.getItem("myState");
    if (localStorageState)
      this.setState({ statePreviousSessionAvailable: true });

    if (window.Worker) {
      this.worker = new WebWorkerUtility(Worker1);
      this.worker.addEventListener("message", event => {
        console.log("event received");
        this.setState({ stateCount: event.data.length });
      });
    }

    this.updateScripts = this.updateScripts.bind(this);
    window.addEventListener("online", this.updateScripts);
    this.updateScripts();

    this.setState({ stateMounted: true });
    console.log("mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.stateMounted) {
      console.log("set mounted");
      //this.setState({ stateMounted: true });
    }
    console.log("updated");
    console.log(prevState.stateMounted);
  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  updateScripts() {
    if (!window.navigator.onLine) {
      return;
    }

    if (!this.isIJSLoaded()) {
      return this.loadIJS().then(this.updateScripts);
    }
  }

  isIJSLoaded() {
    return !!window.IJS;
  }

  loadIJS() {
    return this.addElem("script", {
      async: true,
      src: "https://www.lactame.com/lib/image-js/0.21.2/image.min.js"
    });
  }

  addElem(tag, attrs) {
    return new Promise((resolve, reject) => {
      var el = document.createElement(tag);
      el.onload = resolve;
      el.onerror = reject;

      var keys = Object.keys(attrs);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        el.setAttribute(key, attrs[key]);
      }

      document.head.appendChild(el);
    });
  }
  computeNbSlideW(pNbSlideH, pImgW, pImgH) {
    const nbSlideH = pNbSlideH;
    const cubeside = pImgH / nbSlideH;
    const w = cubeside * Math.ceil(pImgW / cubeside);
    const nbSlideW = w / cubeside;

    return { nbSlideW, w };
  }

  computeNbSlideH(pNbSlideW, pImgW, pImgH) {
    const nbSlideW = pNbSlideW;
    const cubeside = pImgW / nbSlideW;
    const h = cubeside * Math.ceil(pImgH / cubeside);
    const nbSlideH = h / cubeside;

    return { nbSlideH, h };
  }

  setNbSlideH() {
    const nbSlideH = this.state.stateNbSlide.h; // hardcoded, for now we just want 2 rows
    const { nbSlideW, w } = this.computeNbSlideW(
      nbSlideH,
      this.storeImgOrgSize.w,
      this.storeImgOrgSize.h
    );

    this.storeImgSize = { w: w, h: this.storeImgOrgSize.h };
    this.storeNbSlide = { w: nbSlideW, h: nbSlideH };

    this.setState({
      stateNbSlide: this.storeNbSlide,
      stateImg: this.storeImgSize
    });
  }

  setNbSlideW() {
    const nbSlideW = this.state.stateNbSlide.w; // hardcoded, for now we just want 2 rows
    const { nbSlideH, h } = this.computeNbSlideH(
      nbSlideW,
      this.storeImgOrgSize.w,
      this.storeImgOrgSize.h
    );

    this.storeImgSize = { w: this.storeImgOrgSize.w, h: h };
    this.storeNbSlide = { w: nbSlideW, h: nbSlideH };

    this.setState({
      stateNbSlide: this.storeNbSlide,
      stateImg: this.storeImgSize
    });
  }

  displaySelectedImage() {
    this.setState({ stateImageLoading: false });
    const img = new Image();
    img.onload = () => {
      this.imageRef.width = img.width / 10;
      this.imageRef.height = img.height / 10;

      this.storeImgOrgSize = { w: img.width, h: img.height };
      //console.log(this.storeImgOrgSize);
      this.setState({
        stateImageLoaded: true
      });

      this.setNbSlideH();
    };
    img.src = this.imgData;

    this.imageRef.src = this.imgData;
    this.storeImgData = this.imgData;
  }

  onFileLoaded(e) {
    const IJS = window.IJS;
    IJS.Image.load(e.target.result)
      .then(image => {
        let grey = image.grey();

        if (this.state.stateHFlip) grey.flipX();
        if (this.state.stateVFlip) grey.flipY();

        this.imgData = grey.toDataURL();
        this.displaySelectedImage();
      })
      .catch(err => {
        console.log(err);
      });
    //this.imgData = e.target.result;
    //this.displaySelectedImage();

    //return;

    //const Jimp = window.Jimp;
    /*
    JIMP.read(e.target.result)
      .then(image => {
        image.color([
          { apply: "greyscale", params: [100] }
          //{ apply: "shade", params: [50] }
        ]);
        //image.normalize();
        //image.resize(512, 512);
        //const pow2H = Math.log()
        //console.log(image.bitmap.width);

        //image.scale(0.25);
        image.greyscale();
        const kernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
        image.convolute(kernel);

        let threshold = 200;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(
          x,
          y,
          idx
        ) {
          if (image.bitmap.data[idx] <= threshold) image.bitmap.data[idx] = 0;
          if (image.bitmap.data[idx + 1] <= threshold)
            image.bitmap.data[idx + 1] = 0;
          if (image.bitmap.data[idx + 2] <= threshold)
            image.bitmap.data[idx + 2] = 0;
        });

        image.invert();

        //image.scale(4.0);

        const h = image.bitmap.height;
        const w = image.bitmap.width;
        let pow2H, pow2W;
        if (h > w) {
          pow2H = Math.round(Math.log2(h));
          pow2W = Math.floor(Math.log2(w));
        } else if (w < h) {
          pow2H = Math.floor(Math.log2(h));
          pow2W = Math.round(Math.log2(w));
        } else {
          pow2H = Math.round(Math.log2(h));
          pow2W = Math.round(Math.log2(w));
        }
        //pow2H = Math.round(Math.log2(h));
        //pow2W = Math.round(Math.log2(w));
        const newW = Math.pow(2, pow2W);
        const newH = Math.pow(2, pow2H);
        //image.crop(0, newW, 0, newH);

        //image.resize(Jimp.AUTO, newH);
        image.cover(newW, newH);
        image.flip(this.state.stateHFlip, this.state.stateVFlip);

        image.getBase64(JIMP.AUTO, (err, data) => {
          this.imgData = data;
          this.displaySelectedImage();
        });
      })
      .catch(err => {
        console.log(err);
      });
      */
  }

  onFilesSelected(e) {
    /*this.worker.postMessage("Fetch Users");

    return;*/
    console.log(this.inputRef.files);

    Array.from(this.inputRef.files).forEach(file => {
      console.log(file.name);
    });

    this.setState({ stateImageLoading: true });
    var reader = new FileReader();
    reader.onload = this.onFileLoaded;
    reader.readAsDataURL(this.inputRef.files[0]);
    //reader.readAsBinaryString(this.inputRef.files[0]);
  }

  restorePreviousSession() {
    const localStorageState = JSON.parse(localStorage.getItem("myState"));
    this.storeImgSize = localStorageState.size;
    this.storeNbSlide = localStorageState.slide;
    this.storeImgData = localStorageState.data;
    this.setState({ stateIntensity: localStorageState.intensity });
  }

  render() {
    const { classes } = this.props;
    return (
      <Layout>
        <div
          style={{
            /*border: "5px solid black",*/
            display: "flex",
            "flex-direction": "column",
            "justify-content": "space-around",
            flex: 1
          }}
        >
          <div
            style={{
              /*border: "5px solid blue",*/
              display: "flex",
              "flex-direction": "row",
              "justify-content": "center"
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
              "flex-direction": "row",
              "justify-content": "center",
              flex: 1
            }}
          >
            <Fade in={this.state.stateMounted}>
              <div
                style={{
                  /*border: "5px solid red",*/
                  display: "flex",
                  "flex-direction": "row",
                  "align-items": "center",
                  "flex-wrap": "wrap"
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

    return (
      <Layout>
        {this.state.stateImageLoading ? <LinearProgress /> : null}
        <h1>
          {this.props.data.site.siteMetadata.title} v{
            this.props.data.site.siteMetadata.version
          }{" "}
          {this.state.stateCount}
        </h1>

        <Fade in={this.state.stateMounted}>
          <div>
            <input
              id="uploadInput"
              type="file"
              name="myFiles"
              onChange={() => this.onFilesSelected()}
              multiple
              ref={elem => (this.inputRef = elem)}
              style={{ display: "none" }}
            />
            <div>
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => {
                      this.setState(prev => ({ stateHFlip: !prev.stateHFlip }));
                    }}
                    value="Horizontal Flip"
                    color="primary"
                  />
                }
                label="HFlip"
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => {
                      this.setState(prev => ({ stateVFlip: !prev.stateVFlip }));
                    }}
                    value="Vertical Flip"
                    color="primary"
                  />
                }
                label="VFlip"
              />
            </div>
            <PrimaryButton
              onClick={() => this.inputRef.click()}
              disabled={this.state.stateImageLoading}
            >
              Select Image
            </PrimaryButton>
            <PrimaryButton
              role="link"
              disabled={!this.state.stateImageLoaded}
              onClick={() =>
                navigate("/page-2/", {
                  state: {
                    size: this.storeImgSize,
                    slide: this.storeNbSlide,
                    data: this.storeImgData,
                    intensity: this.state.stateIntensity
                  }
                })
              }
            >
              Continue
            </PrimaryButton>
            <PrimaryButton
              disabled={!this.state.statePreviousSessionAvailable}
              onClick={() => {
                this.restorePreviousSession();
                navigate("/page-2/", {
                  state: {
                    size: this.storeImgSize,
                    slide: this.storeNbSlide,
                    data: this.storeImgData,
                    intensity: this.state.stateIntensity
                  }
                });
              }}
            >
              Restore
            </PrimaryButton>
            <div>
              <PrimaryButton
                disabled={
                  !this.state.stateImageLoaded || this.state.stateNbSlide.w < 2
                }
                onClick={() => {
                  let stateNbSlide = this.state.stateNbSlide;
                  stateNbSlide.w -= 1.0;
                  this.setState({ stateNbSlide });
                  this.setNbSlideW();
                }}
              >
                -
              </PrimaryButton>
              Width : {Math.round(this.state.stateNbSlide.w)}
              <PrimaryButton
                disabled={!this.state.stateImageLoaded}
                onClick={() => {
                  let stateNbSlide = this.state.stateNbSlide;
                  stateNbSlide.w += 1.0;
                  this.setState({ stateNbSlide });
                  this.setNbSlideW();
                }}
              >
                +
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                disabled={
                  !this.state.stateImageLoaded || this.state.stateNbSlide.h < 2
                }
                onClick={() => {
                  let stateNbSlide = this.state.stateNbSlide;
                  stateNbSlide.h -= 1.0;
                  this.setState({ stateNbSlide });
                  this.setNbSlideH();
                }}
              >
                -
              </PrimaryButton>
              Height : {Math.round(this.state.stateNbSlide.h)}
              <PrimaryButton
                disabled={!this.state.stateImageLoaded}
                onClick={() => {
                  let stateNbSlide = this.state.stateNbSlide;
                  stateNbSlide.h += 1.0;
                  this.setState({ stateNbSlide });
                  this.setNbSlideH();
                }}
              >
                +
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                disabled={
                  !this.state.stateImageLoaded ||
                  this.state.stateIntensity < 0.1
                }
                onClick={() => {
                  this.setState(prev => ({
                    stateIntensity: prev.stateIntensity - 0.1
                  }));
                }}
              >
                -
              </PrimaryButton>
              Intensity on touch :{" "}
              {Math.round(this.state.stateIntensity * 10.0) / 10.0}
              <PrimaryButton
                disabled={
                  !this.state.stateImageLoaded ||
                  this.state.stateIntensity > 0.9
                }
                onClick={() => {
                  this.setState(prev => ({
                    stateIntensity: prev.stateIntensity + 0.1
                  }));
                }}
              >
                +
              </PrimaryButton>
            </div>
            <div>
              <Nouislider
                range={{ min: 0, max: 200 }}
                start={[0, 100]}
                tooltips
              />
            </div>
            <div>
              Size: {Math.round(this.state.stateImg.w)} x{" "}
              {Math.round(this.state.stateImg.h)}
            </div>
            <div>
              <img
                width="0"
                height="0"
                src=""
                alt=""
                ref={elem => (this.imageRef = elem)}
              />
            </div>
          </div>
        </Fade>
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
    },
    headerImage: imageSharp(id: { regex: "/art-blur-close-up-89625.jpg/" }) {
      sizes(maxWidth: 1240) {
        ...GatsbyImageSharpSizes_tracedSVG
      }
    },
  }
`;
export default withStyles(styles)(IndexPage);
