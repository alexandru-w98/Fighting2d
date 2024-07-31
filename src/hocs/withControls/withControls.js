import React, { useEffect, useState } from "react";
import * as styles from "./withControls.module.css";
import useFrameLoop from "../useFrameLoop";

const DEFAULT_CONTROLS = {
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  ATTACK: "KeyP",
};

const DEFAULT_SPEED = 100;

const withControls = (Component) => {
  const ComponentWithControls = (props) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [speed, setSpeed] = useState({ x: 0, y: 0 });
    const [animationState, setAnimationState] = useState("idle");

    // attack
    const [isAttacking, setIsAttacking] = useState(false);
    const [attackTimer, setAttackTimer] = useState(null);

    // TODO: memo
    const onKeyDown = (e) => {
      const keyCode = e.code;
      if (keyCode === DEFAULT_CONTROLS.UP) {
        setSpeed((prev) => ({ ...prev, y: -DEFAULT_SPEED }));
      }
      if (keyCode === DEFAULT_CONTROLS.DOWN) {
        setSpeed((prev) => ({ ...prev, y: DEFAULT_SPEED }));
      }
      if (keyCode === DEFAULT_CONTROLS.LEFT) {
        setSpeed((prev) => ({ ...prev, x: -DEFAULT_SPEED }));
      }
      if (keyCode === DEFAULT_CONTROLS.RIGHT) {
        setSpeed((prev) => ({ ...prev, x: DEFAULT_SPEED }));
      }
      if (keyCode === DEFAULT_CONTROLS.ATTACK) {
        setIsAttacking(true);

        setAttackTimer((prev) => {
          if (prev) {
            clearTimeout(prev);
          }

          return setTimeout(() => setIsAttacking(false), 500);
        });
      }
    };

    const onKeyUp = (e) => {
      const keyCode = e.code;
      if (
        keyCode === DEFAULT_CONTROLS.UP ||
        keyCode === DEFAULT_CONTROLS.DOWN
      ) {
        setSpeed((prev) => ({ ...prev, y: 0 }));
      }
      if (
        keyCode === DEFAULT_CONTROLS.LEFT ||
        keyCode === DEFAULT_CONTROLS.RIGHT
      ) {
        setSpeed((prev) => ({ ...prev, x: 0 }));
      }
    };

    useEffect(() => {
      addEventListener("keydown", onKeyDown);

      addEventListener("keyup", onKeyUp);

      return () => {
        removeEventListener("keydown", onKeyDown);
        removeEventListener("keyup", onKeyUp);
      };
    }, []);

    useFrameLoop(
      (__, delta) => {
        setPosition((prev) => ({
          x: prev.x + speed.x * delta,
          y: prev.y + speed.y * delta,
        }));
      },
      [speed.x, speed.y]
    );

    useEffect(() => {
      if (speed.x > 0 && animationState !== "run-right") {
        setAnimationState("run-right");
      } else if (speed.x < 0 && animationState !== "run-left") {
        setAnimationState("run-left");
      } else if (speed.x === 0 && animationState !== "idle") {
        setAnimationState("idle");
      }

      if (speed.x < 0 && isAttacking && animationState !== "attack-left") {
        setAnimationState("attack-left");
      } else if (isAttacking && animationState !== "attack-right") {
        setAnimationState("attack-right");
      }
    }, [speed.x, isAttacking]);

    return (
      <div
        style={{ left: position.x, top: position.y }}
        className={styles["controlled-wrapper"]}
      >
        <Component {...props} animationState={animationState} />
      </div>
    );
  };

  return ComponentWithControls;
};

export default withControls;
