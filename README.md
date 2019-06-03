# Text Action Element

A very simple element for picture-elements card that shows static text that supports a tap action. I needed this component since I was building a media control panel using picture-elements and ran in to rendering bugs on iOS (in HA app). To solve that I generated a font using [glyphter.com](http://glyphter.com) and I needed a component to render the text but still make it a button. So I made this component as a lightweight alternative to custom button elements.

## Using the card

#### Element options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| type | string | **required** | v0.1 | `custom:text-action-element`
| text | string | **required** | v0.1 | Cover entity to control.
| entity | string |  | v0.1 | Entity that tap_action should operate on (no need to provide if you just want static text)
| tap_action | object |  | v0.1 | See [Action](#action) 
| state_filter | list |  | v0.1 | State based CSS filters. See [this link](https://www.home-assistant.io/lovelace/picture-elements/#how-to-use-state_filter) for usage docs.

### Action

| Name              | Type   | Default  | Supported options                                                | Description                                                                                              |
| ----------------- | ------ | -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `action`          | string | `toggle` | `more-info`, `toggle`, `call-service`, `none`, `navigate`, `url` | Action to perform                                                                                        |
| `navigation_path` | string | none     | Eg: `/lovelace/0/`                                               | Path to navigate to (e.g. `/lovelace/0/`) when action defined as navigate                                |
| `url`             | string | none     | Eg: `https://www.google.fr`                                      | URL to open on click when action is `url`. The URL will open in a new tab                                |
| `service`         | string | none     | Any service                                                      | Service to call (e.g. `media_player.media_play_pause`) when `action` defined as `call-service`           |
| `service_data`    | object | none     | Any service data                                                 | Service data to include (e.g. `entity_id: media_player.bedroom`) when `action` defined as `call-service`. If your `service_data` requires an `entity_id`, you can use the keywork `entity`, this will actually call the service on the entity defined in the main configuration of this card. Useful for [configuration templates](#configuration-templates) |

### Example usage

```yaml
- type: picture-elements
  image: /local/LivingRoom.jpg
  elements:
    - type: 'custom:text-action-element'
      text: Lights on!
      style:
        top: 40%
        height: 15%
        width: 23%
        left: 53%
        background-color: 'rgba(255, 255, 255, 0.6)'
        border-radius: 10px
      entity: light.livingroom
      tap_action:
        action: toggle
```

## Install

### Simple install

1. Download and copy `text-action-element-bundle.js` from the [latest release](https://github.com/custom-cards/text-action-element/releases/latest) into your `config/www` directory.

2. Add a reference to `text-action-element-bundle.js` in lovelace.

  ```yaml
  resources:
    - url: /local/text-action-element-bundle.js?v=0.1.0
      type: module
  ```
To do this, go to Configure UI -> Raw Config Editor and paste this under resources or use [YAML Mode](https://www.home-assistant.io/lovelace/yaml-mode/) (not recommended))

### CLI install

1. Move into your `config/www` directory

2. Grab `text-action-element-bundle.js`

  ```console
  $ wget https://github.com/custom-cards/text-action-element/releases/download/0.1.0/text-action-element-bundle.js
  ```

3. Add a reference to `text-action-element-bundle.js` inside your `ui-lovelace.yaml`.

  ```yaml
  resources:
    - url: /local/text-action-element-bundle.js?v=0.1.0
      type: module
  ```

### *(Optional)* Add to custom updater

1. Make sure you have the [custom_updater](https://github.com/custom-components/custom_updater) component installed and working.

2. Add a new reference under `card_urls` in your `custom_updater` configuration in `configuration.yaml`.
//todo: implement tracker
  ```yaml
  custom_updater:
    card_urls:
      - https://raw.githubusercontent.com/custom-cards/text-action-element/master/tracker.json
  ```

## Updating
1. Find your `text-action-element-bundle.js` file in `config/www` or wherever you ended up storing it.

2. Replace the local file with the latest one attached in the [latest release](https://github.com/custom-cards/text-action-element/releases/latest).

3. Add the new version number to the end of the cards reference url in your `ui-lovelace.yaml` like below.

  ```yaml
  resources:
    - url: /local/text-action-element-bundle.js?v=0.1.0
      type: module
  ```

*You may need to empty the browsers cache if you have problems loading the updated card.*

## Getting errors?
Make sure you have `javascript_version: latest` in your `configuration.yaml` under `frontend:`.

Make sure you have the latest version of `text-action-element-bundle.js`.

If you have issues after updating the card, try clearing your browsers cache or restart Home Assistant.

If you get "Custom element doesn't exist: text-action-element" or running older browsers try replacing `type: module` with `type: js` in your resource reference, like below.

```yaml
resources:
  - url: ...
    type: js
```

## License
This project is under the Apache 2.0 license.
