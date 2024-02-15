import { getStorageData } from "@src/utils/storage";
import App from "./app";

window.onload = async () => {
  const userData = await getStorageData();

  new App(userData);
};
