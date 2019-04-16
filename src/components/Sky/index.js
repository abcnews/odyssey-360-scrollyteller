import { Entity } from 'aframe-react';
import { h, Component } from 'preact';
import createRef from 'react-create-ref';

export default class Sky extends Component {
  constructor(props) {
    super(props);

    this.root = createRef();
  }

  componentDidMount() {
    // For some reason, iniital attributes aren't set. Do it manually.
    this.root.current.setAttribute('material', {
      opacity: this.props.isActive ? 1 : 0
    });

    if (this.props.tagName === 'video') {
      const assetReadyInterval = setInterval(() => {
        if (
          this.root.current.components.material.material &&
          this.root.current.components.material.material.map &&
          this.root.current.components.material.material.map.image &&
          this.root.current.components.material.material.map.image.play
        ) {
          clearInterval(assetReadyInterval);
          this.root.current.components.material.material.map.image.play();
        }
      }, 250);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.root.current) {
      return;
    }

    if (this.props.isActive && !prevProps.isActive && this.props.tagName === 'video') {
      this.root.current.components.material.material.map.image.currentTime = 0;
    }
  }

  render() {
    const { tagName, src, radius, isActive } = this.props;

    const to = isActive ? 1 : 0;
    const material = this.root.current ? this.root.current.getAttribute('material') : null;
    const from = material ? material.opacity : 1 - to;

    return (
      <Entity
        _ref={this.root}
        primitive={tagName === 'video' ? 'a-videosphere' : 'a-sky'}
        animation__fade={fadeAnimation(from, to)}
        src={src}
        radius={radius}
      />
    );
  }
}

const fadeAnimation = (from, to) => `property: material.opacity; from: ${from}; to: ${to}; dur: 2000`;
