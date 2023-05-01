import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="website-logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dqyqjbuku/image/upload/v1670935866/InstaShareIcon_lzrhwf.jpg"
            alt="website logo"
            className="website-logo-image"
          />
        </Link>
        <h1 className="header-heading">Insta Share</h1>
      </div>
      <ul className="heading-container">
        <li className="search-icon-container">
          <input
            type="search"
            className="search-input"
            placeholder="Search Caption"
          />
          <button type="button" className="fa-search-icon">
            <FaSearch className="search-icon" />
          </button>
        </li>
        <Link to="/">
          <li className="home-button">Home</li>
        </Link>
        <Link to="/my-profile">
          <li className="profile-button">Profile</li>
        </Link>

        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
