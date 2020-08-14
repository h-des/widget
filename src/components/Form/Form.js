import {Component} from 'preact';
import Input from '../Input';
import styles from './style.scss';

class Form extends Component {
  state = {
    error: null,
    email: null,
    text: null,
    sent: false,
  };

  handleUpdate = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSubmit = event => {
    event.preventDefault();
    const {email, text} = this.state;
    if (!email || !text) {
      return this.setState({error: 'Wypełnij wszystkie pola'});
    }

    this.props.onSubmit({from: email, text});
    this.setState({error: null, sent: true});
  };

  render() {
    const {sent, error} = this.state;
    return !!sent ? (
      <p>Twoja wiadomość została wysłana!</p>
    ) : (
      <form onSubmit={this.handleSubmit} class={styles.form}>
        <Input
          required
          name="email"
          type="email"
          label="Email"
          onChange={this.handleUpdate('email')}
        />
        <Input
          required
          as="textarea"
          name="text"
          type="text"
          label="Wiadomość"
          onChange={this.handleUpdate('text')}
        />
        {error && <p class={styles.error}>{error}</p>}
        <button type="submit">
          Wyślij
        </button>
      </form>
    );
  }
}

export default Form;
