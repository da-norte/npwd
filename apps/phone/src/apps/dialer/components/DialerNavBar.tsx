import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleUserRound, Clock3, Phone } from 'lucide-react';
import AppsIcon from '@mui/icons-material/Apps';

const DialerNavBar: React.FC = () => {
  const { pathname } = useLocation();
  const [page, setPage] = useState(pathname);
  const [t] = useTranslation();

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation value={page} onChange={handleChange} showLabels className={'px-1 pb-6 pt-0 border-0 m-0 bg-white h-24'}>
      <BottomNavigationAction
        value="/phone"
        label="Recentes"
        component={NavLink}
        icon={<Clock3 size="30px"/>}
        to="/phone"
      />
       <BottomNavigationAction
        value="/phone/contacts"
        label="Contatos"
        component={NavLink}
        icon={<CircleUserRound size="30px"/>}
        to="/phone/contacts"
      />      
      <BottomNavigationAction
        value="/phone/dial"
        label="Teclado"
        component={NavLink}
        icon={<AppsIcon fontSize="large"/>}
        to="/phone/dial"
      />
    </BottomNavigation>
  );
};

export default DialerNavBar;
