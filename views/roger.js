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
     if (login === 'MOORE Roger' && mdp === 'A5278N3910V8982A1335U3877U6413')
     {
       this.props.onConnect();
     } else {
       this.setState({error: 'Indentifiant ou mdp incorrect !'})
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

class Video extends React.Component {
  render() {
    return (
    <div style={{'width':'600px'}}>
      <h2 style={{'color':'white'}}>{this.props.title}</h2>
      <video width="480" height="360" controls>
        <source src={this.props.src} type="video/mp4"/>
      </video>
    </div>
    )
  }
}

class Videos extends React.Component {
  render() {
    return (
    <div>
      <div style={{'margin-left':640, 'margin-top': 50}}>
        <h1 style={{'color':'white'}}>Explication</h1>
        <video width="640" height="480" controls>
          <source src="videos/vid1_moore.mp4" type="video/mp4"/>
        </video>
      </div>
      <div className="row" style={{'margin-left': 120, 'margin-top': 40}}>
        <Video title="Fuite du liquide radioactif" src="videos/vid4_moore.mp4"/>
        <Video title="Panne électrique" src="videos/vid3_moore.mp4"/>
        <Video title="Emballement thermique" src="videos/vid2_moore.mp4"/>
      </div>
    </div>
    );
  }
}

  ReactDOM.render(
    <Main/>,
    document.getElementById('main')
  )
