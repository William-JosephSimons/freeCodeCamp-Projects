const { Provider, useSelector, useDispatch } = ReactRedux;
const { createStore } = Redux;

const ADD_DIGIT = "ADD_DIGIT";
const ADD_OPERATOR = "ADD_OPERATOR";
const ADD_DECIMAL = "ADD_DECIMAL";
const CLEAR = "CLEAR";
const EQUAL = "EQUAL";

const initialState = {
  displayValue: "0",
  currentNumber: "0",
  currentOperator: "",
};

const addDigitAction = (digit) => {
  return {
    type: ADD_DIGIT,
    payload: digit,
  };
};

const addOperatorAction = (operator) => {
  return {
    type: ADD_OPERATOR,
    payload: operator,
  };
};

const addDecimalAction = () => {
  return {
    type: ADD_DECIMAL,
  };
};

const clearAction = () => {
  return {
    type: CLEAR,
  };
};

const equalAction = () => {
  return {
    type: EQUAL,
  };
};

const calculatorReducer = (state = initialState, action) => {
  if (
    !state.currentNumber.startsWith("0") ||
    state.currentNumber.startsWith("0.")
  ) {
    switch (action.type) {
      case ADD_DIGIT:
        return {
          ...state,
          displayValue: state.displayValue + action.payload,
          currentNumber: state.currentNumber + action.payload,
          currentOperator: "",
        };
      case ADD_OPERATOR:
        switch (true) {
          case state.currentOperator.length >= 2:
            return {
              ...state,
              displayValue: state.displayValue.slice(0, -2) + action.payload,
              currentNumber: "",
              currentOperator: action.payload,
            };
          case state.currentOperator && action.payload === "-":
            return {
              ...state,
              displayValue: state.displayValue + "-",
              currentNumber: "",
              currentOperator: state.currentOperator + action.payload,
            };
          case state.currentOperator !== "":
            return {
              ...state,
              displayValue: state.displayValue.slice(0, -1) + action.payload,
              currentNumber: "",
              currentOperator: action.payload,
            };
          default:
            return {
              ...state,
              displayValue: state.displayValue + action.payload,
              currentNumber: "",
              currentOperator: action.payload,
            };
        }
      default:
        break;
    }
  }
  switch (action.type) {
    case ADD_DIGIT:
      return {
        ...state,
        displayValue: state.displayValue.slice(0, -1) + action.payload,
        currentNumber: state.currentNumber.slice(0, -1) + action.payload,
        currentOperator: "",
      };
    case ADD_DECIMAL:
      if (state.currentOperator) {
        return {
          ...state,
          displayValue: state.displayValue + "0.",
          currentNumber: "0.",
          currentOperator: "",
        };
      }
      return {
        ...state,
        displayValue: state.displayValue + ".",
        currentNumber: state.currentNumber + ".",
        currentOperator: "",
      };
    case CLEAR:
      return {
        ...state,
        displayValue: "0",
        currentNumber: "0",
        currentOperator: "",
      };
    case EQUAL:
      try {
        const displayValue = eval(state.displayValue);
        if (Math.abs(displayValue) === Infinity || Number.isNaN(displayValue)) {
          return {
            ...state,
            displayValue: "Error",
            currentNumber: "Error",
            currentOperator: "",
          };
        }
        return {
          ...state,
          displayValue: String(displayValue),
          currentNumber: String(displayValue),
          currentOperator: "",
        };
      } catch (error) {
        console.log(error);
        return {
          ...state,
          displayValue: "Error",
          currentNumber: "Error",
          currentOperator: "",
        };
      }
    default:
      return state;
  }
};

const store = createStore(calculatorReducer);

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <Calculator />
    </Provider>
  );
};

const Calculator = () => {
  const displayValue = useSelector((state) => state.displayValue);
  const currentNumber = useSelector((state) => state.currentNumber);
  const dispatch = useDispatch();

  const handleAddDigit = (digit) => {
    dispatch(addDigitAction(digit));
  };

  const handleAddOperator = (operator) => {
    dispatch(addOperatorAction(operator));
  };

  const handleAddDecimal = () => {
    dispatch(addDecimalAction());
  };

  const handleClear = () => {
    dispatch(clearAction());
  };

  const handleEqual = () => {
    dispatch(equalAction());
  };

  const handleButtonPress = (buttonValue) => {
    switch (buttonValue) {
      case "C":
        handleClear();
        break;
      case "=":
        handleEqual();
        break;
      case ".":
        if (currentNumber.includes(".")) {
          return;
        }
        handleAddDecimal();
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        handleAddOperator(buttonValue);
        break;
      default:
        if (displayValue === "Error") {
          handleClear();
        }
        handleAddDigit(buttonValue);
        break;
    }
  };

  return (
    <div className="calculator-app">
      <h1>JavaScript Calculator</h1>
      <Display displayValue={displayValue} currentNumber={currentNumber} />
      <ButtonPanel handleButtonPress={handleButtonPress} />
    </div>
  );
};

const Display = ({ displayValue, currentNumber }) => {
  return (
    <div className="display-screen">
      <div id="currentNumber">
        <strong>Hist:</strong>
        <span>{currentNumber}</span>
      </div>
      <div id="display">{displayValue}</div>
    </div>
  );
};

const ButtonPanel = ({ handleButtonPress }) => {
  return (
    <div className="button-panel">
      <button id="clear" onClick={() => handleButtonPress("C")}>
        AC
      </button>
      <button id="equals" onClick={() => handleButtonPress("=")}>
        =
      </button>
      <button id="divide" onClick={() => handleButtonPress("/")}>
        /
      </button>
      <button id="multiply" onClick={() => handleButtonPress("*")}>
        ×
      </button>
      <button id="subtract" onClick={() => handleButtonPress("-")}>
        -
      </button>
      <button id="add" onClick={() => handleButtonPress("+")}>
        +
      </button>
      <button id="decimal" onClick={() => handleButtonPress(".")}>
        .
      </button>
      <button id="zero" onClick={() => handleButtonPress("0")}>
        0
      </button>
      <button id="one" onClick={() => handleButtonPress("1")}>
        1
      </button>
      <button id="two" onClick={() => handleButtonPress("2")}>
        2
      </button>
      <button id="three" onClick={() => handleButtonPress("3")}>
        3
      </button>
      <button id="four" onClick={() => handleButtonPress("4")}>
        4
      </button>
      <button id="five" onClick={() => handleButtonPress("5")}>
        5
      </button>
      <button id="six" onClick={() => handleButtonPress("6")}>
        6
      </button>
      <button id="seven" onClick={() => handleButtonPress("7")}>
        7
      </button>
      <button id="eight" onClick={() => handleButtonPress("8")}>
        8
      </button>
      <button id="nine" onClick={() => handleButtonPress("9")}>
        9
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
