import React from 'react';
import {View} from 'react-native';
import Canvas from 'react-native-canvas';

const Detect = (props) => {
  const canvasRef = React.useRef(null);
  const canvasRef2 = React.useRef(null);
  const videoRef = React.useRef();
  const IMAGE_SCORE_THRESHOLD = 0.55;

  const capture = (ctx, enableDetect = false) => {
    // console.log(video.current);
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    if (enableDetect) {
      detectMotion();
    }
  };

  const detectMotion = async () => {
    var imageData1 = await canvasRef.current
      .getContext('2d')
      .getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    var imageData2 = await canvasRef2.current
      .getContext('2d')
      .getImageData(0, 0, canvasRef2.current.width, canvasRef2.current.height);

    var imageScore = imageData1;

    var movement = 0;

    for (var i = 0; i < imageData1.data.length; i += 4) {
      var r = imageData1.data[i];
      var g = imageData1.data[i + 1];
      var b = imageData1.data[i + 2];
      var pr = imageData2.data[i];
      var pg = imageData2.data[i + 1];
      var pb = imageData2.data[i + 2];
      imageScore.data[i] = Math.abs((r - pr) * 1.25);
      imageScore.data[i + 1] = Math.abs((g - pg) * 1.25);
      imageScore.data[i + 2] = Math.abs((b - pb) * 1.25);

      var resR = Math.abs((r - pr) * 1.25);
      var resG = Math.abs((g - pg) * 1.25);
      var resB = Math.abs((r - pr) * 1.25);
      movement += resR + resG + resB;
    }
    // console.log(imageScore.data);
    movement = movement / 10000000;
    if (movement > IMAGE_SCORE_THRESHOLD) {
      console.log('MOVEMENT');
    }
    //resCanvasRef.current.width=640;
    //resCanvasRef.current.height=480;
    // resCanvasRef.current.getContext('2d').putImageData(imageScore,0,0);
  };

  React.useEffect(() => {
    var ctx, ctx2;
    ctx = canvasRef.current.getContext('2d');
    ctx2 = canvasRef2.current.getContext('2d');
    // videoRef.current.srcObject = props.videoStream;
    // videoRef.play();
    canvasRef.current.width = 640;
    canvasRef.current.height = 480;
    canvasRef2.current.width = 640;
    canvasRef2.current.height = 480;
    var int = setInterval(() => capture(ctx), 100);
    var int2 = setInterval(() => capture(ctx2, true), 198);
    return () => {
      clearInterval(int);
      clearInterval(int2);
    };
  }, []);

  return (
    <View>
      {/* <Video source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }} ref={videoRef}/> */}
      {/* <Canvas ref={canvasRef} style={{display:'none'}}/>
            <Canvas ref={canvasRef2} style={{display:'none'}}/> */}
      {/* <WebViewBridge
        source={html}
        injectedJavaScript={injectScript}
        onBridgeMessage={receiveFromWebView}
      /> */}
    </View>
  );
};

export default Detect;
