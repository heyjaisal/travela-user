import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

export const fetchMessages = (conversationId) =>
  axios.get(`${API_URL}/${conversationId}`).then((res) => res.data);

export const sendMessage = (messageData) =>
  axios.post(API_URL, messageData).then((res) => res.data);
