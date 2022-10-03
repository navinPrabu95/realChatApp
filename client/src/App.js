import logo from './logo.svg';
import './App.css';
import Home from './Screens/Home/Home';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import ChatPage from './Screens/Chat/ChatPage';
// import {useNavigate} from 'react-router-dom'
// import {ChatState} from './Context/ChatContext'




function App() {

  return (
    <div className="App">
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/chat' element={<ChatPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
