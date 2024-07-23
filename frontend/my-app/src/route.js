import { BrowserRouter as Router, Routes, Route }
	from 'react-router-dom';
import SignUpPage from './auth/signup';
import LoginPage from './auth/login';
import Homepage from './homepage';
import Postitpage from './postit';
  
function App() {
  return (
    <Router>
			<Routes>
				<Route exact path='/' element={<LoginPage/>} />
				<Route path='/signup' element={<SignUpPage/>} />
        <Route path='/home' element={<Homepage/>} />
        <Route path='/postit' element={<Postitpage/>} />
			</Routes>
		</Router>
  );
}

export default App;
