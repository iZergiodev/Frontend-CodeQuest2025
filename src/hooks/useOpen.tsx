import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";


interface OpenProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const OpenContext = createContext({} as OpenProps);

interface OpenProviderProps {
  children: ReactNode;
}

export const OpenProvider = ({children}: OpenProviderProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
        <OpenContext.Provider value={{isOpen, setIsOpen}}>
            {children}
        </OpenContext.Provider>
    )
}

export const useOpen = () => {
  const context = useContext(OpenContext);
  if (context === undefined) {
    throw new Error('useOpen must be used within an OpenProvider');
  }
  return context;
};