import { useRef, useEffect, useState } from "react";
import { addDaysToDate } from "../../api/utils/utils";
import { kOriginDate } from "../../api/utils/constants";
import { useWindowWidthResize } from "../../api/hooks/useWindowWidthResize";
import backgroundImage from "../../images/gridbackground.png";

function DateScroller ({
  startDate,
  setStartDate,
  windowDays,
  setWindowDays,
}) {
  const canvasRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const { width } = useWindowWidthResize();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = backgroundImage;

    image.onload = () => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      let scale =  rect.width / 500.0;
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      context.drawImage(image, -((image.width - canvas.width) / 2.0), 0);

      setCoords({ x: Math.min(coords.x, rect.width), y: Math.min(coords.y, rect.height) });

    };

 }, [width]);


  function handleMouseDown(event) {
    setIsInteracting(true);
    captureCoordinates(event);
  };

  function handleMouseMove(event) {
    if (isInteracting) {
      captureCoordinates(event);
    }
  };

  function handleMouseUp() {
    setIsInteracting(false);
  };

  function handleTouchStart(event) {
    setIsInteracting(true);
    captureTouchCoordinates(event);
  };

  function handleTouchMove(event) {
    if (isInteracting) {
      captureTouchCoordinates(event);
    }
  };

  function handleTouchEnd() {
    setIsInteracting(false);
  };

  function captureCoordinates(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCoords({ x: Math.round(x), y: Math.round(y) });

    console.log(rect.height);
    console.log(Math.round(y));

    setWindowDays(Math.round(((rect.height - y)/rect.height * 100) * 3.65));
    setStartDate(addDaysToDate(kOriginDate, Math.max(0.0, Math.round( ((x / rect.width) * 613.0)))));
  };

  function captureTouchCoordinates(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setCoords({ x: Math.round(x), y: Math.round(y) });
  };

  function translate(coords) {
    console.log(width);
    return { left: coords.x + 7, top: coords.y };
  }

  return (
    <div className="m-3">
      <div className="horizontal-text">TIME&rarr;</div>
      <div className="vertical-text">ZOOM&darr;</div>
      <div className="dateScrollerCursor" style={translate(coords)}>📍</div>
      <canvas className="dateScroller"
        ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      ></canvas>
      Start Date: <span style={{whiteSpace: 'nowrap', pointerEvents: 'none'}}>{startDate}<br></br></span>
      Zoom: <span style={{whiteSpace: 'nowrap'}}>{windowDays} days</span>
    </div>
  );
}

export default DateScroller;
