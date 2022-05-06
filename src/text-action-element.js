import { HassUtils } from "./hass/hass-utils.js";
import { handleClick } from "./hass/handle-click.ts";

class HuiTextActionElement extends HassUtils.LitElement {
  constructor() {
    super();
    this._config = {};
  }

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  setConfig(config) {
    if (!config.text) {
      throw Error("Invalid Configuration: 'text' required");
    }

    this._config = config;
  }

  render() {
    if (!this._config || !this.hass || !this._config.text) {
      return HassUtils.LitHtml``;
    }

    const stateObj =
      this.hass && this._config.entity
        ? this.hass.states[this._config.entity]
        : undefined;

    // Figure out filter to use
    let filter = "";

    if (this._config.tap_action) {
      filter = "cursor: pointer;";
    }

    const state = stateObj ? stateObj.state : "unavailable";

    if (this._config.state_filter && this._config.state_filter[state]) {
      filter += this._config.state_filter[state];
    }

    return HassUtils.LitHtml`
      <div class="content" @click=${this._handleTap} 
        style="${filter}">
        ${this._config.text}
      </div>
    `;
  }

  static get styles() {
    return HassUtils.LitCSS`
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    `;
  }

  _handleTap() {
    if (!this._config.tap_action) {
      return;
    }

    handleClick(this, this.hass, this._config, false);
  }
}

customElements.define("text-action-element", HuiTextActionElement);
