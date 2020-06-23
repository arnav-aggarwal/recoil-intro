import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import './App.css';

const textState = atom({ // piece of state
  key: 'textState',
  default: '',
});

const TextInput = () => {
  const [text, setText] = useRecoilState(textState);
  const onChange = event => setText(event.target.value);

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  )
};

const charCountState = selector({ // transforms state
  key: 'charCountState',
  get: ({ get }) => get(textState).length,
});

const CharacterCount = () => {
  const count = useRecoilValue(charCountState);
  return <>CharacterCount: {count}</>;
}

const CharacterCounter = () => (
  <div>
    <TextInput />
    <CharacterCount />
  </div>
);

function App() {
  return (
    <RecoilRoot>
      <div className="app-body">
        <CharacterCounter />
      </div>
    </RecoilRoot>
  );
}

export default App;
