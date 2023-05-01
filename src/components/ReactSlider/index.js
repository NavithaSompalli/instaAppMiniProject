/* Add css to your project */
import './index.css'
import {Link} from 'react-router-dom'

const ReactSlider = props => {
  const {userDetails} = props
  const {userId, storyUrl, userName} = userDetails
  console.log(userId)

  return (
    <li className="user-container" key={userId}>
      <img className="image" src={storyUrl} alt="user story" />
      <h1 className="name">
        {' '}
        <Link to={`/users/${userId}`}>{userName}</Link>
      </h1>
    </li>
  )
}

export default ReactSlider
