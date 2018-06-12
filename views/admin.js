moment.locale('fr');

class Connections extends React.Component {
  render() {
    const connections = this.props.connections;
    const devices = Object.keys(connections);
    const connectionsRender = devices.map(device => {
      const color = connections[device] ? 'success' : 'danger';
      const className=`badge badge-${color}`
      return (
      <a className="nav-item" href="#" key={device}>
        <span className={className}>{device}</span>
      </a>)
    });
    return (
      <div className="navbar-nav">
        {connectionsRender}
        <div className="nav-item">
          <span 
              className="badge badge-danger"
              style={{'cursor':'pointer', 'margin-left': '50px'}}
              onClick={() => window.confirm("Attention vous allez effacer les données courantes et redémarrer une partie") 
              ? socket.emit('restart-game') : null}> 
              Arrêter et redémarrer 
            </span>
        </div>
      </div>
    )
  }
}

socket.on('connections', connections =>
  ReactDOM.render(
    <Connections connections={connections}/>,
    document.getElementById('navbar-connections')
  )
)

class Main extends React.Component {
  render() {
  const flows = this.props.flowList.map(flow => (<Flow key={flow.description} flow={flow}/>));
  return (
  <div>
    {flows}
    <a 
        style={{'margin-left':20}}
        className="badge badge-primary"
        href="/download"> Télécharger l'export </a>
      <br/>
  </div>
  );
  }
}

class Response extends React.Component {
  renderCrea(response) {
    if(!response.hasData) return (<div>pas de reponse</div>)
    const src=`crea-audio/${response.deviceName}_${response.index}`;
    const duration = Math.round(response.duration/10)/100;
    return (
    <div>
      <p>{duration}s <audio controls src={src}></audio></p>
    </div>
    )
  }
  renderWason(response) {
    const buttonIndex=response.button;
    if(buttonIndex===undefined) return (<div>pas de reponse</div>)
    console.log('buttonIndex', buttonIndex);
    return (
    <div>
      {response.reactors[buttonIndex].label}
    </div>
    )
  }
  renderExtinction(response) {
    return (
    <div>
      choix reacteur {response.choice}
    </div>
    )
  }
  render() {
    const response = this.props.response;
    console.log('response', response);
    if(response.type === 'crea') return this.renderCrea(response);
    if(response.type === 'wason') return this.renderWason(response);
    if(response.type === 'extinction') return this.renderExtinction(response);
    return null;
  }
}

class Action extends React.Component {
  constructor(props) {
    super(props)
    this.state = {showButton: props.action.force};
  }
  computeState(state, _startTime) {
    const startTime = _startTime ? moment(_startTime).format('LTS').toString() : ' ';
    if (state === 'pending') {
      return {badge: 'secondary', text: 'en attente'};
    } else if (state === 'started') {
      return {badge: 'warning', text: 'demarré à '+startTime};
    } else if (state === 'finished') {
      return {badge: 'success', text:startTime};
    }
  }

  render() {
    const action = this.props.action;
    if(typeof action.type != "undefined") return (<Flow flow={action}/>);
    const state = this.computeState(action.state || 'pending', action.startTime);
    const button = (<span 
        className="badge badge-primary"
        style={{cursor: "pointer", visibility: (this.state.showButton ? 'visible' : 'hidden')}}
        onClick={() => socket.emit('force')}> {action.force || 'Forcer'} </span>);
    const description = action.description;
    const className = `badge badge-${state.badge}`;
    const showButton = () => this.setState({showButton: !this.state.showButton});
    const stateBadge = <span className={className} 
                             onClick={() => showButton()} >{state.text}</span>
    const response = action.response ? <Response response={action.response}/> : null;
    return (
      <div><p className="card-text" style={{margin: 0}}>
      {stateBadge} {description} {button} </p>
      {response}</div>
    );
  }
}
class Flow extends React.Component {
  render() {
    const flow = this.props.flow;
    const actions = flow.actions.map(action => <Action key={action.description} type={flow.type} action={action}/>);
    if(flow.type==='parallel') {
    return (
    <div>
      <p className="card-text" style={{margin: 0}}>{flow.description}</p>
      <div className='row'>
        {actions}
      </div>
    </div>
      );
    }
    return (
      <div className="card">
        <div className="card-header">
          {flow.description}
        </div>
        <div className='card-body'>
          {actions}
        </div>
      </div>
    )
  }
}

const launchSocket = () => {
  socket.emit('identification', 'interface');
  socket.emit('start-admin');
}
socket.on('connect', () => launchSocket());
launchSocket();
socket.on('mainFlow', mainFlow => {
  console.log('mainFlow', mainFlow);
  ReactDOM.render(<Main flowList={mainFlow}/>,
    document.getElementById('main')
  )
});
