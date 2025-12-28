import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import Image from 'react-bootstrap/Image';
import { Link } from "react-router-dom";


function BookPresentation({ url , bookLocation, children}: {readonly url: string, readonly bookLocation: string, children: JSX.Element} ): JSX.Element{
            return <Row className="border p-1 m-1">
                <Col className="col-2"> 
                    <Container>
                        <Image src={url} rounded fluid></Image>
                    </Container>
                </Col>

                <Col className="col-8">
                {children}
                
                    <Link to={bookLocation}> GO TO</Link>
                </Col>
        </Row>
}

function CoursePage(): JSX.Element {

    return <>
        <HeaderComponent />
        <Container>
             <BookPresentation bookLocation="/course/es01/chapter/navidad" url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRstV7FcvAR583TpXwpxn5BFLL4bpRJikBoOw&s" >
             <p>Sumérgete en una experiencia lingüística y cultural única diseñada especialmente para aprender español de una forma divertida, significativa y 100 % orientada a la Navidad. Este curso combina vocabulario temático, ejercicios prácticos y contenidos auténticos relacionados con la cultura hispana durante las fiestas, para que no solo estudies el idioma, sino que lo vivas.</p>
             
             </BookPresentation>
             <BookPresentation bookLocation="/course/es01/chapter/food" url="https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg">
             <p>¡Descubre el español a través de uno de sus tesoros más queridos: la comida!
             En este curso vivirás el idioma desde la cocina, los mercados, los bares de tapas y las sobremesas interminables que forman parte del corazón cultural de España. Aprenderás palabras útiles, expresiones naturales y estructuras gramaticales mientras exploras los platos y sabores que hacen famosa a la gastronomía española en todo el mundo.</p>
             </BookPresentation>
             <BookPresentation bookLocation="/course/es01/chapter/health" url="https://assets.puzzlefactory.com/puzzle/453/889/original.jpg" >
             <p>¿Quieres hablar sobre tu cuerpo, tus hábitos y tu bienestar en español con seguridad y naturalidad?
El Curso de Salud en Español te abre la puerta a un vocabulario esencial para el día a día, desde explicar síntomas en una consulta médica hasta hablar de rutinas saludables con amigos. Este curso combina lenguaje práctico, expresiones reales y ejercicios dinámicos, para que puedas comunicarte con claridad cuando más lo necesitas.
{/* <!-- 
¿Quieres hablar sobre tu cuerpo, tus hábitos y tu bienestar en español con seguridad y naturalidad?
El Curso de Salud en Español te abre la puerta a un vocabulario esencial para el día a día, desde explicar síntomas en una consulta médica hasta hablar de rutinas saludables con amigos. Este curso combina lenguaje práctico, expresiones reales y ejercicios dinámicos, para que puedas comunicarte con claridad cuando más lo necesitas.

Durante el curso, descubrirás:

Vocabulario esencial del cuerpo humano, dolencias y emociones físicas, perfecto para desenvolverte en situaciones reales.

Frases clave para usar en farmacias, hospitales y consultas, para que puedas explicar cómo te sientes sin miedo ni dudas.

Costumbres saludables y hábitos del mundo hispanohablante, que te ayudarán a hablar de deporte, comida equilibrada y bienestar general.

Ejercicios prácticos, historias y diálogos, diseñados para memorizar el vocabulario de forma natural y duradera.
--> */}

</p>
             </BookPresentation>
             <BookPresentation bookLocation="/course/es01/chapter/society" url="https://img.freepik.com/premium-vector/ready-travel-flat-vector-illustration_853066-14.jpg" >
             <p>Very different ocmponent</p>
             </BookPresentation>
        </Container>
    </>
}

export default CoursePage;