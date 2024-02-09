import Helper from "./helper";

class AudioHelper extends Helper {
  /*
   * 1. Get data of the current web page
   *    The way to gather data is being discussed
   *    - copying the document.body.innerText value
   *    - copying the whole html file
   *    - capturing an image of a page
   *    - recording the whole page.
   *
   * 2. Use AI
   *    - providing data
   *    - providing options of actions
   *
   * 3. Conversation
   *    After analyzing everything, the users will have a conversation with the AI constantly
   *    - access to the audio and listening permission
   *    - sending a request to AI every time it seems like the user stops talking
   */

  constructor() {
    super();
  }
}

export default AudioHelper;
