import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();


export function UserProvider({ children }) {
    const [name, setName] = useState('');

    return <UserContext.Provider vlaue={{ name, setName}}> {children} </UserContext.Provider>
}