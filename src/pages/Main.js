import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../images/logo.svg';
import itsamatchLogo from '../images/itsamatch.png';
import like from '../images/like.svg';
import dislike from '../images/dislike.svg';


export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDeveloper, setMatchDeveloper] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/developers', {
        headers: { user: match.params.id },
      })
      setUsers(response.data);

    }
    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params.id }
    });

    socket.on('match', developer => {
      setMatchDeveloper(developer)
    });

  }, [match.params.id]);

  async function handleDislike(id) {
    await api.post(`/developers/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleLike(id) {
    await api.post(`/developers/${id}/likes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="tindev" />
      </Link>
      {users.length > 0 ? (<ul>
        {users.map(user => (

          <li key={user._id}>
            <img src={user.avatar} alt={user.name} />
            <footer>
              <strong>{user.name}</strong>
              <p>{user.bio}</p>
            </footer>
            <div className="buttons">
              <button type="button" onClick={() => handleDislike(user._id)}>
                <img src={dislike} alt="dislike" />
              </button>
              <button type="button" onClick={() => handleLike(user._id)}>
                <img src={like} alt="like" />
              </button>
            </div>
          </li>

        ))}

      </ul>) : (
          <div className="empty">Acabou</div>
        )}

      {matchDeveloper && (
        <div className="match-container">
          <img src={itsamatchLogo} alt="It's a match" />
          <img className="avatar" src={matchDeveloper.avatar} alt={match.name} />
          <strong>{matchDeveloper.name}</strong>
          <p>{matchDeveloper.bio}</p>
          <button type="button" onClick={() => setMatchDeveloper(null)}>fechar</button>
        </div>
      )}
    </div>
  );
}
