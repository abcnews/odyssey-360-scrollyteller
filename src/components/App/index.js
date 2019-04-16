import Scrollyteller from '@abcnews/scrollyteller';
import { h, Component } from 'preact';
import Graphic from '../Graphic';
import styles from './styles.css';

const DEFAULT_STATE = {
  elevation: 0,
  yaw: 0,
  pitch: 0,
  roll: 0,
  asset: null
};

export default class App extends Component {
  state = DEFAULT_STATE;

  constructor(props) {
    super(props);

    this.configToStateMap = createCumulatitveStateMap(props.panels.map(panel => panel.config), DEFAULT_STATE);

    this.onMarker = this.onMarker.bind(this);
  }

  onMarker(config) {
    this.setState(this.configToStateMap.get(config));
  }

  render() {
    const { assets, panels } = this.props;

    return (
      <Scrollyteller
        className={`is-piecemeal ${styles.scrollyteller}`}
        onMarker={this.onMarker}
        panels={panels}
        panelClassName={`Block-content u-richtext-invert ${styles.panel}`}
      >
        <Graphic assets={assets} {...this.state} />
      </Scrollyteller>
    );
  }
}

const negativeNumberPattern = /^n\d+/;
const decimalNumberPattern = /\d+p\d+$/;

function createCumulatitveStateMap(states, initialState) {
  const map = new WeakMap();
  let tempState = { ...initialState };

  states.forEach(state => {
    tempState = { ...tempState, ...state };

    // Number resolution
    Object.keys(tempState).forEach(key => {
      if (negativeNumberPattern.test(String(tempState[key]))) {
        tempState[key] = tempState[key].replace('n', '-');
      }

      if (decimalNumberPattern.test(String(tempState[key]))) {
        tempState[key] = tempState[key].replace('p', '.');
      }

      if (tempState[key] == +tempState[key]) {
        tempState[key] = +tempState[key];
      }
    });

    delete tempState.hash;
    delete tempState.piecemeal;

    map.set(state, { ...tempState });
  });

  return map;
}
