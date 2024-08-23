import React from 'react';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { Slide } from '@mui/material';
import { useWallpaper } from './apps/settings/hooks/useWallpaper';
import { useLocation } from 'react-router-dom';

interface PhoneWrapperProps {
  children: React.ReactNode;
  barCollapsed: boolean;
}

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children, barCollapsed }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();

  return (
    <Slide direction="up" timeout={{ enter: 500, exit: 500 }} in={visibility}>
      <div className="PhoneWrapper">
        <div
          className="Phone"
          style={{
            position: 'fixed',
            transformOrigin: 'right bottom',
            transform: `scale(${settings.zoom.value}`,
            bottom,
          }}
        >
          <div
            className="PhoneFrame"
          />
          <div
            id="phone"
            className={"PhoneScreen bg-neutral-100 dark:bg-neutral-900"}
          >
            {children}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default PhoneWrapper;
