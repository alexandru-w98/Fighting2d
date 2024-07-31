import { useEffect, useRef, useState } from "react";

const DEFAULT_FPS = 60;

const useFrameLoop = (callback = (x, y) => {}, deps = []) => {
  const requestID = useRef(null);
  const previousTime = useRef(null);

  const loop = (time) => {
    if (previousTime.current !== undefined) {
      const deltaTime = time - previousTime.current;

      callback(time, deltaTime / 1000);
    }

    previousTime.current = time;

    requestID.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestID.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestID.current);
  }, deps);
};

export default useFrameLoop;
