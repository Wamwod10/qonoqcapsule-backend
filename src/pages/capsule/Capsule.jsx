import React, { useEffect, useMemo } from "react";
import "./capsule.scss";
import CapsuleHeader from "./components/capsuleheader/CapsuleHeader";
import Capstype from "./components/capstype/Capstype";
import {
  getBranchConfig,
  STORAGE_KEY,
  DEFAULT_BRANCH_KEY,
} from "../../data/bookingConfig";

const Capsule = ({ forcedBranchKey = null }) => {
  const branchConfig = useMemo(() => {
    if (forcedBranchKey) {
      return getBranchConfig(forcedBranchKey);
    }

    try {
      const storedBooking = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "{}",
      );

      return getBranchConfig(
        storedBooking?.branchKey || storedBooking?.locationValue,
      );
    } catch {
      return getBranchConfig(DEFAULT_BRANCH_KEY);
    }
  }, [forcedBranchKey]);

  useEffect(() => {
    document.title = `Qonoq Capsule | ${branchConfig.fallbackLabel}`;
  }, [branchConfig.fallbackLabel]);

  return (
    <div>
      <CapsuleHeader branchConfig={branchConfig} />

      {/* 🔥 MUHIM: branchKey uzatyapmiz */}
      <Capstype
        branchConfig={branchConfig}
        branchKey={branchConfig.key}
      />
    </div>
  );
};

export default Capsule;