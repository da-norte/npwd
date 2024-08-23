import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDebounce } from '@os/phone/hooks/useDebounce';
import { useSetContactFilterInput } from '../../hooks/state';
import { NPWDInput, NPWDSearchInput } from '@ui/components';
import { Search } from "lucide-react";

export const SearchContacts: React.FC = () => {
    const [t] = useTranslation();
    const setFilterVal = useSetContactFilterInput();
    const [inputVal, setInputVal] = useState('');

    const debouncedVal = useDebounce<string>(inputVal, 500);

    useEffect(() => {
        setFilterVal(debouncedVal);
    }, [debouncedVal, setFilterVal]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-start px-1 border rounded-md bg-neutral-200 dark:bg-gray-200">
                <Search className="w-4 h-4 dark:text-gray-300" />
                <NPWDInput
                    className='h-8'
                    style={{ background: 'rgb(229 231 235/1', color: 'black' }}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={'Buscar'}
                    value={inputVal}
                />
            </div>
        </div>
    );
};
