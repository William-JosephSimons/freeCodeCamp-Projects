const { Provider, useSelector, useDispatch } = ReactRedux;
const { createStore } = Redux;
const { useEffect, useRef } = React;

const START_STOP = "START_STOP";
const RESET = "RESET";
const TICK = "TICK";
const ADJUST_TIME = "ADJUST_TIME";

const initialState = {
  time: 25 * 60,
  setTime: 25 * 60,
  breakTime: 5 * 60,
  setBreak: 5 * 60,
  isBreak: false,
  isPlaying: false,
};

const startStopAction = () => ({ type: START_STOP });
const resetAction = () => ({ type: RESET });
const tickAction = (setTimer, timer) => ({
  type: TICK,
  payload: { setTimer, timer },
});
const adjustTimeAction = (setTimer, timer, time) => ({
  type: ADJUST_TIME,
  payload: { setTimer, timer, time },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_STOP:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case RESET:
      return {
        ...state,
        isPlaying: false,
        time: state.setTime,
        breakTime: state.setBreak,
        isBreak: false,
      };
    case TICK:
      if (state[action.payload.timer] <= 0) {
        return {
          ...state,
          isBreak: !state.isBreak,
          [action.payload.timer]: state[action.payload.setTimer],
        };
      }
      return {
        ...state,
        [action.payload.timer]: state[action.payload.timer] - 1,
      };
    case ADJUST_TIME:
      return action.payload.time > 0 && action.payload.time <= 60 * 60
        ? {
            ...state,
            [action.payload.setTimer]: action.payload.time,
            [action.payload.timer]: action.payload.time,
          }
        : state;
    default:
      return state;
  }
};

const store = createStore(reducer);

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const IconPlus = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconMinus = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const App = () => {
  const { time, setTime, breakTime, setBreak, isBreak, isPlaying } =
    useSelector((state) => state);
  const dispatch = useDispatch();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleStartStop = () => {
    dispatch(startStopAction());
  };

  const handleReset = () => {
    if (beepSound.current) {
      beepSound.current.pause();
      beepSound.current.currentTime = 0;
    }
    dispatch(resetAction());
  };

  const handleTick = (setTimer, timer) => {
    dispatch(tickAction(setTimer, timer));
  };

  const handleAdjustTime = (setTimer, timer, time) => {
    dispatch(adjustTimeAction(setTimer, timer, time));
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        handleTick(
          isBreak ? "setBreak" : "setTime",
          isBreak ? "breakTime" : "time"
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isBreak]);

  const beepSound = useRef(null);

  useEffect(() => {
    if (time <= 0 || breakTime <= 0) {
      beepSound.current.play();
    }
  }, [time, breakTime]);

  const timerClass = `timer-wrapper ${isBreak ? "break-mode" : ""} ${
    time < 60 || breakTime < 60 ? "danger-mode" : ""
  }`;

  return (
    <div className="clock-container">
      <div className="app-title">Pomodoro Timer</div>

      <div className="settings-wrapper">
        <div className="setting-card">
          <h2 id="break-label" className="label">
            Break Length
          </h2>
          <div className="control-group">
            <button
              id="break-decrement"
              disabled={isPlaying}
              onClick={() =>
                handleAdjustTime("setBreak", "breakTime", setBreak - 60)
              }
              aria-label="Decrease Break Time"
            >
              <IconMinus />
            </button>
            <span id="break-length" className="length-display">
              {setBreak / 60}
            </span>
            <button
              id="break-increment"
              disabled={isPlaying}
              onClick={() =>
                handleAdjustTime("setBreak", "breakTime", setBreak + 60)
              }
              aria-label="Increase Break Time"
            >
              <IconPlus />
            </button>
          </div>
        </div>

        <div className="setting-card">
          <h2 id="session-label" className="label">
            Session Length
          </h2>
          <div className="control-group">
            <button
              id="session-decrement"
              disabled={isPlaying}
              onClick={() => handleAdjustTime("setTime", "time", setTime - 60)}
              aria-label="Decrease Session Time"
            >
              <IconMinus />
            </button>
            <span id="session-length" className="length-display">
              {setTime / 60}
            </span>
            <button
              id="session-increment"
              disabled={isPlaying}
              onClick={() => handleAdjustTime("setTime", "time", setTime + 60)}
              aria-label="Increase Session Time"
            >
              <IconPlus />
            </button>
          </div>
        </div>
      </div>

      <div className={timerClass}>
        <h1 id="timer-label">{isBreak ? "Break Time" : "Session"}</h1>
        <h2 id="time-left">{formatTime(isBreak ? breakTime : time)}</h2>
      </div>

      <div className="controls-wrapper">
        <button id="start_stop" className="btn-large" onClick={handleStartStop}>
          {isPlaying ? "Pause" : "Start"}
        </button>
        <button id="reset" className="btn-large" onClick={handleReset}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        ref={beepSound}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
