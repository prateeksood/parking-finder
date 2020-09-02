import React, { useEffect } from "react";
import { TimelineMax } from "gsap";
import styles from "./LendFormInput.module.css";
export default props => {
  useEffect(() => {
    const LoadTl = new TimelineMax();
    LoadTl.from("#input-box", 0.5, {
      y: -50,
      autoAlpha: 0
    });
    props.markTouched("totalSpots");
  }, []);
  if (props.currentStep !== 2) {
    return null;
  }
  return (
    <React.Fragment>
      <input
        type="text"
        id="input-box"
        name="totalSpots"
        value={props.values.totalSpots || ""}
        onChange={props.onChange}
        className={styles.input}
        placeholder="total spots"
        autoFocus
      />
      <div className={styles.errorMsg}>{props.errors.totalSpots || ""}</div>
    </React.Fragment>
  );
};
