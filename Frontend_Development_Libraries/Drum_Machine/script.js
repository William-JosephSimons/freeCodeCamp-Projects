const { useRef, useEffect, useState } = React;

const DRUM_SOUNDS = [
  {
    key: "Q",
    name: "Heater 1",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3",
  },
  {
    key: "W",
    name: "Heater 2",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3",
  },
  {
    key: "E",
    name: "Heater 3",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3",
  },
  {
    key: "A",
    name: "Heater 4",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3",
  },
  {
    key: "S",
    name: "Clap",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3",
  },
  {
    key: "D",
    name: "Open HH",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3",
  },
  {
    key: "Z",
    name: "Kick Hat",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3",
  },
  {
    key: "X",
    name: "Kick",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3",
  },
  {
    key: "C",
    name: "Closed HH",
    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3",
  },
];

const App = () => {
  const audioCtxRef = useRef(null);
  const soundBuffersRef = useRef({});
  const [currentSound, setCurrentSound] = useState("");

  useEffect(() => {
    audioCtxRef.current = new AudioContext();
    const loadAudio = async () => {
      const audioBuffers = await Promise.all(
        DRUM_SOUNDS.map(async (sound) => {
          const response = await fetch(sound.src);
          const arrayBuffer = await response.arrayBuffer();
          return audioCtxRef.current.decodeAudioData(arrayBuffer);
        })
      );
      audioBuffers.forEach((buffer, index) => {
        soundBuffersRef.current[DRUM_SOUNDS[index].key] = buffer;
      });
    };
    loadAudio();

    document.addEventListener("keydown", (event) => {
      const sound = DRUM_SOUNDS.find(
        (sound) =>
          sound.key === event.key || sound.key.toLowerCase() === event.key
      );
      if (sound) {
        handleButtonPress(sound.key, sound.name);
      }
    });
  }, []);

  const handleButtonPress = (key, soundName) => {
    const audioCtx = audioCtxRef.current;
    const source = audioCtx.createBufferSource();
    source.buffer = soundBuffersRef.current[key];
    source.connect(audioCtx.destination);
    source.start(0);
    setCurrentSound(soundName);

    const btnId = soundName.replace(/\s/g, "-").toLowerCase();
    const btnElement = document.getElementById(btnId);

    btnElement.classList.add("active");
    setTimeout(() => btnElement.classList.remove("active"), 100);

    source.addEventListener("ended", () => {
      source.disconnect();
      source.buffer = null;
    });
  };

  return (
    <div id="drum-machine">
      <h1>Drum Machine</h1>
      <div id="display-container">
        <Display currentSound={currentSound} />
      </div>
      <div className="pad-container">
        {DRUM_SOUNDS.map((sound) => (
          <button
            key={sound.key}
            onClick={() => handleButtonPress(sound.key, sound.name)}
            className="drum-pad"
            id={sound.name.replace(/\s/g, "-").toLowerCase()}
          >
            {sound.key}
          </button>
        ))}
      </div>
    </div>
  );
};

const Display = ({ currentSound }) => {
  return <p id="display">{currentSound || "READY!"}</p>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
