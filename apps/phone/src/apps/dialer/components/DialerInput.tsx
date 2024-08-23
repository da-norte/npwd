import React, { useContext } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputBase } from '@ui/components/Input';
import { useCall } from '@os/call/hooks/useCall';
import { toggleKeys } from '@ui/components/Input';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '5rem 3rem',
    height: 100,
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    boxShadow: 'none',
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    color: '#000',
    '& > input': {
      textAlign: 'center',
    },
  },
  iconBtn: {
    color: '#001fa8',
    fontweight: 'bold',
    fontSize: '14px',
  },
}));

export const DialerInput: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [t] = useTranslation();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);



  const handleNewContact = (number: string) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <Box component={Paper} className={classes.root}>
      <InputBase
        className={classes.input}
        value={inputVal}
        onChange={(e) => set(e.target.value)}
      />

      <IconButton
        className={classes.iconBtn}
        disabled={inputVal <= ''}
        onClick={() => handleNewContact(inputVal)}
        onMouseUp={() => {
          toggleKeys(false);
        }}
        size="large"
      >
        Adicionar Número
      </IconButton>
    </Box>
  );
};
