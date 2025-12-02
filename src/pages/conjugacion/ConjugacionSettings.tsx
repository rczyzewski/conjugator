import { JSX } from "react";
import HeaderComponent from "../../components/HeaderComponent";

import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/esm/Form";
import FormRange from "react-bootstrap/esm/FormRange";

export default function ConjugationsSettings(): JSX.Element {
    return <>
        <HeaderComponent />
        <Container>
            <Row className="justify-content-center my-5">
                <Col className="col-lg-6">
                    <Form>
                        <Form.Label  >Tenses to be Trained:</Form.Label>
                        <Form.Select multiple={true} aria-label="Default select example">
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Form>
                    <Form.Label  >Range of verbs</Form.Label>
                    <FormRange  ></FormRange>
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain letters and numbers,
                        and must not contain spaces, special characters, or emoji.
                    </Form.Text>

                </Col>
            </Row>
        </Container>
    </>
}
