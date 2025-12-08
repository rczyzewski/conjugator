import { ChangeEvent, JSX, useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";

import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/esm/Form";
import FormRange from "react-bootstrap/esm/FormRange";
import congationService, { IConjugacionSettings } from "./ConjugactionSettingsService";
import { Tense, tenses } from "./Tenses";

export default function ConjugationsSettings(): JSX.Element {


    let [settings, setSettings] = useState<IConjugacionSettings>();
    useEffect(() => {
        let ddd = congationService.getConutatyionSetting()
        setSettings(ddd)
    }, [])

    function handleOnChange(e: ChangeEvent) {
        let value = (e.target as HTMLInputElement).value
        let name = (e.target as HTMLInputElement).name
        console.log("dddd ", name, value)
        let tmpSettings = { ...settings, [name]: value } as IConjugacionSettings
        congationService.setConutatyionSetting(tmpSettings)
        setSettings(tmpSettings)


        console.log(settings)
    }
    function handleSwitchOn(e: ChangeEvent) {
        let id = (e.target as HTMLInputElement).id

        if (settings) {
            let enabled = settings.tenses.some(i => i.id == id)

            let selectedTenses: Tense[] = [];
            if (!enabled) {
                console.log("enabling Id", id)
                selectedTenses = [...settings.tenses || [], ...tenses.filter(it => it.id === id)]
            } else {
                console.log("disabling Id", id)
                selectedTenses = (settings.tenses || []).filter(it => it.id !== id)

            }
            let newSettings = { ...settings, tenses: selectedTenses } as IConjugacionSettings
            setSettings(newSettings)
            congationService.setConutatyionSetting(newSettings)
        }
    }


    if (!settings) { return <h1>Loading </h1> }
    console.log(settings)
    return <>

        <HeaderComponent />
        <Container>
            <Row className="justify-content-center my-5">
                <Col className="col-lg-6">

                    <Form.Label  >Select amount of verbs tobe trained( 1 - 1000), currently {settings.verbsTopLimit}</Form.Label>
                    <FormRange min="5" max="1000"
                        name="verbsTopLimit"
                        onChange={handleOnChange}
                        value={settings.verbsTopLimit || 10} ></FormRange>
                    <hr />
                    <Form >
                        <Form.Label  >Tenses to be Trained:</Form.Label>

                        {tenses.map((it, index) =>
                            <Form.Check
                                key={index}
                                checked={settings.tenses.some(i => i.id === it.id)}
                                onChange={handleSwitchOn}
                                name="tense"
                                type="switch"
                                id={it.id}
                                label={it.fullName}
                            />
                        )
                        }

                    </Form>

                </Col>
            </Row>
        </Container>
    </>
    return <><Container>Loading configuration</Container></>
}
