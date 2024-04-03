import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  from: PropTypes.number,
  to: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  delay: PropTypes.number,
  onComplete: PropTypes.func,
  digits: PropTypes.number,
  className: PropTypes.string,
  tagName: PropTypes.string,
  children: PropTypes.func,
  easing: PropTypes.func,
  position: PropTypes.shape({
    height: PropTypes.number,
    startY: PropTypes.number,
  }),
};

const defaultProps = {
  from: 0,
  delay: 100,
  digits: 0,
  tagName: 'span',
  easing: t => t,
};

class CountTo extends PureComponent {
  constructor(props) {
    super(props);

    const { from } = props;

    this.state = {
      counter: from,
      restart: false
    };

    this.start = this.start.bind(this);
    this.clear = this.clear.bind(this);
    this.next = this.next.bind(this);
    this.updateCounter = this.updateCounter.bind(this);
  }

  componentDidMount() {
    this.start();
    window.addEventListener('scroll', () => {
      if (!this.props.position) return;

      const { from, to } = this.props.position;

      if (window.scrollY > from && window.scrollY < to && this.state.restart) {
        this.start();
        this.setState({ restart: false });
      }

      if (window.scrollY < from && !this.state.restart) {
        this.setState({ restart: true });
      }
    });
  }

  componentWillUnmount() {
    this.clear();
  }

  start(props = this.props) {
    this.clear();
    const { from } = props;
    this.setState({
      counter: from,
    }, () => {
      const { speed, delay } = this.props;
      const now = Date.now();
      this.endDate = now + speed;
      this.scheduleNextUpdate(now, delay);
      this.raf = requestAnimationFrame(this.next);
    });
  }

  next() {
    const now = Date.now();
    const { speed, onComplete, delay } = this.props;

    if (now >= this.nextUpdate) {
      const progress = Math.max(0, Math.min(1, 1 - (this.endDate - now) / speed));
      this.updateCounter(progress);
      this.scheduleNextUpdate(now, delay);
    }

    if (now < this.endDate) {
      this.raf = requestAnimationFrame(this.next);
    } else if (onComplete) {
      onComplete();
    }
  }

  scheduleNextUpdate(now, delay) {
    this.nextUpdate = Math.min(now + delay, this.endDate);
  }

  updateCounter(progress) {
    const { from, to, easing } = this.props;
    const delta = to - from;
    const counter = from + delta * easing(progress);
    this.setState({
      counter,
    });
  }

  clear() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    const { className, digits, tagName: Tag, children: fn } = this.props;
    const { counter } = this.state;
    const value = counter.toFixed(digits);

    if (fn) {
      return fn(value);
    }

    return (
      <Tag className={className}>
        {value}
      </Tag>
    );
  }
}

CountTo.propTypes = propTypes;
CountTo.defaultProps = defaultProps;

export default CountTo;