import React, { useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useLocation } from 'react-router-dom';

interface NotificationBarProps {
  setBarUncollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  screen?: boolean;
}

export const Navigation: React.FC<NotificationBarProps> = ({ setBarUncollapsed, screen = true }) => {
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleGoBackInHistory = () => {
    history.goBack();
  };

  const handleGoToMenu = () => {
    setBarUncollapsed(false);
    if (isExact) return;
    history.push('/');
  };

  const handleFocus = () => {
    if (buttonRef.current) {
      buttonRef.current.style.outline = 'none';
      buttonRef.current.style.boxShadow = 'none';
    }
  };
  
  const handleBlur = () => {
    if (buttonRef.current) {
      buttonRef.current.style.outline = '';
      buttonRef.current.style.boxShadow = '';
    }
  };
  
  return (
    <div style={{ zIndex:'100', display: !screen && 'none' }} className="absolute bottom-0 w-full h-4 bg-transparent">
      <div className="flex items-center justify-center h-full">
        <button ref={buttonRef} onBlur={handleBlur} onFocus={handleFocus} style={{ height:'6px', cursor:'pointer' }} className="text-white bg-black rounded-md d-lg w-36" onClick={handleGoToMenu}/>
      </div>
    </div>
  );
};
