import { JSX } from "react";
import { Link } from "react-router-dom";

function HeaderComponent(): JSX.Element {
    return <header className="header">
        <h1>Welcome to Conjugator!</h1>
        <nav>
            <ul className="link-list">
                <li>
                    <Link className="link" to="/">Home</Link>
                </li>
                <li>
                    <Link className="link" to="/setup">Configuration</Link>
                </li>
                <li>
                    <Link className="link" to="/list">Verbs </Link>
                </li>
            </ul>
        </nav>
    </header>

}

export default HeaderComponent;