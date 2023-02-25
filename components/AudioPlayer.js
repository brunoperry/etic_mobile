export default class AudioPlayer {
  #audio;
  #playlist = [];
  #track = null;
  constructor(data) {
    this.#audio = new Audio();
  }

  play() {}

  pause() {}
}
