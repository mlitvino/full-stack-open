"use strict";
import { useState } from 'react'

const Header = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

const Button = ({ name, onClick }) => {
  return (
    <button onClick={onClick}>{name}</button>
  )
}

const handleClick = (setFunc) => {
  return () => setFunc(prev => prev + 1)
}

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )
}

const Statistics  = ({good, neutral, bad}) => {
  const all = good + neutral + bad

  if (all === 0)
    return <>No feedback given</>

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good}/>
        <StatisticsLine text="neutral" value={neutral}/>
        <StatisticsLine text="bad" value={bad}/>
        <StatisticsLine text="all" value={all}/>
        <StatisticsLine text="average" value={(good - bad) / all}/>
        <StatisticsLine text="positive" value={(good * 100) / all}/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header title='give feedback'/>
      <Button onClick={handleClick(setGood)} name='good' />
      <Button onClick={handleClick(setNeutral)} name='neutral' />
      <Button onClick={handleClick(setBad)} name='bad' />
      <Header title='statistics'/>
      <Statistics  good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
