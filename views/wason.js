class Identification extends React.Component {
  render() {
   return (
     <div>{this.props.id}</div>
   )
  }
}

class Reactor extends React.Component {
  render(){
    const reactor = this.props.reactor;
    const className= `reactor ${reactor.selected ? 'selected' : ''}`;
    //const ids = reactor.id;
    //const idsView = ids.map(id => (<Identification key={id} id={id} />))
    console.log('className', className);
    return (
    <div >
    <div style={{'display': 'none'}} className='identification'></div>
      <div className={className}> </div>
    </div>
    )
  }
}

class Background extends React.Component {
  render() {
    const shift=this.props.shift+1;
    console.log('shift', shift);
    const src = `images/animation_${shift}.jpg`
    return (
    <div style={{'position':'absolute', top: -200, left: 0}} >
      <img src={src} style={{'width': 1920}} />
    </div>
    )
  }
}
socket.on('wason-selected', function(positions) {
  console.log('wason-selected', positions);
  const reactors = positions.reactors;
  const shift = positions.shift;
  const reactorsDom = reactors.map((reactor, i) => (<Reactor key={i} reactor={reactors[i]} />));
  ReactDOM.render(
    (
    <div>
      <Background shift={shift} />
      <div className="container-wrap"> {reactorsDom} </div>
    </div>
    ),
    document.getElementById('main')
  )
})
socket.on('wason-animation', function() {
  ReactDOM.render(
    (
    <div>
      <video width="1920" height="1080" autoPlay={true}>
        <source src="videos/animation.mp4" type="video/mp4"/>
      </video>
    </div>
    ),
    document.getElementById('main')
  )
});
const launchSocket = () => {
  socket.emit('wason-connected');
}
launchSocket();
socket.on('connect', () => launchSocket());
