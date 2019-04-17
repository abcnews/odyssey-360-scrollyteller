# odyssey-360-scrollyteller

Use 360° image/video spheres with transitionable focal points as the graphical element of a scrollyteller

## Usage

In your Core Media article:

```
#scrollytellerNAME360ASSET11019088ELEVATION5YAW120PITCHn15ROLL15
Initial
#markYAW60
Turned 60 degrees counter-clockwise
#markYAWn60
Turned 60 degrees clockwise
#endscrollyteller
```

The opening `#scrollyteller` tag or any `#mark` tag can have the following properties:

- `ASSET`: CoreMedia ID of an Image or Video document or `0` for none (default: `0`)
- `YAWOFFSET`: Set the 'zero' degree for an asset, to help maintain h'head' orientation between assets (`n180` to `180`; default `0`)
- `ELEVATION`: Raise/lower 'head' (`n20` to `20`; default `0`)
- `YAW`: Turn 'head' anti-clockwise (`n180` to `180`; default `0`)
- `PITCH`: Tilt 'head' up/down (`n90` to `90`; default `0`)
- `ROLL`: Tilt 'head' left/right (`n90` to `90`; default `0`)

The following effects are produced by changing the above properties:

- Changes in `ASSET` will cause a fade transition, using a black background where no asset is required
- Changes in `ELEVATION` `YAW`, `PITCH` and `ROLL` will be combined into a singular transtion combining transation and rotation
- Changes in `YAW` will result in the shortest distance between the two angles being traversed (330° to 30° will traverse a 60° arc, not 300°)
- All property changes (except `YAWOFFSET`) are additive. Omitting a property doesn't reset it to its default. You'll have to do that manually when required.

## Authors

- Colin Gourlay ([Gourlay.Colin@abc.net.au](mailto:Gourlay.Colin@abc.net.au))

Project generated from [aunty](https://github.com/abcnews/aunty)'s `preact` app template.
