import { h, Component } from 'preact';

class Input extends Component {
  render() {
    const { label , as, onChange,  ...inputProps } = this.props

    return (
      <label>
        <span>{label}</span>
        { as === 'textarea' 
          ? <textarea onChange={onChange} {...inputProps}/>
          : <input onInput={onChange} {...inputProps}/>
        }
      </label>
    );
  }
};

export default Input
