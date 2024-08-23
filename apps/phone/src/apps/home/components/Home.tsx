import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import safary from '../../../../src/apps/imgs/safari-icon.webp'
import camera from '../../../../src/apps/imgs/camera.png'
import message from '../../../../src/apps/imgs/message.webp'
import phone from '../../../../src/apps/imgs/phone.png'
import { Link } from 'react-router-dom';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const appsFront = ["DIALER", "BROWSER", "CAMERA", "MESSAGES"];
  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={[...apps, ...externalApps]} />}
      </Box>

      <div className="absolute left-0 w-full px-4 bottom-5 right-8">
        <div className="w-full h-20 rounded-3xl bg-gray-300/50">
          <div className="float-left w-full h-full">
            <div className="flex items-center w-full h-full justify-evenly">
              <Link to='/phone' className=''>
                <img src={phone} alt="" className='w-16 h-16' />
              </Link>
              <Link to='/messages' className=''>
                <img src={message} alt="" className='w-16 h-16' />
              </Link>
              <Link to='/browser' className=''>
                <img style={{ padding: '2px' }} src={safary} alt="" className='bg-gray-200 rounded-xl h-14 w-14' />
              </Link>
              <Link to='/camera' className=''>
                <img src={camera} alt="" className='w-16 h-16' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};
