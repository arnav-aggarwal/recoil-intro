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

const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All',
});

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case 'Show Completed':
        return list.filter(item => item.isComplete);
      case 'Show Uncompleted':
        return list.filter(item => !item.isComplete);
      default:
        return list;
    }
  }
})

function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  const updateFilter = event => setFilter(event.target.value);

  return (
    <select value={filter} onChange={updateFilter}>
      <option value="Show All">All</option>
      <option value="Show Completed">Completed</option>
      <option value="Show Uncompleted">Uncompleted</option>
    </select>
  )
}

const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState);

    const total = todoList.length;
    const completed = todoList.filter(item => item.isComplete).length;
    const uncompleted = total - completed;
    const percentComplete = total ? (completed / total) * 100 : 0;

    return { total, completed, uncompleted, percentComplete };
  },
})

function TodoListStats() {
  const { total, completed, uncompleted, percentComplete } = useRecoilValue(todoListStatsState);

  return (
    <ul>
      <li>Total items: {total}</li>
      <li>Completed items: {completed}</li>
      <li>Uncompleted items: {uncompleted}</li>
      <li>Percent complete: {percentComplete}%</li>
    </ul>
  );
}

function TodoList() {
  const todoList = useRecoilValue(todoListState);
  const filteredTodoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />
      {filteredTodoList.map((item => <TodoItem key={item.id} item={item} />))}
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
