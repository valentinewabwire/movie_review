import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:8500/api" }); //http://localhost:3000/auth/signup

export default client;
