import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useCall } from '@os/call/hooks/useCall';
import { useHistory } from 'react-router-dom';
import { DialInputCtx } from '../../context/InputContext';
import { useQueryParams } from '@common/hooks/useQueryParams';
import {DialerInput} from '../DialerInput';
import DialGrid from '../DialPadGrid';
import { PhoneIcon } from 'lucide-react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
}));

const DialPage: React.FC = () => {
  const { initializeCall } = useCall();
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();
  const queryNumber = query.number;
  const [inputVal, setInputVal] = useState(queryNumber || '');

  const handleCall = (number: string) => {
    initializeCall(number);
  };

  const removeLastItem = (value) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const str = String(value); 
      return str.slice(0, -1);
    }
    return value; 
  };

  const handleBackspaceClick = () => {
    setInputVal(removeLastItem(inputVal));
  };

  const handleInputChange = (event) => {
    setInputVal(event.target.value);
  };

  return (
    <div className={classes.root}>
      <DialInputCtx.Provider
        value={{
          inputVal,
          add: (val: string) => setInputVal(inputVal + val),
          removeOne: () => setInputVal(inputVal.slice(0, -1)),
          clear: () => setInputVal(''),
          set: (val: string) => setInputVal(val),
        }}
      >
        <DialerInput />
        <DialGrid />
        <div className='relative flex items-center justify-center'>
          <IconButton
            className='w-20 h-20 bg-green-500 rounded-full btn-call'
            onClick={() => handleCall(inputVal)}
          >
            <CallIcon style={{ color: '#fafafa', fontSize: '44px' }} />
          </IconButton>
          <IconButton
            className={'absolute w-10 h-10 right-14 ' + (inputVal <= '' && 'opacity-0' )}
            disabled={inputVal <= ''}
            onClick={handleBackspaceClick}
          >
            <BackspaceIcon className='text-gray-200' style={{ fontSize: '28px' }} />
          </IconButton>          
        </div>
      </DialInputCtx.Provider>
    </div>
  );
};

export default DialPage;
