import UserInformation from "user";

export async function getStorageData(): Promise<UserInformation> {
  return (await chrome.storage.sync.get()) as UserInformation;
}

export async function setStorageData(
  modifierFunction: (originalData: UserInformation) => UserInformation
): Promise<UserInformation | false> {
  const originalData = await getStorageData();

  if (!originalData) {
    return false;
  }

  const modifiedData = modifierFunction(originalData);

  await chrome.storage.sync.set({
    tte: modifiedData
  });

  return modifiedData;
}
