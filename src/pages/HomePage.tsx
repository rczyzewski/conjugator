import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
function HomePage(): JSX.Element {

    return <>
        <HeaderComponent />
        <Container>
            <p>
                This site is deployed thanks to github, it's source code is also hosted in github:
                <br />
                <Link to="https://github.com/rczyzewski/conjugator">https://github.com/rczyzewski/conjugator</Link>
            </p>
            <p> Let's play the game!<br />
                <Button>
                    <Nav.Link href="/conjugator/?/game/sw001">10 MostPopular</Nav.Link>
                </Button>
            </p>

            <p> Join the full spanish course<br />
                <Button>
                    <Nav.Link href="/conjugator/?/course/01">Spanish Course</Nav.Link>
                </Button>
            </p>
            <p> The real fun is when you share your exercises with others!<br />
                <Button>
                    <Nav.Link href="/conjugator/?/game/editor">Create</Nav.Link>
                </Button>
            </p>
        </Container>
    </>
}

export default HomePage;