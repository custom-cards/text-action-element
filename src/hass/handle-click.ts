import { HassUtils } from "./hass-utils";
import { fireEvent } from "./fireEvent.js";

export const handleClick = (
  node: HTMLElement,
  hass,
  config: {
    entity?: string;
    camera_image?: string;
    hold_action?;
    tap_action?;
  },
  hold: boolean
): void => {
  let actionConfig = undefined;

  if (hold && config.hold_action) {
    actionConfig = config.hold_action;
  } else if (!hold && config.tap_action) {
    actionConfig = config.tap_action;
  }

  if (!actionConfig) {
    actionConfig = {
      action: "more-info",
    };
  }

  switch (actionConfig.action) {
    case "more-info":
      if (config.entity || config.camera_image) {
        HassUtils.fireEvent(node, "hass-more-info", {
          entityId: config.entity ? config.entity : config.camera_image!,
        });
      }
      break;
    case "navigate":
      if (actionConfig.navigation_path) {
        HassUtils.navigate(node, actionConfig.navigation_path);
      }
      break;
    case "toggle":
      if (config.entity) {
        HassUtils.toggleEntity(hass, config.entity!);
      }
      break;
    case "call-service": {
      if (!actionConfig.service) {
        return;
      }
      const [domain, service] = actionConfig.service.split(".", 2);
      hass.callService(domain, service, actionConfig.service_data);
    }
    case "fire-dom-event": {
      fireEvent(node, "ll-custom", actionConfig);
    }
  }
};
