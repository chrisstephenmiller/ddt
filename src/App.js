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
      if (!game.data.id) this.newGame()
      return game
    } catch (err) { console.log(err) }
  }

  getBalls = async () => {
    const gameId = window.location.href.split('/').slice(-1)[0]
    const gameBalls = await axios.get(`/api/games/${gameId}/balls`)
    if (!gameBalls.data.length) this.newBalls()
    this.setState({ balls: gameBalls.data })
  }

  newBalls = async () => {
    const gameId = window.location.href.split('/').slice(-1)[0]
    const colors = prompt('Please enter ball colors, separated by commas.', 'red,blue,yellow,green,orange,black')
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
    const validate = window.location.pathname.split('/')
    if (validate[1] !== 'games') window.location.href = '../games/'
    else if (!validate[2] || +validate[2] < 1) this.newGame()
    else {
      const game = await this.getGame()
      if (game.data.id) this.getBalls()
    }
  }

  render() {
    const { balls } = this.state
    const fontSize = `${48 / balls.length}vh`
    const lineHeight = `${68 / balls.length}vh`
    return (
      <div className="App">
        <div className='balls'>
          {balls.sort((a, b) => a.id - b.id).map(ball => {
            const { color } = ball
            ball.dead = { dead: true }
            ball.deadBalls.push(ball)
            return (
              <div className='ball-list' key={ball.id}>
                <p
                  className='ball'
                  onClick={() => this.hitWicket(ball.id)}
                  style={{ backgroundColor: color, color: 'white', fontSize, lineHeight }}>
                  {color}
                </p>
                <hr style={{width: '100%', margin: '0px'}}></hr>
                {ball.deadBalls.sort((a, b) => a.id - b.id).map(deadBall => {
                  const { dead } = deadBall.dead
                  const backgroundColor = deadBall.color
                  const deadStyle = { color: 'white', textDecoration: 'line-through', border: `1px solid ${backgroundColor}`, fontSize, lineHeight, backgroundColor }
                  const aliveSTyle = { color: backgroundColor, textDecoration: 'none', border: `1px solid ${backgroundColor}`, fontSize, lineHeight, backgroundColor: 'white' }
                  if (deadBall.id === ball.id) deadStyle.opacity = 0
                  return (
                    <p key={`${ball.id}-${deadBall.id}`}
                      className='dead'
                      style={dead ? deadStyle : aliveSTyle}
                      onClick={() => this.makeDead(ball.id, deadBall.id)}>
                      {deadBall.color}
                    </p>
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
