import {useEffect, useState, useRef, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import InfiniteScroll from "react-infinite-scroll-component";
import {  Col, Container } from 'react-bootstrap';
import  Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom';

import service, { ConjugactionHistoryVerb } from "./ConjugactionHistory";

export default function ConjugationHistoryList(): JSX.Element {

    const refresh = () => { console.log("refresh") }

    const [items, setItems] = useState<ConjugactionHistoryVerb[]>([])

    const firstRender = useRef(true);

    const getData = () => {
        
        service.findInTimeRange()
            .then(it => setItems([...items, ...it]))
    }

    useEffect(() => { if (firstRender.current) { firstRender.current = false; getData() } }, [])

    return (
        <>
            <HeaderComponent />
            <Container >
            <InfiniteScroll 
                dataLength={items.length} //This is important field to render the next data
                next={getData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                // below props only if you need pull down functionality
                refreshFunction={refresh}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                }
            >
                    {items.map((it, index) => (
                        <Row key={index}>
                            <Col><Link to={ "/single/"+ it.infinitivo }> {it.infinitivo}</Link></Col>
                            <Col>{it.answer}, {it.mode}</Col>
                        </Row>

                    ))

                    }
            </InfiniteScroll>
        </Container>
    </>
    );
}


