import { addLayout } from "./utils/domController";
import { addBadge } from "./utils/badge";
import { getStorageData } from "@src/utils/storage";
import { speak } from "@src/utils/tts";

async function start() {
  const linksBox = addLayout("links", "Links");
  const actionsBox = addLayout("actions", "Actions");

  if (!linksBox || !actionsBox) {
    speak(
      "There was an error while initializing the homepage. Try to refresh or reinstall this extension again. If the problem is not solved after refresing or reinstalling, please contact to my email. Email is hi@cattynip.dev."
    );

    return;
  }

  const data = await getStorageData();

  if (!data) {
    console.log(data);
    speak("There was an error while getting your data. Would you like to initializ right now?");

    return;
  }

  addBadge(linksBox, {
    url: "https://youtube.com/",
    title: "YouTube",
    showTitle: true,
    backgroundColor: "red", // TODO: adjust the value of the color of the badge based on the colour blindness' information
    size: 100 // TODO: adjust the value of the size based on the bluriness' degree
  });
}

start();
