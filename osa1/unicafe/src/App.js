import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
      <td>{props.end}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good < 1 && props.neutral < 1 && props.bad < 1)
    return <div><h1>statistics</h1><p>No feedback given</p></div>

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.total} />
          <StatisticLine text="average" value={props.average} />
          <StatisticLine text="positive" value={props.percentage} end="%" />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [score, setScore] = useState(0)
  const [average, setAverage] = useState(0)
  const [percentage, setPercentage] = useState(0)


  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + bad + neutral)
    setScore(score + 1)
    setAverage((updatedGood - bad) / (total + 1))
    setPercentage(updatedGood / (total + 1) * 100)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + bad + updatedNeutral)
    setAverage((good - bad) / (total + 1))
    setPercentage(good / (total + 1) * 100)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + updatedBad + neutral)
    setScore(score - 1)
    setAverage((good - updatedBad) / (total + 1))
    setPercentage(good / (total + 1) * 100)
  }

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} percentage={percentage} />
      </div>
    </div>
  )
}

export default App
