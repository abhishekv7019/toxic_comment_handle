import { BrowserRouter as Router, Routes, Route }
	from 'react-router-dom';
import SignUpPage from './auth/signup';
import LoginPage from './auth/login';
import Homepage from './homepage';
import Postitpage from './postit';
import Post_specific_page from './post_specificpage';
  
function App() {
  return (
    <Router>
			<Routes>
				<Route exact path='/' element={<LoginPage/>} />
				<Route path='/signup' element={<SignUpPage/>} />
				<Route path='/home' element={<Homepage/>} />
				<Route path='/postit' element={<Postitpage/>} />
				<Route path='/postspecific/:postId' element={<Post_specific_page/>} />
			</Routes>
	</Router>
  );
}

export default App;
