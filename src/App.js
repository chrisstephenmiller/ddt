import React, { Component } from 'react';
import './App.css';

import axios from 'axios'


class App extends Component {

  constructor() {
    super()
    this.state = {
      balls: []
    }
  }

  hit = id => {
    const balls = [...this.state.balls]
    if (id) balls.find(ball => ball.id === id).dead = true
    else balls.forEach(ball => ball.dead = false)
    this.setState({ balls })
  }

  newGame = async () => {
    const game = await axios.post('/api/games')
    window.location.href = `../games/${game.data.id}`
    this.setState({ game: true })
  }
  
  getGame = async () => {
    const gameId = window.location.href.split('/').slice(-1)[0]
    try {
      const game = await axios.get(`/api/games/${gameId}`)
      if (!game.data) this.newGame()
    } catch (err) {console.log(err)}
  }

  getBalls = async () => {
    const gameId = window.location.href.split('/').slice(-1)[0]
    const gameBalls = await axios.get(`/api/games/${gameId}/balls`)
    this.setState({ balls: gameBalls.data })
  }

  newBall = async () => {
    const gameId = window.location.href.split('/').slice(-1)[0]
    const colors = prompt('Please enter new ball colors, seperated by commas.', 'red,blue,yellow,green,orange,black')
    const ballColors = colors ? colors.split(',').filter(color => color).map(color => color.trim()) : null
    if (ballColors) await axios.post(`/api/games/${gameId}/balls`, { ballColors })
    this.getBalls()
  }

  makeDead = async (ballId, deadId) => {
    if (ballId !== deadId) await axios.put(`/api/balls/${ballId}/dead/${deadId}`)
    this.getBalls()
  }

  hitWicket = async ballId => {
    await axios.put(`/api/balls/${ballId}`)
    this.getBalls()
  }

  componentDidMount = async () => {
    this.getGame()
    this.getBalls()
  }

  render() {
    const { balls } = this.state
    const fontSize = `${150 / balls.length}px`
    return (
      <div className="App">
        <div className='buttons'>
          <div className='button' onClick={() => this.newGame()}>
            New Game
          </div>
          <div className='button' onClick={() => this.newBall()}>
            New Balls
          </div>
        </div>
        <div className='balls'>
          {balls.sort((a, b) => a.id - b.id).map(ball => {
            const { color } = ball
            ball.dead = { dead: true }
            ball.deadBalls.push(ball)
            return (
              <div className='ball-list' key={ball.id}>
                <span
                  className='ball'
                  onClick={() => this.hitWicket(ball.id)}
                  style={{ color, fontSize }}>
                  {color}
                </span>
                {ball.deadBalls.sort((a, b) => a.id - b.id).map(deadBall => {
                  const { dead } = deadBall.dead
                  const deadStyle = { color: 'white', textDecoration: 'line-through', fontSize }
                  const aliveSTyle = { color: deadBall.color, textDecoration: 'none', fontSize }
                  if (deadBall.id === ball.id) deadStyle.opacity = 0
                  return (
                    <span key={`${ball.id}-${deadBall.id}`}
                      className='dead'
                      style={dead ? deadStyle : aliveSTyle}
                      onClick={() => this.makeDead(ball.id, deadBall.id)}>
                      {deadBall.color}
                    </span>
                  )
                })}
              </div>)
          })}
        </div>
      </div>
    );
  }
}
export default App;
