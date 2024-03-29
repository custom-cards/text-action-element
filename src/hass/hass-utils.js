import { fireEvent } from "./fireEvent.js";

/*
    Home Assistant utility class
    Inspired by Thomas Loven's card-tools (no-license)
*/
export class HassUtils {
  static get LitElement() {
    return Object.getPrototypeOf(customElements.get("home-assistant-main"));
  }

  static get LitHtml() {
    return this.LitElement.prototype.html;
  }

  static get LitCSS() {
    return this.LitElement.prototype.css;
  }

  static callService(hass, domain, service, entityId, inOptions) {
    hass.callService(domain, service, {
      entity_id: entityId,
      ...inOptions
    });
  }

  static toggleEntity(hass, entityId) {
    const turnOn = STATES_OFF.includes(hass.states[entityId].state);
    return HassUtils.turnOnOffEntity(hass, entityId, turnOn);
  }

  static turnOnOffEntity(hass, entityId, turnOn = true) {
    const stateDomain = HassUtils.computeDomain(entityId);
    const serviceDomain =
      stateDomain === "group" ? "homeassistant" : stateDomain;

    let service;
    switch (stateDomain) {
      case "lock":
        service = turnOn ? "unlock" : "lock";
        break;
      case "cover":
        service = turnOn ? "open_cover" : "close_cover";
        break;
      default:
        service = turnOn ? "turn_on" : "turn_off";
    }

    return hass.callService(serviceDomain, service, { entity_id: entityId });
  }

  static computeDomain(entityId) {
    return entityId.substr(0, entityId.indexOf("."));
  }

  static popUp(hass, title, content) {
    const popup = document.createElement("div");
    popup.innerHTML = `
      <style>
        app-toolbar {
          color: var(--more-info-header-color);
          background-color: var(--more-info-header-background);
        }
      </style>
      <app-toolbar>
        <paper-icon-button
          icon="hass:close"
          dialog-dismiss=""
        ></paper-icon-button>
        <div class="main-title" main-title="">
          ${title}
        </div>
      </app-toolbar>
    `;
    popup.appendChild(content);
    this.moreInfo(Object.keys(hass.states)[0]);
    const moreInfo = document.querySelector("home-assistant")._moreInfoEl;
    moreInfo._page = "none";
    moreInfo.shadowRoot.appendChild(popup);
    // moreInfo.large = large;
    moreInfo.style.width = "570px";
    document.querySelector("home-assistant").provideHass(content);

    setTimeout(() => {
      const interval = setInterval(() => {
        if (moreInfo.getAttribute("aria-hidden")) {
          popup.parentNode.removeChild(popup);
          clearInterval(interval);
        }
      }, 100);
    }, 1000);
    return moreInfo;
  }

  static closePopUp() {
    const moreInfo = document.querySelector("home-assistant")._moreInfoEl;
    if (moreInfo) moreInfo.close();
  }

  static moreInfo(entity) {
    this.fireEvent("hass-more-info", { entityId: entity });
  }

  static fireEvent(ev, detail, entity = null) {
    ev = new Event(ev, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    ev.detail = detail || {};
    if (entity) {
      entity.dispatchEvent(ev);
    } else {
      var root = document.querySelector("home-assistant");
      root = root && root.shadowRoot;
      root = root && root.querySelector("home-assistant-main");
      root = root && root.shadowRoot;
      root =
        root && root.querySelector("app-drawer-layout partial-panel-resolver");
      root = (root && root.shadowRoot) || root;
      root = root && root.querySelector("ha-panel-lovelace");
      root = root && root.shadowRoot;
      root = root && root.querySelector("hui-root");
      root = root && root.shadowRoot;
      root = root && root.querySelector("ha-app-layout #view");
      root = root && root.firstElementChild;
      if (root) root.dispatchEvent(ev);
    }
  }

  static navigate(_node, path, replace) {
    if (replace) {
      history.replaceState(null, "", path);
    } else {
      history.pushState(null, "", path);
    }
    fireEvent(window, "location-changed", {
      replace
    });
  }
}

export const STATES_OFF = ["closed", "locked", "off"];
