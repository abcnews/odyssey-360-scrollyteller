# odyssey-interior-scrollyteller

Use image/video spheres with transitionable focal points as the graphical element of a scrollyteller

## Usage

In your Core Media article:

```
#scrollytellerNAMEinteriorASSET11019088ELEVATION5YAW120PITCHn15ROLL15
Initial
#markYAW60
Turned 60 degrees counter-clockwise
#markYAWn60
Turned 60 degrees clockwise
#endscrollyteller
```

The opening `#scrollyteller` tag or any `#mark` tag can have the following properties:

- `ASSET`: CoreMedia ID of an Image or Video document or `0` for none (default: `0`)
- `ELEVATION`: Raise/lower 'head' (`n20` to `20`; default `0`)
- `YAW`: Turn 'head' anti-clockwise (`n180` to `180`; default `0`)
- `PITCH`: Tilt 'head' up/down (`n90` to `90`; default `0`)
- `ROLL`: Tilt 'head' left/right (`n90` to `90`; default `0`)

## Authors

- Colin Gourlay ([Gourlay.Colin@abc.net.au](mailto:Gourlay.Colin@abc.net.au))

Project generated from [aunty](https://github.com/abcnews/aunty)'s `preact` app template.
