import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfileRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userProfileList: [],
  }

  componentDidMount() {
    this.getUserProfileApi()
  }

  getUserProfileApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const userProfileApi = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(userProfileApi, options)
    // console.log(response)
    if (response.ok === true) {
      const userProfileData = await response.json()
      // console.log(userProfileData)
      const userData = {
        followersCount: userProfileData.user_details.followers_count,
        followingCount: userProfileData.user_details.following_count,
        id: userProfileData.user_details.id,
        posts: userProfileData.user_details.posts,
        postsCount: userProfileData.user_details.posts_count,
        profilePic: userProfileData.user_details.profile_pic,
        stories: userProfileData.user_details.stories,
        userBio: userProfileData.user_details.user_bio,
        userId: userProfileData.user_details.user_id,
        UserName: userProfileData.user_details.user_name,
      }

      this.setState({userProfileList: userData})
      this.setState({apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderRetryButton = () => {
    this.getUserProfileApi()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dqyqjbuku/image/upload/v1672135428/alert-triangle_tvr84c.png"
        alt="failure view"
      />
      <p>Something Went Wrong. Please try again</p>
      <button type="button" onClick={this.renderRetryButton}>
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="user-profile-loader-container">
      <Loader
        type="TailSpin"
        color="#0b69ff"
        height="50"
        width="50"
        className="oval-icon"
      />
    </div>
  )

  renderProfileSuccessView = () => {
    const {userProfileList} = this.state
    const {
      followersCount,
      followingCount,
      id,
      posts,
      postsCount,
      profilePic,
      stories,
      userBio,
      userId,
      UserName,
    } = userProfileList
    return (
      <ul key={id}>
        <img
          src={profilePic}
          alt="user profile"
          className="user-profile-image"
        />
        <h1 className="user-profile-name">{UserName}</h1>
        <p className="user-post-count">{`${postsCount} Posts`}</p>
        <p className="user-followers-count">{`${followersCount} Followers`}</p>
        <p className="user-following-count">{`${followingCount} Following`}</p>
        <p className="user-post-profile-name">{`${userId}`}</p>
        <p className="user-bio">{`${userBio}`}</p>
        <ul className="user-stories-profile-list-container">
          {stories.map(story => (
            <img
              src={story.image}
              alt="user story"
              className="user-stroy-image"
            />
          ))}
        </ul>
        <hr className="user-profile-hr-line" />
        <BsGrid3X3 className="bs-grid" />
        <h1 className="posts">Posts</h1>
        {posts.length === 0 ? (
          <div className="no-post-yet-container">
            <div className="bs-camera">
              <BiCamera />
            </div>

            <h1 className="no-post-yet-heading">No Posts Yet</h1>
          </div>
        ) : (
          <ul className="user-posts-profile-container">
            {posts.map(post => (
              <li key={post.id}>
                <img
                  src={post.image}
                  alt="user post"
                  className="user-profile-post-image"
                />
              </li>
            ))}
          </ul>
        )}
      </ul>
    )
  }

  renderAllUserStories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="user-profile-container">
        <Header />
        {this.renderAllUserStories()}
      </div>
    )
  }
}

export default UserProfileRoute
