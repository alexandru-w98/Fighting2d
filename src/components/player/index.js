// @ts-nocheck
import withControls from "../../hocs/withControls/withControls";
import * as styles from "./player.module.css";
import React, { useEffect, useRef, useState } from "react";
import GangsterIdle from "../../../public/assets/characters/gangster/idle.png";
import GangsterRunRight from "../../../public/assets/characters/gangster/run-right.png";
import GangsterRunLeft from "../../../public/assets/characters/gangster/run-left.png";
import GangsterAttackRight from "../../../public/assets/characters/gangster/attack-right.png";
import GangsterAttackLeft from "../../../public/assets/characters/gangster/attack-left.png";
import GangsterJumpRight from "../../../public/assets/characters/gangster/jump-right.png";
import GangsterJumpLeft from "../../../public/assets/characters/gangster/jump-left.png";

const getImageSize = (path) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve({ width: +img.width, height: +img.height });
    img.onerror = reject;
    img.src = path;
  });
};

const stateToSheetMapping = {
  idle: {
    spreadSheet: GangsterIdle,
    duration: "2s",
  },
  ["run-right"]: {
    spreadSheet: GangsterRunRight,
    duration: "2s",
  },
  ["run-left"]: {
    spreadSheet: GangsterRunLeft,
    duration: "2s",
  },
  ["attack-right"]: {
    spreadSheet: GangsterAttackRight,
    duration: ".5s",
  },
  ["attack-left"]: {
    spreadSheet: GangsterAttackLeft,
    duration: ".5s",
  },
  ["jump-right"]: {
    spreadSheet: GangsterJumpRight,
    duration: ".8s",
  },
  ["jump-left"]: {
    spreadSheet: GangsterJumpLeft,
    duration: ".8s",
  },
};

const resetAnimations = (elem) => {
  const animations = elem.getAnimations();

  for (let i = 0; i < animations.length; i++) {
    animations[i].cancel();
    animations[i].play();
  }
};

const Player = ({ animationState: defaultAnimationState = "idle" }) => {
  const animationState = stateToSheetMapping[defaultAnimationState];
  const [spreadSheetSize, setSpreadSheetSize] = useState({
    width: 0,
    height: 0,
  });
  const characterRef = useRef(null);

  useEffect(() => {
    if (!characterRef) {
      return;
    }

    const computeSpreadSheetSize = async () => {
      const size = await getImageSize(animationState.spreadSheet);
      setSpreadSheetSize(size);
      resetAnimations(characterRef.current);
    };

    computeSpreadSheetSize();
  }, [animationState.spreadSheet, characterRef]);

  const spriteStyles = {
    backgroundImage: `url(${animationState.spreadSheet})`,
    height: spreadSheetSize.height,
    width: spreadSheetSize.width,
    animationTimingFunction: `steps(${
      spreadSheetSize.width / spreadSheetSize.height
    })`,
    animationDuration: animationState.duration,
  };

  const containerStyles = {
    height: spreadSheetSize.height,
    width: spreadSheetSize.height,
  };

  return (
    <div className={styles["player"]} style={containerStyles}>
      <div
        className={styles["character"]}
        style={spriteStyles}
        ref={characterRef}
      />
    </div>
  );
};

export default withControls(Player);
