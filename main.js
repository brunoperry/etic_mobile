import AudioPlayer from "./components/AudioPlayer.js";
import Controller from "./components/Controller.js";
import Info from "./components/Info.js";
import Menu from "./components/Menu.js";
import RangeBar from "./components/RangeBar.js";

const API_URL = "https://purring-cyclic-jackrabbit.glitch.me/";

let appData;
let audio;

let info;
let controller;
let volumeBar;

window.onload = async () => {
  const req = await fetch(API_URL);
  appData = await req.json();

  setupLayout();
  setupAudio();
};

const setupAudio = () => {
  audio = new AudioPlayer((action) => {
    controller.setState(action);

    if (action === "error") {
      info.update({
        name: audio.currentTrack.name,
        type: "error",
      });
    }
  });
  audio.volume = volumeBar.value;
};

const setupLayout = () => {
  info = new Info("#info", (value) => {
    console.log("info", value);
  });

  controller = new Controller("#controller", (value) => {
    console.log("controller", value);
  });

  volumeBar = new RangeBar("#volume", (value) => {
    console.log("volume", value);
  });

  const menu = new Menu("#menu", async (value) => {
    switch (value.type) {
      case "opening":
        info.close();
        break;
      case "music":
      case "file":
        await audio.play(value, fetchPlaylist(appData, value.id));
        menu.close();
        break;
    }
  });
  menu.data = appData;
};

const fetchPlaylist = (node, itemID) => {
  let item = null;
  for (let i = 0; i < node.length; i++) {
    const n = node[i];
    if (n.children) {
      item = fetchPlaylist(n.children, itemID);
    }
    if (n.id === itemID) {
      item = node;
    }
    if (item) break;
  }
  return item;
};
