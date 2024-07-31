import React, { useEffect, useState, useRef } from "react";
import * as styles from "./withControls.module.css";
import useFrameLoop from "../useFrameLoop";

const DEFAULT_CONTROLS = {
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  ATTACK: "KeyP",
  JUMP: "Space",
};

const DEFAULT_SPEED = 100;

const withControls = (Component) => {
  const ComponentWithControls = (props) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [speed, setSpeed] = useState({ x: 0, y: 0 });
    const [animationState, setAnimationState] = useState("idle");

    // attack
    const [isAttacking, setIsAttacking] = useState(false);
    const attackTimer = useRef(null);

    // jump
    const [isJumping, setIsJumping] = useState(false);
    const jumpingTimer = useRef(null);

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

        if (attackTimer.current) {
          clearTimeout(attackTimer.current);
        }
        attackTimer.current = setTimeout(() => {
          setIsAttacking(false);
          attackTimer.current = null;
        }, 500);
      }
      if (keyCode === DEFAULT_CONTROLS.JUMP) {
        if (!jumpingTimer.current) {
          setIsJumping(true);
          setSpeed((prev) => ({ ...prev, y: -DEFAULT_SPEED }));
          setTimeout(() => {
            setSpeed((prev) => ({ ...prev, y: DEFAULT_SPEED }));
          }, 400);

          jumpingTimer.current = setTimeout(() => {
            setIsJumping(false);
            jumpingTimer.current = null;
            setSpeed((prev) => ({ ...prev, y: 0 }));
          }, 800);
        }
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
      if (speed.x > 0 && animationState !== "run-right" && !isJumping) {
        setAnimationState("run-right");
      } else if (speed.x < 0 && animationState !== "run-left" && !isJumping) {
        setAnimationState("run-left");
      } else if (speed.x === 0 && animationState !== "idle" && !isJumping) {
        setAnimationState("idle");
      }

      if (speed.x < 0 && isAttacking && animationState !== "attack-left") {
        setAnimationState("attack-left");
      } else if (isAttacking && animationState !== "attack-right") {
        setAnimationState("attack-right");
      }

      if (speed.x < 0 && isJumping && animationState !== "jump-left") {
        setAnimationState("jump-left");
      } else if (isJumping && animationState !== "jump-right") {
        setAnimationState("jump-right");
      }
    }, [speed.x, isAttacking, isJumping]);

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
