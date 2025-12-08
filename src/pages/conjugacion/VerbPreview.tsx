import { useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import fetchFromJsonDb, { VerbEntry, Conjugations } from './VerbsService';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router-dom';
import { persons, tiempos } from './Tenses';

export default function VerbPreview(): JSX.Element {

    let params = useParams();

    const [conjugatedVerb, setSelected] = useState<VerbEntry | null>(null)


    useEffect(() => {
        fetchFromJsonDb(0, 1000, (a: VerbEntry) => a.verbo === params.verb)
            .then(it => it[0]!)
            .then(it => { console.log(it); return it })
            .then(it => setSelected(it))

    }, [])

    function conjugacionView(verbEntry : VerbEntry,  mode: string, tiempo: string ): JSX.Element {

        const modeData = verbEntry[mode as keyof VerbEntry] as Conjugations;
        const verb = modeData[tiempo as keyof Conjugations] ;

;


        return <>
            <Col className='col-2'>
                <Card>
                    <Card.Body>
                        <Card.Title> {tiempo}</Card.Title>

                        <ul>
                            {persons.filter(it => verb[it]).map(it => <li> {it} {verb[it]}</li>)}
                        </ul>

                    </Card.Body>
                </Card>
            </Col>
        </>
    }

    return (
        <>
            <HeaderComponent />

            <Container className='py-4'>
                <Row>
                    <Col><Container><hr /><h4>indicativo</h4></Container></Col>
                </Row>
                <Row>
                    {conjugatedVerb && tiempos.filter(it => it[0] === "indicativo").map(it => conjugacionView(conjugatedVerb, ...it))}
                </Row>
                <Row>
                    <Col><Container><hr /><h4>subjuntivo</h4></Container></Col>
                </Row>
                <Row>
                    {conjugatedVerb && tiempos.filter(it => it[0] === "subjuntivo").map(it => conjugacionView(conjugatedVerb, ...it))}
                </Row>
                <Row>
                    <Col><Container><hr /><h4>imperativo</h4></Container></Col>
                </Row>
                <Row>
                    {conjugatedVerb && tiempos.filter(it => it[0] === "imperativo").map(it => conjugacionView(conjugatedVerb, ...it))}
                </Row>
            </Container>

        </>
    )
}