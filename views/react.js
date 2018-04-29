
class Roll extends React.Component {
  render() {
    return (
     <h1>permanent state</h1>
    )
  } 
}

class Game extends React.Component {
  render() {
    const random = this.props.random;
    return (
  <div className="game">
    <Roll />
    { random }
  </div>
    )
  }
}  

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

socket.on('react', random => 
  ReactDOM.render(
    <Game random={random}/>,
    document.getElementById('root')
  )
);
socket.on('connections', connections =>
  ReactDOM.render(
    <Connections connections={connections}/>,
    document.getElementById('navbar-connections')
  )
)
socket.emit('identification', 'interface');
