import { JSX } from "react";


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function HeaderComponent(): JSX.Element {

    return <header className="header">
        <Navbar expand="lg" className="bg-body-tertiary" >
            <Container>
                <Navbar.Brand href="/conjugator">Conjugator</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav >
                        <Nav.Item >
                            <Nav.Link href="/conjugator/?/game/sw001">Play</Nav.Link>
                        </Nav.Item>
                        <Nav.Item >
                            <Nav.Link href="/conjugator/?/all-verbs">Verbs</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/conjugator/?/setup">Settings</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>

}

export default HeaderComponent;