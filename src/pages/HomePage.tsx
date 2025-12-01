import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import {Nav} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
function HomePage(): JSX.Element {

    return <>
        <HeaderComponent />
        <Container>
            <p>
                This site is deployed thanks to github, it's source code is also hosted in github:
                <br/>
                <Link to="https://github.com/rczyzewski/conjugator">https://github.com/rczyzewski/conjugator</Link>
            </p>
            <p>
                Let's play the game!<br/>
                <Button>
                    <Nav.Link href="/conjugator/?/game/sw001">10 MostPopular</Nav.Link>
                </Button>
            </p>
        </Container>
    </>
}

export default HomePage;