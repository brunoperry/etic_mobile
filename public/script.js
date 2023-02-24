// import SliderBar from "./components/SlideBar.js";

// window.onload = () => {
//   const volumeBar = new SliderBar("#volume");
//   const scrub = new SliderBar("#scrub");
// };

import Info from "./components/Info.js";
import AudioController from "./components/Controller.js";
import RangeSlider from "./components/RangeSlider.js";
import Menu from "./components/Menu.js";

//Firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import {
  getStorage,
  listAll,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
import AudioPlayer from "./components/AudioPlayer.js";

export const Globals = {
  SPEED: null,
};

let appData = null;
let audioPlayer = null;
let info = null;
let audioController = null;
let volumeBar = null;
let menu = null;
let fileInput = null;

window.onload = async () => {
  Globals.SPEED = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--speed")
      .replace("s", "")
  );

  await initialize();
  setupLayout();
  setupAudio();
};

const initialize = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    throw new Error("No PWA Support! Try another browser.");
    return;
  }

  try {
    const request = "app_data.json";
    const cache = await caches.open("app-cache");
    const response = await cache.match(request);

    if (response) {
      appData = await response.json();
    } else {
      const networkResponse = await fetch(request);
      console.log("Response from network:", networkResponse);

      await cache.put(request, networkResponse.clone());

      appData = await networkResponse.json();
    }
  } catch (error) {
    console.error("Error fetching from cache or network:", error);
  }

  // music app model creating:
  // const fb = new Firebase();
  // appData = await fb.initialize();
  // console.log(JSON.stringify(appData));

  // const req = await fetch("app_data.json");
  // appData = await req.json();
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((event) => {
    switch (event) {
      case AudioPlayer.Events.PLAY:
        audioController.updateState(AudioController.States.LOADING);
        info.update(audioPlayer.track);
        break;
      case AudioPlayer.Events.PLAYING:
        audioController.updateState(AudioController.States.PAUSE);
        break;
      case AudioPlayer.Events.PAUSE:
      case AudioPlayer.Events.ENDED:
        audioController.updateState(AudioController.States.PLAY);
        break;
      default:
        break;
    }
  });
  audioPlayer.volume = volumeBar.value;
};
const setupLayout = () => {
  info = new Info("#info");
  info.onchange = (action) => {
    // console.log("info", action);
  };

  audioController = new AudioController("#controller");
  audioController.onchange = (action) => {
    switch (action) {
      case AudioController.States.PLAY:
        if (audioPlayer.track) {
          audioPlayer.play(audioPlayer.track);
        } else {
          menu.open();
        }
        break;
      case AudioController.States.PAUSE:
        audioPlayer.pause();
        break;
      case AudioController.States.NEXT:
        audioPlayer.next();
        break;
      case AudioController.States.PREVIOUS:
        audioPlayer.previous();
        break;
      default:
        break;
    }
  };
  volumeBar = new RangeSlider("#volume");
  volumeBar.onchange = () => {
    audioPlayer.volume = volumeBar.value;
  };

  /**
   * builds the menu component
   */
  menu = new Menu("#menu", appData);
  menu.onchange = async (action, data = null) => {
    switch (action) {
      case "opened":
        info.close();
        break;
      case "clicked":
        menu.close();
        switch (data.type) {
          case "music":
          case "radio":
          case "file":
            await audioPlayer.play(
              data,
              fetchPlaylist(appData, data.id) || { children: [] }
            );
            break;
          case "open":
            document.querySelector("#file-input").click();
            break;
        }
        break;
    }
  };

  /**
   * builds the file input component
   */
  fileInput = document.querySelector("#file-input");
  fileInput.onchange = async () => {
    const files = Array.from(fileInput.files);
    const localPlaylist = [];
    files.forEach((file) => {
      localPlaylist.push({
        id: file.name,
        name: file.name,
        url: URL.createObjectURL(file),
      });
    });

    await audioPlayer.play(localPlaylist[0], localPlaylist);
  };
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

class Firebase {
  database;
  storage;
  constructor() {
    // Initialize Firebase
    const app = initializeApp({
      apiKey: "AIzaSyAdWJ9z2NyUiIBOq33gDwwVvVe9wrW71NA",
      authDomain: "web-development-etic.firebaseapp.com",
      projectId: "web-development-etic",
      storageBucket: "web-development-etic.appspot.com",
      messagingSenderId: "564746533143",
      appId: "1:564746533143:web:56f8e2826478009d975f52",
      measurementId: "G-K38DNHDBP5",
    });
    this.database = getFirestore(app);
    this.storage = getStorage();
  }

  async initialize() {
    const radios = await this.#getRadios();

    const rootRef = ref(this.storage, "");
    const music = await this.#listAllMusic(rootRef);
    return [
      {
        id: "radios",
        type: "folder",
        name: "radios",
        children: radios,
      },
      {
        id: "music",
        type: "folder",
        name: "music",
        children: music.children,
      },
      {
        type: "open",
        name: "open...",
      },
    ];
  }

  async #getRadios() {
    const querySnapshot = await getDocs(collection(this.database, "music"));
    const radios = [];
    querySnapshot.forEach((doc) => {
      radios.push({ ...doc.data(), id: `radios/${doc.data().name}`, type: "music" });
    });
    return radios;
  }

  async #listAllMusic(folderRef) {
    let resultObj = {
      children: [],
    };
    const result = await listAll(folderRef);

    const itemsPromises = await result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const itemID = itemRef.fullPath.split("/");
      itemID.pop();
      resultObj.children.push({
        // id: `music/${itemID.join("/")}`,
        id: `music/${itemRef.fullPath}`,
        type: "file",
        name: itemRef.name.replace(".mp3", ""),
        url: url,
      });
    });
    const prefixesPromises = await result.prefixes.map(async (subfolderRef) => {
      const subfolderObj = await this.#listAllMusic(subfolderRef);
      const deconstruct = subfolderRef.fullPath.split("/");
      resultObj.children.push({
        id: `music/${subfolderRef.fullPath}`,
        type: "folder",
        name: deconstruct[deconstruct.length - 1],
        children: subfolderObj.children.length > 0 ? subfolderObj.children : subfolderObj,
      });
    });

    await Promise.all([...itemsPromises, ...prefixesPromises]);
    return resultObj;
  }
}
