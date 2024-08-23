import React, { HTMLAttributes, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import useMessages from '../../../messages/hooks/useMessages';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { NPWDInput } from '@ui/components';
import { NPWDButton } from '@npwd/keyos';
import { ContactsDatabaseLimits } from '@typings/contact';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { SendMoneyModal } from '../../components/modals/SendMoney';
import { ChevronLeft, HelpingHand, MessageCircle, Phone, Trash2 } from 'lucide-react';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useModal } from '@apps/contacts/hooks/useModal';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/css';
import { initials } from '@utils/misc';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
  name?: string;
  avatar?: string;
}

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
  },
  listContainer: {
    marginTop: 30,
    width: '75%',
    margin: '0 auto',
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    height: '125px',
    width: '124px',
    marginBottom: 29,
  },
  input: {
    marginBottom: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  inputProps: {
    fontSize: 22,
  },
  button: {
    color: '#000000',
    backgroundColor: '#838383',
    '&:hover': {
      backgroundColor: '#6a6a6a',
    },
  },
});

const ContactsInfoPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<ContactInfoRouteParams>();
  const [editContact, setEditContact] = useState(false);
  const {
    addNumber,
    // Because this is mispelled absolutely everywhere
    referal: referral,
    avatar: avatarParam,
    name: nameParam,
  } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/contacts',
  });

  const { contactPayModal, setContactPayModal } = useModal();
  const { getContact, findExistingConversation } = useContactActions();
  const { updateContact, addNewContact, deleteContact } = useContactsAPI();
  const { initializeCall } = useCall();
  const myPhoneNumber = useMyPhoneNumber();
  const { goToConversation } = useMessages();

  const contact = getContact(parseInt(id));

  const [name, setName] = useState(contact?.display ?? '');
  const [number, setNumber] = useState(contact?.number ?? '');
  const [avatar, setAvatar] = useState(
    contact?.avatar ?? 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png',
  );
  // Set state after checking if null

  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.display) return;
    setName(e.target.value);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.avatar) return;
    setAvatar(e.target.value);
  };

  const handleContactAdd = () => {
    addNewContact({ display: name, number, avatar }, referral);
  };

  const startCall = () => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number.toString());
  };

  const handleMessage = () => {
    const phoneNumber = number.toString();
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    const conversation = findExistingConversation(myPhoneNumber, phoneNumber);
    if (conversation) {
      return goToConversation(conversation);
    }

    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  const handleContactDelete = () => {
    deleteContact({ id: contact.id });
  };

  const handleContactUpdate = () => {
    updateContact({ id: contact.id, number, avatar, display: name });
    setEditContact(false);
  };

  const openpayModal = () => {
    if (ResourceConfig?.general?.useResourceIntegration && ResourceConfig?.contacts?.frameworkPay) {
      setContactPayModal(true);
    }
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatarParam, nameParam]);

  if (!ResourceConfig) return null;
  return (
    <div style={{ transform: 'translateY(1px)' }} className="w-full h-full mx-auto">
      <SendMoneyModal
        open={contactPayModal}
        closeModal={() => setContactPayModal(false)}
        openContact={number}
      />
      <div className='flex justify-between my-1'>
        <button
          onClick={() => history.goBack()}
          className="px-1 m-1"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </button>
        {!contact ?
          <button
            onClick={handleContactAdd}
            className="px-2 m-1"
          >
            <span className='text-base text-blue-600'>Salvar</span>
          </button> :
          editContact ?
            <button
              onClick={handleContactUpdate}
              className="px-2 m-1"
            >
              <span className='text-base text-blue-600'>Salvar</span>
            </button> :
            <button
              onClick={() => setEditContact(true)}
              className="px-2 m-1"
            >
              <span className='text-base text-blue-600'>Editar</span>
            </button>}

      </div>
      <div className="w-full px-4 mx-auto">
        <div>
          {avatar && avatar.length > 0 ? (
            <img
              src={avatar}
              className="w-24 h-24 mx-auto text-center rounded-full"
              alt={'avatar'}
            />
          ) : (
            <div className="w-24 h-24 mx-auto text-center rounded-full-600">
              <span className="text-5xl text-gray-600 dark:text-gray-300">
                {initials(contact.display)}
              </span>
            </div>
          )}
        </div>
        <div className='items-center justify-center mt-2 d-flex '>
          <NPWDInput
            disabled={!contact ? false : !editContact}
            style={{ background: (!contact ? '#dcdcdc75' : (editContact ? '#dcdcdc75' : 'transparent')), color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}
            value={name}
            placeholder='Nome'
            onChange={handleDisplayChange}
          />
        </div>
        {contact && (
          <div className="flex items-center justify-between w-full mt-4 ">
            <button onClick={handleMessage} className='flex flex-col items-center justify-center w-20 p-2 bg-gray-200 rounded-md'>
              <ContactAction Icon={MessageCircle} className="text-blue-600" />
              <p style={{ fontSize: '10px', fontWeight: 'bold' }} className='text-blue-600'>Mensagem</p>
            </button>
            <button onClick={startCall} className='flex flex-col items-center justify-center w-20 p-2 bg-gray-200 rounded-md'>
              <ContactAction

                Icon={Phone}
                className="text-blue-600"
              />
              <p style={{ fontSize: '10px', fontWeight: 'bold' }} className='text-center text-blue-600'>Ligação</p>
            </button>
            {ResourceConfig?.general?.useResourceIntegration &&
              ResourceConfig?.contacts?.frameworkPay && (
                <div className='flex flex-col items-center justify-center w-20 p-2 bg-gray-200 rounded-md'>
                  <button
                    onClick={openpayModal}
                    className="flex items-center justify-center py-2 rounded-md group dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    <HelpingHand className="w-6 h-6 dark:text-neutral-400 dark:group-hover:text-neutral-100" />
                  </button>
                </div>
              )}
            <button onClick={handleContactDelete} className='flex flex-col items-center justify-center w-20 p-2 text-blue-600 bg-gray-200 rounded-md'>
              <ContactAction Icon={Trash2} />
              <p style={{ fontSize: '10px', fontWeight: 'bold' }} className='text-center text-blue-600'>Apagar</p>
            </button>
          </div>
        )}
        <div className="mt-4 space-y-4">
          <div className="p-2 bg-gray-200 rounded-md">
            <div className="text-sm font-medium text-black">número</div>
            <NPWDInput
              disabled={!contact ? false : !editContact}
              style={{ background: (!contact ? '#ffffff75' : (editContact ? '#ffffff75' : 'transparent')), color: 'rgb(37 99 235 / 1)', fontSize: '15px', padding: '0' }}
              value={number}
              onChange={handleNumberChange}
            />
          </div>
          <div className="p-2 bg-gray-200 rounded-md">
            <div className="text-sm font-medium text-neutral-400">Foto URL</div>
            <NPWDInput
              disabled={!contact ? false : !editContact}
              style={{ background: (!contact ? '#ffffff75' : (editContact ? '#ffffff75' : 'transparent')), color: 'rgb(37 99 235 / 1)', fontSize: '15px', padding: '0' }}
              value={avatar}
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        
      </div>
    </div >
  );
};

interface ContactActionProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  Icon: React.Component;
}
export const ContactAction: React.FC<ContactActionProps> = ({ Icon, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        props.className,
      )}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

export default ContactsInfoPage;
