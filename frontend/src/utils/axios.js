import axios from "axios";

const instance = axios.create({
    baseURL: "https://insta-clone-nsz1.vercel.app/",
    withCredentials:true
})

export default instance;