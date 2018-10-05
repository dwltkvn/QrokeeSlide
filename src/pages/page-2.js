import React from "react";
import * as THREE from "three";
//import Hammer from "hammerjs";
import { navigate } from "gatsby";

import FabButton from "../components/fab";
import Layout from "../components/layout";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import Slide from "@material-ui/core/Slide";

import GestureIcon from "@material-ui/icons/Gesture";
import GridIcon from "@material-ui/icons/ViewModule";

const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4
    /*display: "flex",
    flexDirection: "column",
    border: "red",
    borderStyle: "solid",
    borderWidth: "0px"*/
  },
  colfab: {
    display: "flex",
    flexDirection: "column",
    border: "red",
    borderStyle: "solid",
    borderWidth: "0px"
  }
});

class ThreeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateError: false,
      openNotification: false,
      stateShowUI: false
    };

    this.animObj = {
      moveX: false,
      moveY: false,
      rotate: 0,
      t: 0,
      tDelta: 0.1
    };

    this.displaySize = 0.5; // default : 0.5
    this.rotationOrientation = 0;
    this.ambiantIntensity = 1.0;

    this.onResize = this.onResize.bind(this);
    this.onDoubleTap = this.onDoubleTap.bind(this);
    this.onSingleTap = this.onSingleTap.bind(this);

    this.onPress = this.onPress.bind(this);
    this.onPressUp = this.onPressUp.bind(this);

    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.onSwipeDown = this.onSwipeDown.bind(this);

    this.translateX = this.translateX.bind(this);
    this.translateY = this.translateY.bind(this);

    this.onAnim = this.onAnim.bind(this);
  }

  componentDidMount() {
    if (
      this.props.location.state === null ||
      !this.props.location.state.hasOwnProperty("data") ||
      this.props.location.state.data === undefined
    ) {
      const state = JSON.parse(localStorage.getItem("myState"));
      if (state) {
        this.props.location.state = state;
        this.setState({ openNotification: true });
      } else {
        this.setState({ stateError: true });
        return;
      }
    }

    localStorage.setItem("myState", JSON.stringify(this.props.location.state));

    const isBrowser = typeof window !== "undefined";
    const Hammer = isBrowser ? require("hammerjs") : undefined;
    if (Hammer) {
      this.hammertime = new Hammer.Manager(this.canvas, {
        recognizers: []
      });

      var singleTap = new Hammer.Tap({ event: "singletap", taps: 1 });
      var doubleTap = new Hammer.Tap({ event: "doubletap", taps: 2 });
      var press = new Hammer.Press();
      const swipe = new Hammer.Swipe({});
      this.hammertime.add([swipe, press, doubleTap, singleTap]);
      doubleTap.recognizeWith(singleTap);
      singleTap.requireFailure(doubleTap);

      //this.hammertime.on("singletap", () => this.onSingleTap());
      this.hammertime.on("press", () => this.onPress());
      this.hammertime.on("pressup", () => this.onPressUp());
      this.hammertime.on("singletap", () => this.onSingleTap());
      this.hammertime.on("doubletap", () => this.onDoubleTap());
      this.hammertime.on("swipeleft", () => this.onSwipeLeft());
      this.hammertime.on("swiperight", () => this.onSwipeRight());
      this.hammertime.on("swipeup", () => this.onSwipeUp());
      this.hammertime.on("swipedown", () => this.onSwipeDown());
    }

    // load ressoures, then build three js scene
    //const img = new THREE.ImageLoader().load(kdoimg, i => this.buildThree(i));
    const img = new THREE.ImageLoader().load(
      this.props.location.state.data,
      i => this.buildThree(i),
      undefined,
      () => {
        console.log("Error on image load");
        this.setState({ stateError: true });
      }
    );

    //console.log(this.props.propImgWidth);
    //console.log(this.props.propImgHeight);

    // EVENT LISTENER - connect event to their respective slots.
    window.addEventListener("resize", this.onResize);
  }

  buildThree(myImg) {
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x000000);

    // RENDERER creation and configuration
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    }));
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CAMERA creation and configuraiton
    let portraitAspect = window.innerWidth / window.innerHeight;
    let landscapeAspect = window.innerHeight / window.innerWidth;
    window.innerHeight > window.innerWidth
      ? (portraitAspect = 1)
      : (landscapeAspect = 1);
    const camera = (this.camera = new THREE.OrthographicCamera(
      -this.displaySize * portraitAspect,
      this.displaySize * portraitAspect,
      this.displaySize * landscapeAspect,
      -this.displaySize * landscapeAspect,
      0,
      2000
    ));

    // GEOMETRY - Create our only geometry: a cube.
    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.PlaneGeometry(1, 1, 1);
    const markerGeom = new THREE.CircleGeometry(0.1, 3);

    // MATERIAL - create the default material
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false
    });

    const circle = new THREE.Mesh(markerGeom, markerMaterial);
    //const texture = new THREE.TextureLoader().load(kdoimg);

    // texture from canvas:

    // CanvasTexture https://threejs.org/docs/#api/en/textures/CanvasTexture

    // http://collaboradev.com/2016/03/17/drawing-on-textures-in-threejs/
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/drawImage
    // void ctx.drawImage(image, dx, dy, dLargeur, dHauteur);

    //create in memory canvas
    const sImgW = this.props.location.state.size.w;
    const sImgH = this.props.location.state.size.h;

    const nbW = this.props.location.state.slide.w;
    const nbH = this.props.location.state.slide.h;

    for (let i = 0; i < nbW; i++) {
      for (let j = 0; j < nbH; j++) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = sImgW / nbW;
        canvas.height = sImgH / nbH;
        context.drawImage(myImg, i * (-sImgW / nbW), j * (-sImgH / nbH));
        const canvasTexture = new THREE.CanvasTexture(canvas);

        //const textureMaterial = new THREE.MeshBasicMaterial({
        const textureMaterial = new THREE.MeshPhongMaterial({
          map: canvasTexture
        });

        const cube = new THREE.Mesh(geometry, textureMaterial); //cubes.clone();
        cube.position.set(i, -j, -1);
        scene.add(cube);

        /*const c = circle.clone();
        c.position.set(i, -j, 0);
        scene.add(c);*/
      }
    }

    // LINES
    var material = new THREE.LineBasicMaterial({
      color: 0xff00ff
    });

    this.linesGroup = new THREE.Group();

    for (let i = -0.5; i <= 0.5; i += 0.25) {
      var geomLine = new THREE.Geometry();
      geomLine.vertices.push(
        new THREE.Vector3(-0.5, i, 0),
        new THREE.Vector3(0.5, i, 0)
      );
      this.linesGroup.add(new THREE.Line(geomLine, material));
    }

    for (let j = -0.5; j <= 0.5; j += 0.25) {
      var geomLine = new THREE.Geometry();
      geomLine.vertices.push(
        new THREE.Vector3(j, -0.5, 0),
        new THREE.Vector3(j, 0.5, 0)
      );
      this.linesGroup.add(new THREE.Line(geomLine, material));
    }

    //this.linesGroup.add(new THREE.Line(geomLine1, material));
    //this.linesGroup.add(new THREE.Line(geomLine2, material));

    scene.add(this.linesGroup);

    // LIGHT -
    const light_a = (this.light = new THREE.AmbientLight(0xffffff));
    scene.add(light_a);

    // ANIMATION FRAME - initiate the request animation frame and call it a first time to start the loop.
    this.onAnim();
  }

  onAnim() {
    requestAnimationFrame(this.onAnim);

    this.animObj.t = THREE.Math.clamp(
      this.animObj.t + this.animObj.tDelta,
      0,
      1.0
    );

    if (this.animObj.moveX === true) {
      this.camera.position.x = THREE.Math.lerp(
        this.animObj.start,
        this.animObj.end,
        this.animObj.t
      );
      if (this.camera.position.x === this.animObj.end) {
        this.animObj.moveX = false;
        this.camera.position.x = this.animObj.end;
        this.linesGroup.position.x = this.animObj.end;
      }
    }

    if (this.animObj.moveY === true) {
      this.camera.position.y = THREE.Math.lerp(
        this.animObj.start,
        this.animObj.end,
        this.animObj.t
      );
      if (this.camera.position.y === this.animObj.end) {
        this.animObj.moveY = false;
        this.camera.position.y = this.animObj.end;
        this.linesGroup.position.y = this.animObj.end;
      }
    }

    if (this.animObj.rotate > 0) {
      this.camera.rotateZ(this.animObj.tDelta /*Math.PI / 2*/);
      this.animObj.rotate -= this.animObj.tDelta;

      if (this.animObj.rotate < this.animObj.tDelta) {
        this.camera.rotateZ(this.animObj.rotate);
        this.animObj.rotate = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.renderer) this.renderer.dispose();
  }

  onResize(e) {
    let portraitAspect = window.innerWidth / window.innerHeight;
    let landscapeAspect = window.innerHeight / window.innerWidth;
    window.innerHeight > window.innerWidth
      ? (portraitAspect = 1)
      : (landscapeAspect = 1);
    this.camera.left = -this.displaySize * portraitAspect;
    this.camera.right = this.displaySize * portraitAspect;
    this.camera.top = this.displaySize * landscapeAspect;
    this.camera.bottom = -this.displaySize * landscapeAspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onPress() {
    this.light.intensity = this.props.location.state.intensity;
  }

  onPressUp() {
    this.light.intensity = 1.0;
  }
  onSingleTap() {
    console.log("Single tap");
    this.setState((prevState, props) => ({
      stateShowUI: !prevState.stateShowUI
    }));
  }
  onDoubleTap() {
    this.animObj.rotate = Math.PI / 2;
    this.rotationOrientation = (this.rotationOrientation + 1) % 4;
  }

  translateX(delta) {
    if (
      this.animObj.moveX === false &&
      this.animObj.moveY === false &&
      this.animObj.rotate === 0
    ) {
      this.animObj.moveX = true;
      this.animObj.start = this.camera.position.x;
      this.animObj.end = this.camera.position.x + delta;
      this.animObj.t = 0;
    }
  }

  translateY(delta) {
    if (
      this.animObj.moveY === false &&
      this.animObj.moveX === false &&
      this.animObj.rotate === 0
    ) {
      this.animObj.moveY = true;
      this.animObj.start = this.camera.position.y;
      this.animObj.end = this.camera.position.y + delta;
      this.animObj.t = 0;
    }
  }

  onSwipeLeft() {
    //this.translateX(+0.5);
    if (this.rotationOrientation === 0) this.translateX(+0.5);
    else if (this.rotationOrientation === 1) this.translateY(+0.5);
    else if (this.rotationOrientation === 2) this.translateX(-0.5);
    else if (this.rotationOrientation === 3) this.translateY(-0.5);
  }

  onSwipeRight() {
    if (this.rotationOrientation === 0) this.translateX(-0.5);
    else if (this.rotationOrientation === 1) this.translateY(-0.5);
    else if (this.rotationOrientation === 2) this.translateX(0.5);
    else if (this.rotationOrientation === 3) this.translateY(0.5);
  }

  onSwipeUp() {
    if (this.rotationOrientation === 0) this.translateY(-0.5);
    else if (this.rotationOrientation === 1) this.translateX(+0.5);
    else if (this.rotationOrientation === 2) this.translateY(+0.5);
    else if (this.rotationOrientation === 3) this.translateX(-0.5);
  }

  onSwipeDown() {
    if (this.rotationOrientation === 0) this.translateY(+0.5);
    else if (this.rotationOrientation === 1) this.translateX(-0.5);
    else if (this.rotationOrientation === 2) this.translateY(-0.5);
    else if (this.rotationOrientation === 3) this.translateX(+0.5);
  }

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        {this.state.stateError ? (
          <Button
            variant="contained"
            color="primary"
            role="link"
            onClick={() => navigate("")}
          >
            Return
          </Button>
        ) : (
          <div>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={this.state.openNotification}
              onClose={() => this.setState({ openNotification: false })}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={<span id="message-id">Session restored</span>}
            />
            <div className={classes.fab}>
              <Slide in={this.state.stateShowUI} direction="left">
                <div className={classes.colfab}>
                  <FabButton
                    title="Grid"
                    onClick={() =>
                      (this.linesGroup.visible = !this.linesGroup.visible)
                    }
                  >
                    <GridIcon />
                  </FabButton>
                </div>
              </Slide>
            </div>
            <canvas ref={el => (this.canvas = el)} />
          </div>
        )}
      </Layout>
    );
  }
}

export default withStyles(styles)(ThreeTest);
