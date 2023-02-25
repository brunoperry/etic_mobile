import Component from "./Component.js";
import ListButton from "./ListButton.js";
import ToggleButton from "./ToggleButton.js";

export default class Menu extends Component {
  #menuData;
  #menuContainer;
  #currentList = null;
  #isOpen = false;

  constructor(elementId, callback) {
    super(elementId, callback);

    const menuButton = new ToggleButton("#menu-button", (value) => {
      this.#isOpen = !this.#isOpen;
      this.#isOpen ? this.open() : this.close();

      menuButton.toggle();
    });
    menuButton.toggle();

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

    if (this.#currentList) {
      this.#currentList.style.transform = "translateX(-100%)";
    }
    this.#menuContainer.appendChild(ul);
    this.#currentList = ul;
  }

  #deleteList(index = null) {
    if (index !== null) {
    } else {
      this.#menuContainer.innerHTML = "";
      this.#currentList = null;
    }
  }

  open() {
    this.#createList(this.#menuData);
    this.#menuContainer.style.transform = "scaleY(1)";
    this.callback({ type: "opening" });
  }

  close() {
    this.#deleteList();
    this.#menuContainer.style.transform = "scaleY(0)";
  }

  get data() {
    return this.#menuData;
  }

  set data(val) {
    this.#menuData = val;
    //if opened, paint trail.
  }
}
