import React, { useState } from 'react';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import './App.css';
import { getByTestId } from '@testing-library/react';

const todoListState = atom({
  key: 'todoListState',
  default: [],
});

let id = 0;
function getId() {
  return id++;
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList(oldTodoList => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);

    setInputValue('');
  };

  const onChange = event => setInputValue(event.target.value);

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

function TodoItem({ item }) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex(listItem => listItem === item);

  const editItemText = event => {
    const newList = [...todoList];
    newList[index] = {
      ...item,
      text: event.target.value,
    };

    setTodoList(newList);
  };

  const toggleItemCompletion = event => {
    const newList = [...todoList];
    newList[index] = {
      ...item,
      isComplete: !item.isComplete,
    };

    setTodoList(newList);
  };

  const deleteItem = event => {
    const newList = [...todoList.slice(0, index), ...todoList.slice(index + 1, todoList.length + 1)];
    setTodoList(newList);
  }

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListilters /> */}
      <TodoItemCreator />
      {
        todoList.map((item => <TodoItem key={item.id} item={item} />))
      }
    </>
  )
}

export default function App() {
  return (
    <div className="app-body">
      <TodoList />
    </div>
  );
}
