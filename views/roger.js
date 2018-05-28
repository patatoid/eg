class Main extends React.Component {
  constructor(props) {
   super(props);
   this.state = {connected: false};
  }
  connect() {
   this.setState({connected: true});
   socket.emit('session-opened');
  }
  render() {
    if(this.state.connected) {
      return ( <div> <Videos /> </div>);
    } else {
      return ( <div> <Identification onConnect={() => this.connect()}/> </div>);
    }
  }
}


class Identification extends React.Component {
 constructor(props) {
   super(props);
   this.state = {error: ''};
 }
  render() {
    const connect = () => {
     const login = this.login.value.trim();
     const mdp = this.mdp.value.trim();
     if (login === 'MOORE Roger' && mdp === 'B1563K3784B1289N2587E7652U4796')
     {
       this.props.onConnect();
     } else {
       this.setState({error: 'Indentifiant ou mdp incorrecte !'})
     }
    }
    return (
    <div className="container">
      <div className="item">
        <p>identifiant:</p>
        <input className="input" type="text" ref={(input) => this.login = input}/>
      </div>
      <div className="item">
        <p>mot de passe:</p>
        <input className="input" type="text" ref={(input) => this.mdp = input}/>
      </div>
      <div className="item">
        <p style={{'color':'red'}}> {this.state.error} </p>
      </div>
      <div className="item">
        <button className="connection" onClick={() => connect()}>Connexion</button>
      </div>
    </div>
      );
  }
}

class Videos extends React.Component {
  render() {
    return (
      <div>
        <video width="320" height="240" controls>
          <source src="videos/test.mp4" type="video/mp4"/>
        </video>
        <video width="320" height="240" controls>
          <source src="videos/test.mp4" type="video/mp4"/>
        </video>
        <video width="320" height="240" controls>
          <source src="videos/test.mp4" type="video/mp4"/>
        </video>
        <video width="320" height="240" controls>
          <source src="videos/test.mp4" type="video/mp4"/>
        </video>
      </div>
    );
  }
}

  ReactDOM.render(
    <Main/>,
    document.getElementById('main')
  )
