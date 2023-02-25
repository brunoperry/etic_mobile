import express from "express";

import fs from "fs";
import util from "util";
import path from "path";
const __dirname = path.resolve();
const writeFileAsync = util.promisify(fs.writeFile);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdWJ9z2NyUiIBOq33gDwwVvVe9wrW71NA",
  authDomain: "web-development-etic.firebaseapp.com",
  projectId: "web-development-etic",
  storageBucket: "web-development-etic.appspot.com",
  messagingSenderId: "564746533143",
  appId: "1:564746533143:web:56f8e2826478009d975f52",
  measurementId: "G-K38DNHDBP5",
};

// Initialize Firebase
const fire_app = initializeApp(firebaseConfig);
const database = getFirestore(fire_app);
const storage = getStorage();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("/reset", async (req, res) => {
  const radios = await getRadios();
  const music = await getMusic(ref(storage, ""));
  const dataOut = [
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
    {
      type: "reset",
      name: "reset",
    },
  ];

  try {
    const publicDirPath = path.join(__dirname, "public");
    const filePath = path.join(publicDirPath, "/app_data.json");
    await writeFileAsync(filePath, JSON.stringify(dataOut));
    res.json(dataOut);
  } catch (error) {
    res.json([{ error: error }]);
  }
});
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

//API Firebase
const getRadios = async () => {
  const querySnapshot = await getDocs(collection(database, "music"));
  const radios = [];
  querySnapshot.forEach((doc) => {
    radios.push({ ...doc.data(), id: `radios/${doc.data().name}`, type: "music" });
  });
  return radios;
};
const getMusic = async (ref) => {
  let resultObj = {
    children: [],
  };
  const result = await listAll(ref);
  const itemsPromises = result.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const itemID = itemRef.fullPath.split("/");
    itemID.pop();
    resultObj.children.push({
      id: `music/${itemRef.fullPath}`,
      type: "file",
      name: itemRef.name.replace(".mp3", ""),
      url: url,
    });
  });
  const prefixesPromises = result.prefixes.map(async (subfolderRef) => {
    const subfolderObj = await getMusic(subfolderRef);
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
};
