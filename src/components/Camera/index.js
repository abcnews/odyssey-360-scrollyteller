import { Entity } from 'aframe-react';
import { h, Component } from 'preact';
import createRef from 'react-create-ref';

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.yawAxis = createRef();
    this.pitchAxis = createRef();
    this.rollAxis = createRef();
  }

  componentDidMount() {
    // For some reason, iniital attributes aren't set. Do it manually.
    this.yawAxis.current.setAttribute('position', { x: 0, y: this.props.elevation, z: 0 });
    this.yawAxis.current.setAttribute('rotation', { x: 0, y: this.props.yaw, z: 0 });
    this.pitchAxis.current.setAttribute('rotation', { x: this.props.pitch, y: 0, z: 0 });
    this.rollAxis.current.setAttribute('rotation', { x: 0, y: 0, z: this.props.roll });
  }

  render() {
    const { elevation, maxElevation, yaw, pitch, roll, children, ...otherProps } = this.props;
    const end = {
      elevation: Math.min(maxElevation, Math.max(-maxElevation, elevation || 0)),
      yaw: (yaw || 0) % 360,
      pitch: clampAngle(pitch, 90),
      roll: clampAngle(roll, 90)
    };
    const begin = {
      elevation: this.yawAxis.current ? this.yawAxis.current.getAttribute('position').y : end.elevation,
      yaw: this.yawAxis.current ? (this.yawAxis.current.getAttribute('rotation').y + 360) % 360 : end.yaw,
      pitch: this.pitchAxis.current ? (this.pitchAxis.current.getAttribute('rotation').x + 360) % 360 : end.pitch,
      roll: this.rollAxis.current ? (this.rollAxis.current.getAttribute('rotation').z + 360) % 360 : end.roll
    };
    const elevationPath = { from: begin.elevation, to: end.elevation, diff: Math.abs(begin.elevation - end.elevation) };
    const yawPath = shortestPath(begin.yaw, end.yaw);
    const pitchPath = shortestPath(begin.pitch, end.pitch);
    const rollPath = shortestPath(begin.roll, end.roll);
    const animationDuration = Math.max(
      (Math.max(yawPath.diff, pitchPath.diff, rollPath.diff) / 180) * 2000,
      (elevationPath.diff / maxElevation) * 4000,
      2000
    );
    const elevationAnimation = positionAnimation('y', elevationPath, animationDuration);
    const yawAnimation = rotationAnimation('y', yawPath, animationDuration);
    const pitchAnimation = rotationAnimation('x', pitchPath, animationDuration);
    const rollAnimation = rotationAnimation('z', rollPath, animationDuration);

    return (
      <Entity
        _ref={this.yawAxis}
        animation__elevation={elevationAnimation}
        animation__yaw={yawAnimation}
        {...otherProps}
      >
        <Entity _ref={this.pitchAxis} animation__pitch={pitchAnimation}>
          <Entity
            _ref={this.rollAxis}
            primitive="a-camera"
            position="0 0 0"
            animation__roll={rollAnimation}
            fov="90"
            look-controls-enabled="false"
            wasd-controls-enabled="false"
          >
            {children}
          </Entity>
        </Entity>
      </Entity>
    );
  }
}

const clampAngle = (angle, limit) => {
  angle = (angle || 0) % 360;

  if (angle > 180) {
    angle -= 360;
  }

  return Math.max(-limit, Math.min(limit, angle));
};

const shortestPath = (from, to) => {
  const rotation = ((to - from + 540) % 360) - 180;

  return { from: to - rotation, to, diff: Math.abs(rotation) };
};

const transformPropertyAnimation = (property, axis, path, duration) =>
  [
    `property: ${property}`,
    `dur: ${duration}`,
    `from: ${axis === 'x' ? path.from : 0} ${axis === 'y' ? path.from : 0} ${axis === 'z' ? path.from : 0}`,
    `to: ${axis === 'x' ? path.to : 0} ${axis === 'y' ? path.to : 0} ${axis === 'z' ? path.to : 0}`,
    `easing: easeInOutQuad`,
    `loop: 1`
  ].join('; ');

const positionAnimation = (axis, path, duration) => transformPropertyAnimation('position', axis, path, duration);

const rotationAnimation = (axis, path, duration) => transformPropertyAnimation('rotation', axis, path, duration);
