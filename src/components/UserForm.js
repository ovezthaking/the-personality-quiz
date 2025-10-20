import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";

export default function UserForm(){
    const [inputName, setInputName] = useState('');
    const { setName } = useContext(UserContext);

    function handleSubmit(e){
        e.preventDefault();
        setName(inputName);
        window.history.pushState({}, '', '/quiz');
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    }

    function handleChange(e){
        setInputName(e.target.value);
    }

    return(
        <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="nameInput">Enter Your Name:</label>
            <input
                id="nameInput"
                type="text"
                value={inputName}
                onChange={handleChange}
                placeholder="Your Name"
                required
                autoFocus
            />
        </form>
    );
}