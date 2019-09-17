import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../images/logo.svg';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post('/developers', {
      username
    });

    const { _id } = response.data;

    history.push(`/developer/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="tindev"></img>
        <input
          placeholder="insira seu username do Github"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
