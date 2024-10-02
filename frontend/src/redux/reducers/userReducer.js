const initialState = {
    username: '',
    fullname: '',
    email: '',
    profileImage: '',
    followers: [],
    following: [],
    bio: '',
    follower_count: '',
    following_count: '',
    posts: '',
    isLoggedIn: false,
    token:''
}

function userReducer(state = { initialState }, action) {
    console.log(action.type);
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                username: action.payload.username,
                fullname: action.payload.fullname,
                email: action.payload.email,
                profileImage: action.payload.profileImage,
                followers: action.payload.followers,
                following: action.payload.following,
                bio: action.payload.bio,
                follower_count: action.payload.follower_count,
                following_count: action.payload.following_count,
                posts: action.payload.posts,
                isLoggedIn: true,
            }
        case 'GET_USER':
            return state;
        case 'SET_AFTER_UNFOLLOW':
            return {
                ...state,
                following: action.payload.following,
                following_count:action.payload.following_count
            }
        case 'SET_AFTER_POST':
            return {
                ...state,
                posts:action.payload.data
            }
        case 'SET_IMAGE_CHANGE':
            return {
                ...state,
                profileImage:action.payload.profileImage
            }
        case 'SET_BIO':
            return {
                ...state,
                bio:action.payload.bio
            }
        case 'SET_LOGOUT':
            return {
                ...state,
                isLoggedIn: false
            }
        default:
            return state;
    }
}

export default userReducer;