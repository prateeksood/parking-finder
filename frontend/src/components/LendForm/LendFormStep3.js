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
    props.markTouched("cost");
  }, []);
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <React.Fragment>
      <input
        type="text"
        id="input-box"
        name="cost"
        value={props.values.cost || ""}
        onChange={props.onChange}
        className={styles.input}
        placeholder="per hour cost"
        autoFocus
      />
      <div className={styles.errorMsg}>{props.errors.cost || ""}</div>
    </React.Fragment>
  );
};
