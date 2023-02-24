// import Component from "./Component.js";

// export default class SliderBar extends Component {
//   #rangeInput;
//   #rangeBar;
//   constructor(rangeID = null) {
//     super(rangeID);

//     this.#rangeInput = this.#rangeContainer.querySelector("input[type='range']");
//     this.#rangeBar = this.#rangeContainer.querySelector(".range-bar");

//     this.#rangeInput.addEventListener("input", () => {
//       this.#rangeBar.style.transform = `scaleX(${this.#rangeInput.value / 100})`;
//     });
//   }
// }

import Component from "./Component.js";

export default class RangeSlider extends Component {
  #rangeInput;
  #rangeBar;
  constructor(rangeID) {
    super(rangeID);

    this.#rangeInput = this.getElement("input[type='range']");
    this.#rangeBar = this.getElement(".range-bar");

    this.value = this.#rangeInput.value;
    this.#rangeInput.oninput = () => {
      this.#drawBar();
      this.callback();
    };
  }

  #drawBar() {
    this.#rangeBar.style.transform = `scaleX(${
      this.#rangeInput.value / this.#rangeInput.max
    })`;
  }

  get onchange() {
    return this.callback;
  }
  set onchange(cb) {
    this.callback = cb;
  }

  get value() {
    return parseFloat(this.#rangeInput.value);
  }
  set value(val) {
    this.#rangeInput.value = val;
    this.#drawBar();
  }
}
