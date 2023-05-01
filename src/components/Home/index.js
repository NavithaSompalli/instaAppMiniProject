import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'

import {Redirect} from 'react-router-dom'

import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import Header from '../Header'
import ReactSlider from '../ReactSlider'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userStoriesList: [],
    postApiStatus: apiStatusConstants.initial,
    userPostList: [],
    isHeartActiveId: '',
  }

  componentDidMount() {
    this.getUserProfiles()
    this.getUserProfilePosts()
  }

  getUserProfiles = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const userProfileApi = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(userProfileApi, options)
    if (response.ok === true) {
      const storiesData = await response.json()
      // console.log(storiesData)
      const newData = storiesData.users_stories.map(stories => ({
        storyUrl: stories.story_url,
        userId: stories.user_id,
        userName: stories.user_name,
      }))

      this.setState({
        userStoriesList: newData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getUserProfilePosts = async () => {
    this.setState({
      postApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const postApiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(postApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateData = data.posts.map(post => ({
        postId: post.post_id,
        profilePic: post.profile_pic,
        userId: post.user_id,
        userName: post.user_name,
        postDetails: post.post_details,
        comments: post.comments,
        createdAt: post.created_at,
        likesCount: post.likes_count,
      }))

      this.setState({
        userPostList: updateData,
        postApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        postApiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickTryAgain = () => {
    this.getUserProfiles()
  }

  renderUserSliderListView = () => {
    const {userStoriesList} = this.state
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <ul className="home-container">
        <Slider {...settings} className="slider-container">
          {userStoriesList.map(eachUser => (
            <ReactSlider key={eachUser.userId} userDetails={eachUser} />
          ))}
        </Slider>
      </ul>
    )
  }

  renderSliderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dqyqjbuku/image/upload/v1672135428/alert-triangle_tvr84c.png"
        alt="failure view"
      />
      <p>Something Went Wrong. Please try again</p>
      <button type="button" onClick={this.onClickTryAgain}>
        Try Again
      </button>
    </div>
  )

  onClickPostTryAgain = () => {
    this.getUserProfilePosts()
  }

  renderPostFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dqyqjbuku/image/upload/v1672135428/alert-triangle_tvr84c.png"
        alt="failure view"
      />
      <p>Something Went Wrong. Please try again</p>
      <button type="button" onClick={this.onClickPostTryAgain}>
        Try Again
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

  renderAllUserStories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUserSliderListView()
      case apiStatusConstants.failure:
        return this.renderSliderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onClickActive = async id => {
    const jwtToken = Cookies.get('jwt_token')
    const isLikeStatus = {
      like_status: true,
    }

    const postLikeApi = `https://apis.ccbp.in/insta-share/posts/${id}/like`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },

      body: JSON.stringify(isLikeStatus),
    }

    const response = await fetch(postLikeApi, options)
    if (response.ok === true) {
      this.setState({isHeartActiveId: id})
    }
  }

  renderUserPostView = () => {
    const {userPostList, isHeartActiveId} = this.state
    return (
      <ul className="posts-container">
        {userPostList.map(posts => (
          <li key={posts.postId} className="post-item">
            <div className="profile-container">
              <img
                src={posts.profilePic}
                alt="post author profile"
                className="profile-image"
              />
              <p className="user-name">{posts.userName}</p>
            </div>
            <img
              src={posts.postDetails.image_url}
              alt="post"
              className="post-image"
            />
            <div className="container">
              <div className="icons-container">
                {isHeartActiveId === `${posts.postId}` ? (
                  <button
                    type="button"
                    className="bs-heart-btn"
                    onClick={() => this.onClickActive(posts.postId)}
                  >
                    <FcLike />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bs-heart-btn"
                    onClick={() => this.onClickActive(posts.postId)}
                  >
                    <BsHeart />
                  </button>
                )}
                <FaRegComment className="fa-reg-comment" />
                <BiShareAlt className="bi-share-icon" />
              </div>
              {isHeartActiveId === `${posts.postId}` ? (
                <p>{`${posts.likesCount + 1} likes`}</p>
              ) : (
                <p>{`${posts.likesCount} likes`}</p>
              )}
              <p className="caption">{posts.postDetails.caption}</p>
              <ul>
                {posts.comments.map(comment => (
                  <p className="comment">
                    <span className="comment-user-name">{`${comment.user_name}`}</span>{' '}
                    {`${comment.comment}`}
                  </p>
                ))}
              </ul>
              <p className="created-post">{posts.createdAt}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderUserPosts = () => {
    const {postApiStatus} = this.state

    switch (postApiStatus) {
      case apiStatusConstants.success:
        return this.renderUserPostView()
      case apiStatusConstants.failure:
        return this.renderPostFailureView()
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
      <>
        <div className="main-container">
          <Header />
          <div className="home-elements-container">
            {this.renderAllUserStories()}
          </div>
          {this.renderUserPosts()}
        </div>
      </>
    )
  }
}

export default Home
