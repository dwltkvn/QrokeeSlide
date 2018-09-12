import React from "react";
import * as THREE from "three";

import Hammer from "hammerjs";

class ThreeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onResize = this.onResize.bind(this);
    this.onDoubleTap = this.onDoubleTap.bind(this);

    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.onSwipeDown = this.onSwipeDown.bind(this);

    this.translateX = this.translateX.bind(this);
    this.translateY = this.translateY.bind(this);

    this.onAnim = this.onAnim.bind(this);
  }

  componentDidMount() {
    this.hammertime = new Hammer.Manager(this.canvas, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Tap, { event: "doubletap", taps: 2 }]
      ]
    });

    this.hammerswipe = new Hammer.Manager(this.canvas, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Swipe, {}]
      ]
    });

    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0xf0f0f0);

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
      -0.5 * portraitAspect,
      0.5 * portraitAspect,
      0.5 * landscapeAspect,
      -0.5 * landscapeAspect,
      0,
      2000
    ));

    // GEOMETRY - Create our only geometry: a cube.
    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.PlaneGeometry(0.9, 0.9, 0.9);

    // MATERIAL - create the default material (red cube) and selected material (white cube) + create a material for each color of the palette passed via props.
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    // MESH - create the model cube that will be cloned to create its others siblings
    //const cubes = new THREE.Mesh(geometry, material);

    const cube = new THREE.Mesh(geometry, material); //cubes.clone();
    cube.position.set(0, 0, 0);
    scene.add(cube);

    this.animObj = {
      moveX: false,
      moveY: false,
      t: 0,
      tDelta: 0.1
    };

    const cube2 = cube.clone();
    cube2.position.set(1, 0, 0);
    scene.add(cube2);

    // LIGHT - use two light at opposed position and at cube corner.
    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(10, 10, 10);
    scene.add(light_p);

    const light_p2 = new THREE.PointLight(0xffffff);
    light_p2.position.set(-10, -10, -10);
    scene.add(light_p2);

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    // ANIMATION FRAME - initiate the request animation frame and call it a first time to start the loop.
    this.onAnim();

    // EVENT LISTENER - connect event to their respective slots.
    window.addEventListener("resize", this.onResize);
    this.hammertime.on("doubletap", () => this.onDoubleTap());
    this.hammerswipe.on("swipeleft", () => this.onSwipeLeft());
    this.hammerswipe.on("swiperight", () => this.onSwipeRight());
    this.hammerswipe.on("swipeup", () => this.onSwipeUp());
    this.hammerswipe.on("swipedown", () => this.onSwipeDown());
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
      if (this.camera.position.x >= this.animObj.end) {
        this.animObj.moveX = false;
        this.camera.position.x = this.animObj.end;
      }
    }

    if (this.animObj.moveY === true) {
      this.camera.position.y = THREE.Math.lerp(
        this.animObj.start,
        this.animObj.end,
        this.animObj.t
      );
      if (this.camera.position.y >= this.animObj.end) {
        this.animObj.moveY = false;
        this.camera.position.y = this.animObj.end;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.renderer.dispose();
  }

  onResize(e) {
    let portraitAspect = window.innerWidth / window.innerHeight;
    let landscapeAspect = window.innerHeight / window.innerWidth;
    window.innerHeight > window.innerWidth
      ? (portraitAspect = 1)
      : (landscapeAspect = 1);
    this.camera.left = -0.5 * portraitAspect;
    this.camera.right = 0.5 * portraitAspect;
    this.camera.top = 0.5 * landscapeAspect;
    this.camera.bottom = -0.5 * landscapeAspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onDoubleTap() {
    console.log("double");
  }

  translateX(delta) {
    if (this.animObj.moveX === false && this.animObj.moveY === false) {
      this.animObj.moveX = true;
      this.animObj.start = this.camera.position.x;
      this.animObj.end = this.camera.position.x + delta;
      this.animObj.t = 0;
    }
  }

  translateY(delta) {
    if (this.animObj.moveY === false && this.animObj.moveX === false) {
      this.animObj.moveY = true;
      this.animObj.start = this.camera.position.y;
      this.animObj.end = this.camera.position.y + delta;
      this.animObj.t = 0;
    }
  }

  onSwipeLeft() {
    this.translateX(+0.5);
  }

  onSwipeRight() {
    this.translateX(-0.5);
  }

  onSwipeUp() {
    this.translateY(-0.5);
  }

  onSwipeDown() {
    this.translateY(+0.5);
  }

  render() {
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default ThreeTest;
