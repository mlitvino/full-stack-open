"use strict";
import { useGood, useNeutral, useBad, useFeedbackActions } from './store'

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
  const good = useGood()
  const neutral = useNeutral()
  const bad = useBad()
  const { good: addGood, neutral: addNeutral, bad: addBad } = useFeedbackActions()

  return (
    <div>
      <Header title='give feedback'/>
      <Button onClick={addGood} name='good' />
      <Button onClick={addNeutral} name='neutral' />
      <Button onClick={addBad} name='bad' />
      <Header title='statistics'/>
      <Statistics  good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
