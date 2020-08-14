import {Component, Fragment} from 'preact';
import {fetchData, submitData} from '../../services/widget';
import Form from '../Form';
import styles from './style.scss';

class App extends Component {
  state = {
    data: null,
    isOpen: false,
  };

  async componentDidMount() {
    try {
      const res = await fetchData(
        this.props.url,
        this.props.apiKey,
      ).then(data => data.json());
      this.setState({data: res});
    } catch (e) {}
  }

  handleSubmit = data => {
    submitData(this.props.url, this.props.apiKey, data);
  };

  handleOpen = () => {
    this.setState({isOpen: true})
  }

  handleClose = () => {
    this.setState({isOpen: false})
  }

  render() {
    const {data, isOpen} = this.state;

    return isOpen ? (
      <div class={styles.container}>
        <div onClick={this.handleClose} class={styles.bar}>Close</div>
        {!data ? (
          <p>Ładowanie</p>
        ) : (
          <Fragment>
            <h1>{data.name}</h1>
            <p>{data.text}</p>
            <Form onSubmit={this.handleSubmit} />
          </Fragment>
        )}
      </div>
    ) : (
      <button onClick={this.handleOpen} class={styles.icon}>Skontaktuj się z nami</button>
    );
  }
}

export default App;
