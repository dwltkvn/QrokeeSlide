import React from "react";
import { navigate } from "gatsby";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const PrimaryButton = ({ children, ...props }) => (
  <Button variant="contained" color="primary" {...props}>
    {children}
  </Button>
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
      stateImageLoading: false
    };
  }

  componentDidMount() {
    //window.addEventListener("event", this.handleEvent);
    const localStorageState = localStorage.getItem("myState");
    if (localStorageState)
      this.setState({ statePreviousSessionAvailable: true });
  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
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
    const Jimp = window.Jimp;
    Jimp.read(e.target.result)
      .then(image => {
        /*image.color([
          { apply: "greyscale", params: [100] }
          //{ apply: "shade", params: [50] }
        ]);
        image.normalize();*/
        //image.resize(512, 512);
        //const pow2H = Math.log()
        //console.log(image.bitmap.width);

        //image.scale(0.25);
        //image.convolute([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]);
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
        //image.convolute([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]);

        image.getBase64(Jimp.AUTO, (err, data) => {
          this.imgData = data;
          this.displaySelectedImage();
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onFilesSelected(e) {
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
    return (
      <Layout>
        {this.state.stateImageLoading ? <LinearProgress /> : null}
        <h1>
          {this.props.data.site.siteMetadata.title} v{
            this.props.data.site.siteMetadata.version
          }
        </h1>

        <input
          id="uploadInput"
          type="file"
          name="myFiles"
          onChange={() => this.onFilesSelected()}
          multiple
          ref={elem => (this.inputRef = elem)}
          style={{ display: "none" }}
        />
        <PrimaryButton onClick={() => this.inputRef.click()}>
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
              !this.state.stateImageLoaded || this.state.stateIntensity < 0.1
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
              !this.state.stateImageLoaded || this.state.stateIntensity > 0.9
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
export default IndexPage;
