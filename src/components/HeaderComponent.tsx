import { JSX } from "react";


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function HeaderComponent(): JSX.Element {

        //<Route path='/game/sw001' element={<VerbList title='Basic exercise for spanish conjugation' range={10}/>} />
    return <header className="header">
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/conjugator">Conjugator</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Conjugacion Training" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/conjugator/?/game/sw001">10 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw002">20 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw003">30 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw004">50 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw005">70 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw006">100 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw007">150 MostPopular</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/game/sw008">200 MostPopular</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/conjugator/?/list">Trained Conjugations</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/all-verbs">All verbs</NavDropdown.Item>
                            <NavDropdown.Item href="/conjugator/?/setup">Game Settings</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>

}

export default HeaderComponent;