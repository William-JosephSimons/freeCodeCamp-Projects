const { useEffect, useState } = React;
const { createStore, applyMiddleware } = Redux;
const { Provider, useSelector, useDispatch } = ReactRedux;

const NEXT_QUOTE = "NEXT_QUOTE";
const LOADING = "LOADING";

const nextQuote = () => {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
    });

    const quoteData = await fetchQuoteData("https://thequoteshub.com/api/");

    dispatch({
      type: NEXT_QUOTE,
      payload: quoteData,
    });
  };
};

const quoteReducer = (
  state = { text: "", author: "", isLoading: true },
  action
) => {
  switch (action.type) {
    case NEXT_QUOTE:
      const { text, author } = action.payload;
      return { text, author, isLoading: false };
    case LOADING:
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

const store = createStore(quoteReducer, applyMiddleware(ReduxThunk));

const fetchQuoteData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

const Quote = () => {
  const text = useSelector((state) => state.text);
  const author = useSelector((state) => state.author);
  const isLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();
  const PALETTE = [
    "#6c5ce7",
    "#00b894",
    "#fdcb6e",
    "#0984e3",
    "#e17055",
    "#00cec9",
  ];

  const [accent, setAccent] = useState(PALETTE[0]);

  useEffect(() => {
    dispatch(nextQuote());
  }, []);

  useEffect(() => {
    if (!isLoading && text) {
      const next = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      setAccent(next);
    }
  }, [text, isLoading]);

  return (
    <main
      id="quote-box"
      role="article"
      aria-labelledby="text"
      style={{ ["--accent-1"]: accent }}
    >
      {isLoading ? (
        <div
          aria-busy="true"
          aria-live="polite"
          style={{ gap: 12, display: "grid" }}
        >
          <span className="skeleton" style={{ width: "92%", height: 26 }} />
          <span className="skeleton" style={{ width: "68%", height: 20 }} />
        </div>
      ) : (
        <div>
          <p id="text" aria-live="polite">
            {text}
          </p>
          <p id="author">— {author}</p>
        </div>
      )}

      <div id="buttons" role="group" aria-label="Quote actions">
        <button
          id="new-quote"
          onClick={() => dispatch(nextQuote())}
          aria-label="Load next quote"
          title="Next quote"
          style={{
            background: `${accent}`,
          }}
        >
          Next Quote
        </button>

        <a
          id="tweet-quote"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}%20-%20${encodeURIComponent(author)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this quote on Twitter"
          title="Tweet this quote"
        >
          Tweet Quote
        </a>
      </div>
    </main>
  );
};

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Quote />
      </Provider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
