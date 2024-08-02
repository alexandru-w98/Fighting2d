// @ts-nocheck
import React from "react";
import Player from "../../components/player";
import * as styles from "./arena.module.css";
import Background from "../../../public/assets/backgrounds/background-geisha.mp4";

const Arena = () => {
  return (
    <div className={styles["container"]}>
      <Player initialPos={{ x: 0, y: "calc(100% - 230px)" }} />
      <video loop className={styles["background"]} autoPlay muted>
        <source src={Background} />
      </video>
    </div>
  );
};

export default Arena;
