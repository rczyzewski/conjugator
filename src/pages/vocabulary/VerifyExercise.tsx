import { useState, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import { ListItemBlock } from '../../book/bookModel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';
import { renderBlock } from '../../book/BookDisplayHelpers';

interface VerifyExerciseProps {
    readonly instructions?: string;
    readonly items: ListItemBlock;
}

export default function VerifyExercise({ instructions, items }: VerifyExerciseProps): JSX.Element {

    console.log(items)

    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    const [verifyMode, setVerifyMode] = useState<boolean>(false);

    const handleToggle = (index: number) => {
        if (verifyMode) return; // Don't allow changes in verify mode
        
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <Container className="border m-2" style={{ backgroundColor: "#FAFAFA" }}>
            <Nav className="navbar navbar-light bg-light justify-content-between">
                <span className="navbar-brand">
                    {instructions || "Select the correct statements"}
                </span>
                {items && (
                    <Button 
                        variant="primary" 
                        onClick={() => setVerifyMode(true)}
                        disabled={verifyMode}
                    >
                        Check
                    </Button>
                )}
            </Nav>
            <div className="p-3">
                {items.items
                .map((item , index) => {
                    const isChecked = checkedItems.has(index);
                    return <Row>
                            <Col className="col-1">
                                <Form.Check
                                    key={index}
                                    type="switch"
                                    id={`verify-item-${index}`}
                                    checked={isChecked}
                                    onChange={() => handleToggle(index)}

                                    disabled={verifyMode}
                                    className="mb-2"
                                />
                            </Col>
                            <Col> 
                                { renderBlock(item)} 
                            </Col>
                        </Row>
                })}
            </div>
        </Container>
    );
}
