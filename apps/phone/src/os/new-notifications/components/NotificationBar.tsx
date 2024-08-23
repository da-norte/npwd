import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  Divider,
  GridProps,
  Button,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Battery90RoundedIcon from '@mui/icons-material/Battery90Rounded';

import Default from '../../../config/default.json';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import BluetoothRoundedIcon from '@mui/icons-material/BluetoothRounded';
import AirplanemodeActiveRoundedIcon from '@mui/icons-material/AirplanemodeActiveRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import FlashlightOnRoundedIcon from '@mui/icons-material/FlashlightOnRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { LuGrip } from "react-icons/lu";


import {
  notifications,
  useNavbarUncollapsed,
  useUnreadNotificationIds,
  useUnreadNotifications,
} from '@os/new-notifications/state';
import { useRecoilValue } from 'recoil';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { BatteryFull, SignalMedium } from "lucide-react";
import { cn } from "@utils/css";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '35px',
    width: '100%',
    color: theme.palette.text.primary,
    padding: '0 40px',
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  item: {
    margin: '0 6px',
  },
  text: {
    position: 'relative',
    lineHeight: '30px',
    color: theme.palette.text.primary,
  },
  icon: {
    padding: '4px',
    color: theme.palette.text.primary,
  },
  drawer: {
    backgroundColor: '#00000042',
    overflow: 'hidden',
    top: -2,
    left: -2,
    margin: '2px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  closeNotifBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
  notificationItem: {
    position: 'relative',
  },
  collapseBtn: {
    margin: '0 auto',
  },
}));

interface WrapperGridProps extends GridProps {
  tgtNoti?: UnreadNotificationBarProps;
  key: string | number;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const notificationTgtApp = useApp(tgtNoti.appId);

  return (
    <Grid
      item
      key={tgtNoti.id}
      component={IconButton}
      sx={{
        color: 'text.primary',
        fontSize: 'small',
      }}
    >
      {notificationTgtApp.notificationIcon}
    </Grid>
  );
};

interface UnreadNotificationListItemProps {
  tgtNotiId: string;
  key: string | number;
}
interface NotificationBarProps {
  barCollapsed: boolean;
  setBarUncollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const UnreadNotificationListItem: React.FC<UnreadNotificationListItemProps> = ({ tgtNotiId }) => {
  const notiContents = useRecoilValue(notifications(tgtNotiId));

  return <NotificationItem key={tgtNotiId} {...notiContents} />;
};

export const NotificationBar = ({ barCollapsed, setBarUncollapsed, value, setValue }: NotificationBarProps) => {
  const classes = useStyles();
  const time = usePhoneTime();
  const { pathname } = useLocation();
  const [colorNotificationBar, setColorNotificationBar] = useState({ background: "", color: "" });

  const unreadNotificationIds = useUnreadNotificationIds();

  const unreadNotifications = useUnreadNotifications();

  const { markAllAsRead } = useNotification();

  const handleClearNotis = async () => {
    setBarUncollapsed(false);
    await markAllAsRead();
  };

  useEffect(() => {
    if (unreadNotificationIds.length === 0) {
      setBarUncollapsed(false);
    }
  }, [unreadNotificationIds, setBarUncollapsed]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  useEffect(() => {
    if (pathname.includes('/phone') || pathname.includes('/contacts')) {
      setColorNotificationBar({ background: '#fff', color: '#000' })
    } else {
      setColorNotificationBar({ background: 'transparent', color: '#fff' })
    }
  }, [pathname])

  return (
    <>
      <div
        style={{ background: colorNotificationBar.background, color: colorNotificationBar.color }}
        className={cn(classes.root, "flex items-center justify-between flex-nowrap")}
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        <Grid style={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }} container item wrap="nowrap">
          {time && (
            <Grid item className={classes.item}>
              <Typography className={classes.text} variant="button">
                {!barCollapsed && time}
              </Typography>
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>NorteBr</span>
            </Grid>
          )}
        </Grid>
        <div style={{ width: '95px', height: '25px', background: 'black', position: 'absolute', left: '50%', translate: '-50%', top: '7px', borderRadius: '12px', zIndex: '100' }}>
          <div className='camera'></div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            {!barCollapsed && <SignalMedium />}
          </div>
          <div className="mt-1.5 text-white-600">
            {!barCollapsed &&
              <>
                <span style={{ zIndex: '1', position: 'absolute', top: '15.8px', right: '51px', color: 'black', fontSize: '9px', fontWeight: 'bold' }}>84</span>
                <Battery90RoundedIcon style={{ transform: 'rotate(90deg)', fontSize: '29px' }} />
              </>
            }
          </div>
        </div>
      </div>
      <Slide direction="down" in={barCollapsed} mountOnEnter unmountOnExit>
        <Paper square className={classes.drawer}>
          <Box display="flex" className="h-full gap-2 px-8 py-20 overflow-hidden rounded-3xl backdrop-blur-md" flexDirection="column">
            <div id='row' className='flex items-center justify-between'>
              <div id='left'>
                {time && (
                  <>
                    <Typography className={classes.text} variant="button">
                      {time}
                    </Typography>
                    <span style={{ fontSize: '12px', marginLeft: '4px' }}>Norte BR</span>
                  </>
                )}
              </div>
              <div id='right' className='flex items-center'>
                <span style={{ fontSize: '12px' }}>84%</span>
                <Battery90RoundedIcon style={{ transform: 'rotate(90deg)', fontSize: '29px' }} />
              </div>
            </div>
            <div id='row' className='flex items-center justify-between gap-2'>
              <div className='flex flex-col gap-2 p-3 w-36 h-36 bg-menu-transparent rounded-xl'>
                <div className='flex items-center justify-center gap-2'>
                  <div className='flex items-center justify-center rounded-full bg-menu-transparent w-14 h-14'><AirplanemodeActiveRoundedIcon style={{ fontSize: '28px', transform: 'rotate(90deg)' }} /></div>
                  <div className='flex items-center justify-center bg-green-400 rounded-full w-14 h-14'><PodcastsRoundedIcon style={{ fontSize: '28px' }} /></div>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <div className='flex items-center justify-center bg-blue-500 rounded-full bg-gre w-14 h-14'><WifiRoundedIcon style={{ fontSize: '28px' }} /></div>
                  <div className='flex items-center justify-center bg-blue-500 rounded-full w-14 h-14'><BluetoothRoundedIcon style={{ fontSize: '28px' }} /></div>
                </div>
              </div>
              <div className='w-36 h-36 bg-menu-transparent rounded-xl'>
              </div>
            </div>
            <div id='row' className='flex items-center justify-between gap-2'>
              <div className='flex flex-col items-center justify-between gap-2 w-36 h-36'>
                <div className='flex items-center justify-between gap-2'>
                  <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'>
                    <div className='flex items-center justify-center'>
                      <div className='flex items-center justify-center rounded-full bg-gre w-14 h-14'><LockResetRoundedIcon style={{ fontSize: '42px' }} /></div>
                    </div>
                  </div>
                  <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'>
                    <div className='flex items-center justify-center'>
                      <div className='flex items-center justify-center rounded-full bg-gre w-14 h-14'><NotificationsActiveRoundedIcon style={{ fontSize: '34px' }} /></div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div style={{ width: '144px', height: '69px' }} className='flex items-center justify-start px-2 bg-menu-transparent rounded-xl'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='flex items-center justify-center text-blue-400 rounded-full bg-blue-50 w-14 h-14'><AccountBoxRoundedIcon style={{ fontSize: '32px' }} /></div>
                      <div className='flex flex-col items-center justify-cente'><span style={{ fontSize: '14px', fontWeight: 'bold' }}>Work</span><span style={{ fontSize: '10px' }}>On</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-between gap-2 w-36 h-36'>
                <div className='flex items-center justify-between gap-2'>
                  <div style={{ width: '69px' }} className='relative flex items-start justify-start p-0 overflow-hidden h-36 bg-menu-transparent rounded-xl'>
                    <LightModeRoundedIcon style={{ left: '23px', fontSize: '22px' }} className={'absolute z-50 bottom-3 ' + (value > 10 && 'text-menu-transparent')} />
                    <Slider
                      orientation="vertical"
                      className='w-full p-0 m-0 text-white bg-transparent rounded-none'
                      value={typeof value === 'number' ? value : 0}
                      onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                    />
                  </div>
                  <div style={{ width: '69px' }} className='relative flex items-start justify-start p-0 overflow-hidden h-36 bg-menu-transparent rounded-xl'>
                    <VolumeUpRoundedIcon style={{ left: '23px', fontSize: '22px' }} className={'absolute z-50 bottom-3 ' + (value > 10 && 'text-menu-transparent')} />
                    {/* <VolumeMuteRoundedIcon style={{ left: '23px', fontSize: '22px' }} className={'absolute z-50 bottom-3 ' + (value > 10 && 'text-menu-transparent')} /> */}
                    <Slider
                      orientation="vertical"
                      className='w-full p-0 m-0 text-white bg-transparent rounded-none'
                      value={40}
                      // value={typeof value === 'number' ? value : 0}
                      // onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between gap-2'>
              <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'><div className='flex items-center justify-center rounded-full text-blue-50 w-14 h-14'><FlashlightOnRoundedIcon style={{ fontSize: '32px' }} /></div></div>
              <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'><div className='flex items-center justify-center rounded-full text-blue-50 w-14 h-14'><SpeedRoundedIcon style={{ fontSize: '32px' }} /></div></div>
              <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'><div className='flex items-center justify-center rounded-full text-blue-50 w-14 h-14'><CalculateRoundedIcon style={{ fontSize: '32px' }} /></div></div>
              <div style={{ width: '69px', height: '69px' }} className='flex items-center justify-center bg-menu-transparent rounded-xl'><div className='flex items-center justify-center rounded-full text-blue-50 w-14 h-14'><PhotoCameraRoundedIcon style={{ fontSize: '32px' }} /></div></div>
            </div>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};
