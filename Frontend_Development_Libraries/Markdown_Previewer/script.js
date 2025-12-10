const { createStore } = Redux;
const { Provider, useSelector, useDispatch } = ReactRedux;

const INPUT = "INPUT";

const inputAction = (input) => {
  return {
    type: INPUT,
    payload: input,
  };
};

const initialState = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)`;

const inputReducer = (state = initialState, action) => {
  switch (action.type) {
    case INPUT:
      return action.payload;
    default:
      return state;
  }
};

const store = createStore(inputReducer);

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MarkdownPreviewer />
      </Provider>
    );
  }
}

const MarkdownPreviewer = () => {
  const input = useSelector((state) => state);
  const parsedInput = marked.parse(input, { breaks: true });
  const dispatch = useDispatch();

  const handleInput = (e) => {
    dispatch(inputAction(e.target.value));
  };

  return (
    <React.Fragment>
      <div className="panel editor-wrap">
        <h1 className="toolbar">Editor</h1>
        <textarea onChange={handleInput} id="editor" value={input}></textarea>
      </div>

      <div className="panel preview-wrap">
        <h2 className="toolbar">Previewer</h2>
        <div
          id="preview"
          dangerouslySetInnerHTML={{ __html: parsedInput }}
        ></div>
      </div>
    </React.Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
