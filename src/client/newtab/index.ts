// import UserInformation from "user";
// import { getStorageData } from "@src/utils/storage";
// import { addLayout } from "@client/utils/layout";
// import { addBadge } from "@client/utils/badge";
// import { speak } from "@src/utils/tts";
//
// async function main() {
//   const userData = await getStorageData();
//
//   if (!userData.isConfigured) {
//     showInitializingPage();
//   } else {
//     showHomepage(userData);
//   }
// }
//
// function showHomepage(userInformation: UserInformation) {
//   const linksLayout = addLayout("links");
//   const actionsLayout = addLayout("actions");
//
//   if (!linksLayout || !actionsLayout) {
//     speak(
//       "There was an error while initializing the page. Please try to refresh the page again or reinstall this google extension. If the problem is not solved after refreshing or reinstalling, please contact to us. The email is hi@cattynip.dev."
//     );
//
//     return;
//   }
//
//   userInformation.extra.pinnedLinks.map(pinnedLink => {
//     addBadge(linksLayout, {
//       ...pinnedLink,
//       showTitle: !(userInformation.major.name === "BL" || userInformation.major.name === "CB")
//     });
//   });
// }
//
// function showInitializingPage() {}
//
// main();
