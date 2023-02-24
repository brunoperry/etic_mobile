import Button from "./Button.js";
import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class AudioController extends Component {
  static States = {
    PREVIOUS: "previous",
    PAUSE: "pause",
    PLAY: "play",
    NEXT: "next",
    LOADING: "loading",
  };

  currentState = AudioController.States.PAUSE;

  #actionsButton;

  constructor(elemID) {
    super(elemID);

    const previousButton = new Button("#previous-button");
    previousButton.onClick = () => {
      this.callback(AudioController.States.PREVIOUS);
    };

    this.#actionsButton = new ToggleButton("#action-button");
    this.#actionsButton.onClick = () => {
      if (this.currentState === AudioController.States.LOADING) return;

      // this.callback(this.currentState);
      this.currentState === AudioController.States.PAUSE
        ? this.callback(AudioController.States.PLAY)
        : this.callback(AudioController.States.PAUSE);
    };

    const nextButton = new Button("#next-button");
    nextButton.onClick = () => this.callback(AudioController.States.NEXT);
  }

  updateState(state) {
    this.currentState = state;
    switch (state) {
      case AudioController.States.PAUSE:
        this.#actionsButton.toggle(1);
        this.currentState = AudioController.States.PLAY;
        break;
      case AudioController.States.PLAY:
        this.#actionsButton.toggle(0);
        this.currentState = AudioController.States.PAUSE;
        break;
      case AudioController.States.LOADING:
        this.#actionsButton.toggle(2);
        this.currentState = AudioController.States.LOADING;
        break;
    }
  }

  get onchange() {
    return this.callback;
  }
  set onchange(callback) {
    this.callback = callback;
  }
}
