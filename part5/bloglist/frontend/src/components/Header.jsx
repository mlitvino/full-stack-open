const Header = ({ user, handleLogout }) => {
  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button type="logout" onClick={handleLogout}>logout</button>
      </p>
    </div>
  )
}

export default Header
