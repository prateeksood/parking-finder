import React, { useEffect } from "react";
import { TimelineMax } from "gsap";
import styles from "./LendFormInput.module.css";
export default props => {
  useEffect(() => {
    const LoadTl = new TimelineMax();
    LoadTl.from("#input-box", 0.5, {
      autoAlpha: 0,
      y: -50
    });
    props.markTouched("parkingName");
  }, []);
  if (props.currentStep !== 1) {
    return null;
  }
  return (
    <React.Fragment>
      <input
        type="text"
        id="input-box"
        name="parkingName"
        value={props.values.parkingName || ""}
        onChange={props.onChange}
        className={styles.input}
        placeholder="Parking Name"
        autoFocus
      />
      <div className={styles.errorMsg}>{props.errors.parkingName || ""}</div>
    </React.Fragment>
  );
};
