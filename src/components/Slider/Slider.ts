import { DomHelpers } from "@utils";
import "@styles/components/slider/slider.scss";

export default class Slider extends HTMLElement {
  private slideStage: Element;
  private slideOffset: number;
  private currentOffset: number;
  private activeSlideIndex: number;
  private lastSlideIndex: number;

  constructor() {
    super();

    this.render();
    this.slideOffset = 0;
    this.currentOffset = 0;
    this.activeSlideIndex = 0;
    this.lastSlideIndex = -1;
  }

  private async clone(children: Array<Element>) {
    const slots = this.querySelectorAll("[slot]");

    this.innerHTML = this.template;

    slots.forEach((slot: Element) => {
      const slotName = slot.getAttribute("slot");

      if (
        slotName!.toLowerCase() === "body" &&
        DomHelpers.isDivElement(slot) === false
      ) {
        throw new Error('Slot `<slot="body">` must be a DIV element.');
      }

      this.querySelector(
        `slot[name="${slot.getAttribute("slot")}"]`
      )!.replaceWith(slot);
    });

    if (children.length) {
      children.forEach((child) =>
        this.querySelector(
          ":scope > .cc-slider > .cc-slider__stage"
        )?.appendChild(child)
      );
    }
  }

  private bindListeners() {
    this.querySelector("button.cc-slider__prev")!.addEventListener(
      "click",
      (event) => {
        if (this.activeSlideIndex > 0) {
          this.activeSlideIndex -= 1;
          this.currentOffset = this.activeSlideIndex * this.slideOffset;
          this.querySelector(
            ":scope > .cc-slider > .cc-slider__buttons > button.cc-slider__next"
          )!.removeAttribute("disabled");
          this.slideStage.setAttribute(
            "style",
            `transform: translateX(-${this.currentOffset}px);`
          );
        }

        this.activeSlideIndex === 0 &&
          (event.target as HTMLElement)
            .closest("button")
            ?.setAttribute("disabled", "true");
      }
    );

    this.querySelector("button.cc-slider__next")!.addEventListener(
      "click",
      (event) => {
        if (this.activeSlideIndex < this.lastSlideIndex) {
          this.activeSlideIndex += 1;
          this.currentOffset = this.activeSlideIndex * this.slideOffset;
          this.querySelector(
            ":scope > .cc-slider > .cc-slider__buttons > button.cc-slider__prev"
          )!.removeAttribute("disabled");
          this.slideStage.setAttribute(
            "style",
            `transform: translateX(-${this.currentOffset}px);`
          );
        }

        this.activeSlideIndex === this.lastSlideIndex &&
          (event.target as HTMLElement)
            .closest("button")
            ?.setAttribute("disabled", "true");
      }
    );
  }

  async render() {
    const children = Array.from(this.children).filter(
      (child) => !child.getAttribute("slot")
    );
    await this.clone(children);

    this.slideStage = this.querySelector(
      ":scope > .cc-slider > .cc-slider__stage"
    )!;
    this.slideOffset = children[0].clientWidth;
    this.lastSlideIndex = children.length - 1;

    this.bindListeners();
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);
  }

  private template = `
    <div class="cc-slider">
      <div class="cc-slider__stage">
      </div>
      <div class="cc-slider__buttons mt-3">
        <button class="cc-slider__prev mx-4" role="button" aria-label="Previous Entry" disabled="true">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 223.413 223.413">
            <g>
              <polygon style="fill:currentColor;" points="146.883,197.402 45.255,98.698 146.883,0 152.148,5.418 56.109,98.698 152.148,191.98"/>
            </g>
          </svg>
        </button>
        <button class="cc-slider__next mx-4" role="button" aria-label="Next Entry">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 223.413 223.413">
            <g>
              <polygon style="fill:currentColor;" points="57.179,223.413 51.224,217.276 159.925,111.71 51.224,6.127 57.179,0 172.189,111.71"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  `;
}
