import React from "react";
import { navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "@material-ui/core/Button";

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.displaySelectedImage = this.displaySelectedImage.bind(this);
    this.setNbSlideH = this.setNbSlideH.bind(this);

    this.state = {
      stateImageLoaded: false,
      stateNbSlide: { w: 0, h: 2 },
      stateImg: { w: 0, h: 0 }
    };
  }

  componentDidMount() {
    //window.addEventListener("event", this.handleEvent);
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

  displaySelectedImage() {
    const img = new Image();
    img.onload = () => {
      this.imageRef.width = img.width / 10;
      this.imageRef.height = img.height / 10;

      this.storeImgOrgSize = { w: img.width, h: img.height };

      this.setState({
        stateImageLoaded: true
      });

      this.setNbSlideH();
      /*
      const nbSlideH = 2; // hardcoded, for now we just want 2 rows
      const { nbSlideW, w } = this.computeNbSlideW(
        nbSlideH,
        img.width,
        img.height
      );

      this.storeImgOrgSize = { w: img.width, h: img.height };
      this.storeImgSize = { w: w, h: img.height };
      //this.storeImgSize = { w: img.width, h: img.height };
      this.storeNbSlide = { w: nbSlideW, h: nbSlideH };

      this.imageRef.width = img.width / 10; //w / 10;
      this.imageRef.height = img.height / 10;
      //console.log(img.width);
      //console.log(img.height);

      this.setState({
        stateImageLoaded: true,
        stateNbSlide: this.storeNbSlide,
        stateImg: this.storeImgSize
      });
      */
    };
    img.src = this.imgData;

    this.imageRef.src = this.imgData;
    this.storeImgData = this.imgData;
  }

  onFileLoaded(e) {
    this.imgData = e.target.result;
    this.displaySelectedImage();
  }

  onFilesSelected(e) {
    console.log(this.inputRef.files);

    Array.from(this.inputRef.files).forEach(file => {
      console.log(file.name);
    });

    var reader = new FileReader();
    reader.onload = this.onFileLoaded;
    reader.readAsDataURL(this.inputRef.files[0]);
  }

  render() {
    return (
      <Layout>
        <input
          id="uploadInput"
          type="file"
          name="myFiles"
          onChange={() => this.onFilesSelected()}
          multiple
          ref={elem => (this.inputRef = elem)}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.inputRef.click()}
        >
          Select Image
        </Button>
        <Button
          variant="contained"
          color="primary"
          role="link"
          disabled={!this.state.stateImageLoaded}
          onClick={() =>
            navigate("/page-2/", {
              state: {
                size: this.storeImgSize,
                slide: this.storeNbSlide,
                data: this.storeImgData
              }
            })
          }
        >
          Continue
        </Button>
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.stateImageLoaded}
          >
            -
          </Button>
          Width : {this.state.stateNbSlide.w}
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.stateImageLoaded}
          >
            +
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.stateImageLoaded}
            onClick={() => {
              let stateNbSlide = this.state.stateNbSlide;
              stateNbSlide.h -= 1;
              this.setState({ stateNbSlide });
              this.setNbSlideH();
            }}
          >
            -
          </Button>
          Height : {this.state.stateNbSlide.h}
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.stateImageLoaded}
            onClick={() => {
              let stateNbSlide = this.state.stateNbSlide;
              stateNbSlide.h += 1;
              this.setState({ stateNbSlide });
              this.setNbSlideH();
            }}
          >
            +
          </Button>
        </div>
        <div>
          Size: {this.state.stateImg.w} x {this.state.stateImg.h}
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

export default IndexPage;
