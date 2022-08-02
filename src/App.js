import Counter from './components/Counter'
import logo from './logo.svg'
import './App.css'
// import Login from './components/login/Login'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<Counter />
			</header>
			{/* <Login /> */}
		</div>
	)
}

export default App
