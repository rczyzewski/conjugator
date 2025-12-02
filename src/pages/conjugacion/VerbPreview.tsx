import { useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import fetchFromJsonDb, { VerbEntry, Conjugations } from './VerbsService';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'

const tiempos : Array<[string, string]> =[
    ["indicativo", "presente"],
    ["indicativo", "futuro"],
     ["indicativo", "condicional"],
     ["indicativo", "imperfecto"],
     ["indicativo", "preterito"],
     ["subjuntivo", "presente"],
     ["subjuntivo", "futuro"],
     ["subjuntivo", "imperfecto"],
     ["subjuntivo", "imperfecto2"],

    ["imperativo", "afirmativo"],
    ["imperativo", "negativo"]
]
const persons = [ "1s", "2s", "3s" , "1p", "2p", "3p" ]

export default function VerbPreview(): JSX.Element {

    const [conjugatedVerb, setSelected] = useState<VerbEntry | null>(null)


    useEffect(() => {
        fetchFromJsonDb(0, 10, (a: VerbEntry) => a.verbo === "hablar")
            .then(it => it[0]!)
            .then( it=> {console.log(it); return it } )
            .then(it => setSelected(it))

    }, [])

    function ddd(verbEntry : VerbEntry,  mode: string, tiempo: string ): JSX.Element {

        const modeData = verbEntry[mode as keyof VerbEntry] as Conjugations;
        const verb = modeData[tiempo as keyof Conjugations] ;

;


        return <>
            <Card>
                <Card.Title>{mode} {tiempo}</Card.Title>
                <Card.Body>
            { persons.filter(it=> verb[it]  ).map(it=> <h2> {it} {verb[it]}</h2>) }

                </Card.Body>
            </Card>
        </>
    }

    return (
        <>
            <HeaderComponent />
            
            <Container >
               {  conjugatedVerb && tiempos.map(it=> ddd(conjugatedVerb, ...it) )} 

            </Container>

        </>
    )
}