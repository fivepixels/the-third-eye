export function speak(content: string) {
  chrome.tts.speak(content, {
    lang: "en",
    rate: 1.5,
    gender: "male" // WARN: Male does not work
  });
}
