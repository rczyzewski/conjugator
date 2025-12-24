import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import Image from 'react-bootstrap/Image';
import { Link } from "react-router-dom";

function BookPresentation({ url }: {url: string} ): JSX.Element{
            return <Row>
                <Col className="col-2"> 
                    <Container>
                        <Image src={url} rounded fluid></Image>
                    </Container>
                </Col>

                <Col className="col-8">
                <p>Comida! </p>
                    <Link to="/course/es01/chapter/food"> GO TO</Link>
                </Col>
        </Row>
}

function CoursePage(): JSX.Element {

    return <>
        <HeaderComponent />
        <Container>
             <BookPresentation url="https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg"></BookPresentation>
             <BookPresentation url="https://assets.puzzlefactory.com/puzzle/453/889/original.jpg" ></BookPresentation>
             <BookPresentation url="https://img.freepik.com/premium-vector/ready-travel-flat-vector-illustration_853066-14.jpg" ></BookPresentation>
        </Container>
    </>
}

export default CoursePage;