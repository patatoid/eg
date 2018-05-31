
class Reactor extends React.Component {
  render(){
    const reactor = this.props.reactor;
    const className= `reactor ${reactor.selected ? 'selected' : ''}`;
    console.log('className', className);
    return (
      <div className={className}>{reactor.label}</div>
    )
  }
}
socket.on('wason-selected', function(positions) {
  console.log('wason-selected', positions);
  const reactors = positions.reactors;
  const shift = positions.shift;
  const reactorsDom = reactors.map((reactor, i) => (<Reactor key={i} reactor={reactors[(i+shift)%4]} />));
  ReactDOM.render(
    (<div className="container-wrap"> {reactorsDom} </div>),
    document.getElementById('main')
  )
})
const launchSocket = () => {
  socket.emit('wason-connected');
}
launchSocket();
socket.on('connect', () => launchSocket());
