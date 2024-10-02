import axios from "axios";

const instance = axios.create({
    baseURL: "https://insta-clone-4ph5.onrender.com",
    withCredentials:true
})

export default instance;