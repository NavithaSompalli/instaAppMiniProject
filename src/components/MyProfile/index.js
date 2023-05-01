import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import {Redirect} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {
    myProfileDetailsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMyProfileDetails()
  }

  getMyProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const myProfileApi = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(myProfileApi, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)

      const newData = {
        followersCount: data.profile.followers_count,
        followingCount: data.profile.following_count,
        id: data.profile.id,
        posts: data.profile.posts,
        postsCount: data.profile.posts_count,
        profilePic: data.profile.profile_pic,
        stories: data.profile.stories,
        userBio: data.profile.user_bio,
        userId: data.profile.user_id,
        UserName: data.profile.user_name,
      }

      this.setState({myProfileDetailsList: newData})
      this.setState({apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderRetryButton = () => {
    this.getMyProfileDetails()
  }

  renderFailureView = () => (
    <div className="my-profile-failure-container">
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
    <div className="loader-container">
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
    const {myProfileDetailsList} = this.state
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
    } = myProfileDetailsList
    return (
      <div className="my-profile-container">
        <div className="profile-details-container">
          <div>
            <img src={profilePic} alt="my profile" className="my-profile-pic" />
          </div>

          <div className="post-follower-container">
            <h1 className="my-profile-name">{UserName}</h1>
            <div className="my-profile-user-container">
              <p className="posts-count">{postsCount} Posts</p>
              <p className="posts-count">{followersCount} Followers</p>
              <p className="posts-count">{followingCount} Following</p>
            </div>
            <p className="my-profile-user-name">{UserName}</p>
            <p className="my-profile-user-bio">{userBio}</p>
          </div>
        </div>
        <ul className="my-profile-user-stories">
          {stories.map(story => (
            <li key={story.id}>
              <img
                src={story.image}
                alt="my story"
                className="my-profile-story-image"
              />
            </li>
          ))}
        </ul>
        <hr className="hr-line" />
        <div className="bs-grid-container">
          <BsGrid3X3 className="grid-icon" />
          <h1 className="posts-grid-name">Posts</h1>
        </div>
        {posts.length === 0 ? (
          <div className="no-post-yet-container">
            <div className="bs-camera">
              <BiCamera />
            </div>

            <h1 className="no-post-yet-heading">No Posts Yet</h1>
          </div>
        ) : (
          <ul className="my-profile-posts">
            {posts.map(post => (
              <li key={post.id}>
                {' '}
                <img src={post.image} alt="my post" className="my-post-image" />
              </li>
            ))}
          </ul>
        )}
      </div>
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
      <div>
        <Header />
        <div className="profile-container">{this.renderAllUserStories()}</div>
      </div>
    )
  }
}

export default MyProfile
