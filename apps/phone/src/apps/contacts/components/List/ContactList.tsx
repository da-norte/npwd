import React from 'react';
import { SearchContacts } from './SearchContacts';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useFilteredContacts } from '../../hooks/state';
import { Contact, ContactEvents } from "@typings/contact";
import { useCall } from '@os/call/hooks/useCall';
import useMessages from '@apps/messages/hooks/useMessages';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { Phone, MessageSquare, Plus, Clipboard, UsersRound, Copy } from 'lucide-react';
import { List, ListItem, NPWDButton } from '@npwd/keyos';
import { initials } from '@utils/misc';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { Tooltip } from '@ui/components/Tooltip';
import { useTwitterProfileValue } from "@apps/twitter/hooks/state";
import { useTranslation } from "react-i18next";
import { setClipboard } from "@os/phone/hooks";
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from "@utils/fetchNui";

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();

  // FIXME: This should be reduced before being passed to the component
  const groupedContacts = filteredContacts.reduce((r, e) => {
    const group = e.display.charAt(0).toUpperCase();
    if (!r[group]) r[group] = { group, contacts: [e] };
    else r[group].contacts.push(e);

    return r;
  }, []);

  const myNumber = useMyPhoneNumber()
  const { avatar_url } = useTwitterProfileValue()

  return (
    <div className="relative">
      <div className="px-2 py-5 overflow-y-auto">
        <nav className="overflow-y-auto mt-14" aria-label="Directory">
          <div key="self" className="relative">
            <List>
              <SelfContact key="self" number={myNumber} avatar={avatar_url} />
            </List>
          </div>

          {Object.keys(groupedContacts)
            .sort()
            .map((letter) => (
              <div key={letter} className="relative">
                <div className="sticky top-0 px-2 text-sm font-medium text-gray-500 border-t border-b border-gray-200 z-1 rounded-xl bg-neutral-50 dark:border-none dark:bg-transparent">
                  <h3>{letter}</h3>
                  <hr />
                </div>
                <List>
                  {groupedContacts[letter].contacts.map((contact: Contact) => (
                    <ContactItem key={contact.id} {...contact} />
                  ))}
                </List>
              </div>
            ))}
        </nav>
      </div>
      <div className="fixed right-0 w-full bg-white top-8">
        <div className="flex flex-col items-center w-full px-2 space-x-1 text-black">
          <div className='flex items-center justify-between w-full'>
            <NPWDButton
              size="icon"
              className="opacity-0"
              disabled
              onClick={() => history.push('/contacts/-1')}
            >
              <Plus className="w-6 h-6 text-blue-600" />
            </NPWDButton>
            <span className='text-base'><b>Contatos</b></span>
            <NPWDButton
              size="icon"
              className="p-2 bg-transparent rounded-full"
              onClick={() => history.push('/contacts/-1')}
            >
              <Plus className="w-6 h-6 text-blue-600" />
            </NPWDButton>
          </div>
          <SearchContacts />
        </div>
      </div>
    </div>
  );
};

interface ContactItemProps extends Contact {
  onClick?: () => void;
}

const SelfContact = ({ number, avatar }: { number: string, avatar: string }) => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar()
  const copyNumber = () => {
    setClipboard(number);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'Number',
      }),
      type: 'success',
    });
  }

  const shareLocal = () => {
    fetchNui(ContactEvents.LOCAL_SHARE)
  }

  return (
    <ListItem className='bg-contacts'>
      <div className="flex-1 min-w-0 ">
        <div
          className="flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center space-x-2">
            {avatar && avatar.length > 0 ? (
              <img src={avatar} className="inline-block w-12 h-12 rounded-full" alt={'avatar'} />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full">
                <span className="text-gray-600 dark:text-gray-300">Me</span>
              </div>
            )}
            <div>
              <p style={{ fontWeight: 'bold' }} className="text-base font-medium text-black">
                {t('CONTACTS.MY_NUMBER')}
              </p>
              <p className="text-sm text-neutral-400">{number}
                <Tooltip title={t('Copiar Número', { content: 'Copiar Número' }) as string}>
                  <button
                    onClick={copyNumber}
                    className="rounded-full text-neutral-400 ms-1"
                  >
                    <Copy size={12} />
                  </button>
                </Tooltip></p>
            </div>
          </div>
        </div>
      </div>
    </ListItem>
  );
}

const ContactItem = ({ number, avatar, id, display }: ContactItemProps) => {
  const query = useQueryParams<{ referal: string }>();
  const { referal } = query;

  const { initializeCall } = useCall();
  const { goToConversation } = useMessages();
  const { findExistingConversation } = useContactActions();
  const myPhoneNumber = useMyPhoneNumber();
  const history = useHistory();

  const startCall = (e) => {
    e.stopPropagation();
    e.preventDefault();
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number.toString());
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    e.preventDefault();

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

  return (
    <ListItem>
      <div className="flex-1 min-w-0">
        <Link
          to={
            referal
              ? `${referal}?contact=${encodeURIComponent(JSON.stringify({ number, id, display }))}`
              : `/contacts/${id}`
          }
          className="flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center space-x-1">
            {avatar && avatar.length > 0 ? (
              <img src={avatar} className="inline-block w-12 h-12 rounded-full" alt={'avatar'} />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full">
                <span className="text-gray-600 dark:text-gray-300">{initials(display)}</span>
              </div>
            )}
            <div>
              <p style={{ fontWeight: 'bold' }} className="text-base font-medium text-black">
                {display}
              </p>
              <p className="text-sm text-neutral-400">{number}</p>
            </div>
          </div>
          {/* <div className="space-x-3">
            <button
              onClick={startCall}
              className="p-3 text-green-500 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={handleMessage}
              className="p-3 text-blue-400 bg-blue-100 rounded-full hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-neutral-700"
            >
              <MessageSquare size={20} />
            </button>
          </div> */}
        </Link>
      </div>
    </ListItem>
  );
};
