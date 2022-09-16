import React, { useState } from 'react';
import './App.scss';
import TodoList from './components/TodoList';

import { User } from './types/User';
import { Todo } from './types/Todo';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

const todos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUser(todo.userId),
}));

export const App: React.FC = () => {
  const [allTodos, setTodos] = useState(todos);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userError, setUserError] = useState(false);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleError(false);
  };

  const handleUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(event.target.value));
    setUserError(false);
  };

  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo: Todo = {
      id: Math.max(0, ...todos.map(({ id }) => id)) + 1,
      title,
      completed: false,
      userId,
      user: getUser(userId),
    };

    if (title.trim() && userId) {
      setTodos((prev) => [...prev, newTodo]);
      setTitle('');
      setUserId(0);
    } else {
      setTitleError(title.trim() === '');
      setUserError(userId === 0);
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={handleForm}
      >
        <div className="field">
          <label htmlFor="title">Title:  </label>
          <input
            type="text"
            data-cy="titleInput"
            name="title"
            placeholder="Enter a title"
            value={title}
            onChange={handleTitle}
          />
          {titleError
          && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="title">User:  </label>
          <select
            data-cy="userSelect"
            name="user"
            value={userId}
            onChange={handleUser}
          >
            <option value="0" disabled>Choose a user</option>
            {usersFromServer.map(({ name, id }) => (
              <option value={id}>{name}</option>
            ))}
          </select>

          {userError
          && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={allTodos} />
    </div>
  );
};
