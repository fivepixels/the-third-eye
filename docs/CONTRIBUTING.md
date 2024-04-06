# CONTRIBUTING

## HOW TO CONTRIBUTE

1. Cloning This Project

   To test and develop this project, you will first have to clone this repository by running this command below in the directory where you want to clone this project. However, you may clone the repository that you forked from this project, so it is on you.

   ```
   git clone https://github.com/fivepixels/the-third-eye
   ```

2. Adding Changes

   There are no specific rules to follow, but it is recommended to follow the general style of the rest of the codes. Not only that, but you will also have to run the `npm run format` command to format the whole code.

3. Pushing Changes

   If you are done with your code and make a commit for your change, you will have to apply those changes to the real production. You can make a pull request between your forked repository and this repository by simply clicking on [here](https://github.com/fivepixels/the-third-eye/compare).

4. Merging

   For your code to be merged into the final product, it is going to take a couple of days for me to check if your changes need to be merged into this repository. If there are some questions from me or other members on the pull request you created, please answer them with kindness. And, if the changes are merged, tada-🎉, you just contributed to this project. Thank you!

## HOW TO TEST

1. Go to [`chrome://extension`](chrome://extension). (you may have to copy and paste this link manually.)
2. Turn on the `Developer Mode`.
3. Run the `npm run dev` command on another session. Since this command will watch the changes and automatically rebuild the whole project, so this command will have to be executed in the background during development.
4. Click the `Load unpacked` button and select the root directory of this project. The selected folder should have a file called [`manifest.json`](https://developer.chrome.com/docs/extensions/reference/manifest).
5. Click on the reload icon button **every time you add changes to any files.**

## Tips

- There are two main concepts in the Google Chrome Extention Development: `Service Worker` and `Content Scripts`. Service Workers are like servers, while content scripts are like little scripts that have a similar effect as running JavaScript code in the console. All TypeScript files that are responsible for `Service Worker` is located inside of the folder `[root]/src/core/sw`, and all typescript files for `Content Scripts` are placed `[root]/src/core/cs`.
- All TypeScript files that are in `[root]/shapes` are for types. You can make any types there and make new files as needed and import them to the files inside of the `[root]/src/core`.
- You have to know that this is for blind people, which means the more you add on the front end side, the more complex and harder it will get for users to use. So, focus on implementing features rather than adding decorations.
