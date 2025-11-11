const Header = ({ title }) => {
  return (
    <h2>{title}</h2>
  )
}

const Part = ({ part }) => {
  return (
    <p> {part.name} {part.exercises} </p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(note =>
        <Part key={note.id} part={note}/>
      )}
    </>
  )
}

const Total = ({ parts }) => {
  let sum = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <b> total of {sum} exercises </b>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course
