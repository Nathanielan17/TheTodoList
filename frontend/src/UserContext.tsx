import {createContext} from 'react';

export interface UserType{
    id: bigint;
    username: String;
}

export interface UserContextType {
    user: UserType,
    setupUser: (u: UserType) => void;
}

export const UserContext = createContext<UserContextType>({
    user: {id: BigInt(-1),username: ""},
    setupUser: () => {}
})