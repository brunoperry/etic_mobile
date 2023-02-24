import { Globals } from "../script.js";
import ListButton from "./ListButton.js";
import PopContent from "./PopContent.js";
import ToggleButton from "./ToggleButton.js";

export default class Menu extends PopContent {
  #listsContainer;
  #currentList = -1;
  #menuData;
  #menuButton;
  constructor(elemID, data = []) {
    super(elemID);
    this.#menuData = data;

    this.#menuButton = new ToggleButton("#menu-button");
    this.#menuButton.onClick = () => (!this.isOpened ? this.open() : this.close());

    this.#listsContainer = this.getElement(".content");
  }

  #addList(data) {
    const ul = document.createElement("ul");
    data.forEach((item) => {
      const li = new ListButton(item);
      li.onClick = () => {
        if (li.data.children) {
          this.#addList(li.data.children);
        } else {
          this.onchange("clicked", li.data);
        }
      };
      ul.appendChild(li.view);
    });

    if (this.#currentList >= 0) {
      this.#listsContainer.children[this.#currentList].style.transform =
        "translateX(-100%)";
      setTimeout(() => {
        this.#listsContainer.appendChild(ul);
        this.#currentList = this.#listsContainer.children.length - 1;
      }, Globals.SPEED * 1000);
    } else {
      this.#listsContainer.appendChild(ul);
      this.#currentList = this.#listsContainer.children.length - 1;
    }
  }
  #removeList(index = null) {
    if (index === null) {
      this.#listsContainer.innerHTML = "";
      this.#currentList = -1;
    } else {
      const list = this.#listsContainer.children[index];
      this.#listsContainer.removeChild(list);
      this.#currentList--;
    }
  }

  open(action = "open") {
    super.open(action);
    this.#removeList();
    this.#addList(this.#menuData);
    this.#menuButton.toggle();
  }
  close() {
    super.close();
    this.#menuButton.toggle();
  }

  get onchange() {
    return this.callback;
  }
  set onchange(callback) {
    this.callback = callback;
  }
}
