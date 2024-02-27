import StorageManager from "./managers/storageManager";

class App {
  private storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
  }

  public async init() {
    const asdf = await this.storageManager.getUser();
    console.log(asdf);
  }
}

export default App;
