import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dqyqjbuku/image/upload/v1671980936/NOTFOUNDIMAGE_vjmn6x.png"
      alt="page not found"
    />
    <h1 className="page-not-found-heading">Page Not Found</h1>
    <p className="page-not-found-message">
      We are sorry, the page you requested could not be found. Please go back to
      the home page
    </p>
    <Link to="/">
      <button type="button" className="home-page-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
