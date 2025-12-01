import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from 'react-bootstrap/Container';
function HomePage(): JSX.Element {

    return <>
        <HeaderComponent />
        <Container>
            <h2>404</h2>
            <p>
                Ups! Looks like we cant find the page you are looking for.
            </p>
        </Container>
    </>
}

export default HomePage;