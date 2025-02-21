import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from "./redux/Store.jsx";
import { Provider } from "react-redux";
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import "react-toastify/dist/ReactToastify.css";

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
      <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
    </Provider>
  </StrictMode>,
)
