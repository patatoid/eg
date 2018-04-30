
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
  const flows = this.props.flowList.map(flow => (<Flow key={flow.title} flow={flow}/>));
  return (<div>{flows}</div>);
  }
}

class Action extends React.Component {
  computeState(state) {
    if (state === 'pending') {
      return {badge: 'secondary', text: 'en attente'};
    } else if (state === 'started') {
      return {badge: 'warning', text: 'en cours'};
    } else if (state === 'finished') {
      return {badge: 'success', text: 'finis'};
    }
  }

  render() {
    const action = this.props.action;
    const state = this.computeState(action.state);
    const className = `badge badge-${state.badge}`;
    const stateBadge = <span className={className}>{state.text}</span>
    return (
      <p className="card-text" style={{margin: 0}}>
      {action.description} {stateBadge}</p>
    );
  }
}
class Flow extends React.Component {
  render() {
    const flow = this.props.flow;
    const title=flow.title;
    const actions = flow.actions.map(action => <Action key={action.description} action={action}/>);
    return (
    <div className="card">
      <div className="card-header">
        {title}
        </div>
        <div className="card-body">
          {actions}
        </div>
      </div>
    )
  }
}


socket.on('mainFlow', mainFlow => {
console.log('mainFlow', mainFlow);
  ReactDOM.render(<Main flowList={mainFlow}/>,
    document.getElementById('main')
  )
});
socket.emit('identification', 'interface');
socket.emit('start-admin');
