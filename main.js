import AudioPlayer from "./components/AudioPlayer.js";
import Controller from "./components/Controller.js";
import Info from "./components/Info.js";
import Menu from "./components/Menu.js";
import RangeBar from "./components/RangeBar.js";

let appData;
let audioPlayer;

let info;
let controller;
let volumeBar;
let menu;

window.onload = async () => {
  const req = await fetch("app_data.json");
  appData = await req.json();

  setupLayout();
  setupAudio();
};

const setupLayout = () => {
  info = new Info("#info", (value) => {
    console.log("info", value);
  });

  controller = new Controller("#controller", (action) => {
    switch (action) {
      case "play":
        audioPlayer.currentTrack ? audioPlayer.play() : menu.open();
        break;
      case "pause":
        audioPlayer.pause();
        break;
      case "next":
        audioPlayer.next();
        break;
      case "previous":
        audioPlayer.previous();
        break;
    }
  });

  volumeBar = new RangeBar("#volume", (value) => {
    audioPlayer.volume = value;
  });

  menu = new Menu("#menu", async (value) => {
    switch (value.type) {
      case "opening":
        info.close();
        break;
      case "music":
      case "file":
        menu.close();
        await audioPlayer.play(value, fetchPlaylist(appData, value.id));
        break;
      case "open":
        document.querySelector("#file-input").click();
        break;
    }
  });
  menu.data = appData;

  const fileInput = document.querySelector("#file-input");
  fileInput.onchange = async () => {
    const localPlaylist = [];
    Array.from(fileInput.files).forEach((file) => {
      localPlaylist.push({
        id: file.name,
        name: file.name,
        url: URL.createObjectURL(file),
      });
    });
    menu.close();
    await audioPlayer.play(localPlaylist[0], localPlaylist);
  };
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((action, error = null) => {
    controller.setState(action);

    switch (action) {
      case "error":
        info.update({
          name: audioPlayer.currentTrack.name,
          type: "error",
          error: error,
        });
        break;
      case "play":
        menu.setTrail(audioPlayer.currentTrack.id.split("/"));
        break;

      default:
        break;
    }
    if (action !== "error") {
      info.update(audioPlayer.currentTrack);
    }
  });
  audioPlayer.volume = volumeBar.value;
};

const fetchPlaylist = (node, itemID) => {
  let item = null;
  for (let i = 0; i < node.length; i++) {
    const n = node[i];
    if (n.children) item = fetchPlaylist(n.children, itemID);
    else if (n.id === itemID) item = node;

    if (item) break;
  }
  return item;
};
