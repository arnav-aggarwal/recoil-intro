import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import './App.css';

const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

const charCountState = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({get}) => {
    const text = get(textState);

    return text.length;
  },
});

function CharacterCount() {
  /**
    useRecoilValue causes warning:

    index.js:1 Warning: Cannot update a component (`Batcher`) while rendering a different component (`CharacterCount`). To locate the bad setState() call inside `CharacterCount`, follow the stack trace as described in https://fb.me/setstate-in-render
        in CharacterCount (at App.js:54)
        in div (at App.js:52)
        in CharacterCounter (at App.js:63)
        in div (at App.js:62)
        in RecoilRoot (at App.js:61)
        in App (at src/index.js:9)

    in StrictMode (at src/index.js:8)
    console.<computed>	@	index.js:1
    printWarning	@	react-dom.development.js:88
    error	@	react-dom.development.js:60
    warnAboutRenderPhaseUpdatesInDEV	@	react-dom.development.js:23241
    scheduleUpdateOnFiber	@	react-dom.development.js:21165
    dispatchAction	@	react-dom.development.js:15660

    (anonymous)	@	recoil.development.js:905
    replaceState	@	recoil.development.js:1017
    (anonymous)	@	recoil.development.js:566
    trace	@	recoil.development.js:328
    getRecoilValueAsLoadable	@	recoil.development.js:566
    useRecoilValueLoadable	@	recoil.development.js:1388
    useRecoilValue	@	recoil.development.js:1396
    useRecoilValue	@	recoil.development.js:1435
    CharacterCount	@	App.js:56
   */
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
}

function TextInput() {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
}

function CharacterCounter() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <CharacterCounter />
      </div>
    </RecoilRoot>
  );
}

export default App;
