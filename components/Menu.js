import Component from "./Component.js";
import ListButton from "./ListButton.js";
import ToggleButton from "./ToggleButton.js";

export default class Menu extends Component {
  #menuData;
  #menuContainer;
  #menuButton;
  #currentList = null;
  #isOpen = false;

  constructor(elementId, callback) {
    super(elementId, callback);

    this.#menuButton = new ToggleButton("#menu-button", (value) => {
      this.#isOpen ? this.close() : this.open();
    });

    this.#menuContainer = this.element.querySelector("#menu-container");
  }

  #createList(data) {
    const ul = document.createElement("ul");

    data.forEach((itemData) => {
      const listButton = new ListButton(itemData, () => {
        if (itemData.type === "folder") {
          this.#createList(itemData.children);
        } else {
          this.callback(itemData);
        }
      });
      ul.appendChild(listButton.element);
    });

    this.#menuContainer.appendChild(ul);
    this.#currentList = ul;
  }

  #deleteList(index = null) {
    if (index !== null) {
      //delete indexed list
    } else {
      this.#menuContainer.innerHTML = "";
      this.#currentList = null;
    }
  }

  open() {
    this.#menuButton.toggle(1);
    this.#createList(this.#menuData);
    this.#menuContainer.style.transform = "scaleY(1)";
    this.callback({ type: "opening" });
    this.#isOpen = true;
  }

  close() {
    this.#menuButton.toggle(0);
    this.#deleteList();
    this.#menuContainer.style.transform = "scaleY(0)";
    this.#isOpen = false;
  }

  get data() {
    return this.#menuData;
  }

  set data(val) {
    this.#menuData = val;
    //if opened, paint trail.
  }
}
