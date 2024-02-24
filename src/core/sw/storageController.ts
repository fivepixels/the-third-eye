import user from "@src/shapes/user";

type CachedInformation<T> = T | undefined;

class StorageManager<T> {
  private cachedInformation: CachedInformation<T>;

  constructor(initialize: boolean) {
    this.cachedInformation = undefined;

    if (initialize) this.init();
  }

  private init() {
    this.getUser();
  }

  public async getUser(): Promise<false | user> {
    const userInformation = await chrome.storage.sync.get();

    return userInformation as user;
  }

  public getCachedUser(): CachedInformation<T> {
    return this.cachedInformation;
  }
}

export default StorageManager;
