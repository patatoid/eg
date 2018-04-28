
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
socket.on('react', random => 
  ReactDOM.render(
    <Game random={random}/>,
    document.getElementById('root')
  )
);
