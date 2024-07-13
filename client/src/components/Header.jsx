import logo from './assets/logo.png'
import './Header.css'

export default function Header() {
  return (
    <nav>
      <div className="container">
        <img src={logo} alt="ProjectMgmt Logo" style={{height: '50px'}} />
        <h1>ProjectMgmt</h1>
      </div>
    </nav>
  );
}
