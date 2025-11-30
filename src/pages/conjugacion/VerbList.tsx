import {useEffect, useState, useRef, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import  fetchFromJsonDb, { VerbEntry } from './VerbsService';
import InfiniteScroll from "react-infinite-scroll-component";
import  ListGroup  from 'react-bootstrap/ListGroup';
export default function VerbList(): JSX.Element {

    const refresh = () => { console.log("refresh") }

    const [items, setItems] = useState<VerbEntry[]>([])

    const firstRender = useRef(true);

    const getData = (start: number, end: number) => {

        fetchFromJsonDb(start, end)
            .then(it => setItems([...items, ...it]))
    }

    useEffect(() => { if (firstRender.current) { firstRender.current = false; getData(0, 100) } }, [])

    return (
        <>
            <HeaderComponent />
            <InfiniteScroll
                dataLength={items.length} //This is important field to render the next data
                next={() => {
                    getData(items.length, items.length + 10)
                }}

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
                <ListGroup>
                    {items.map((it, index) => (
                        <ListGroup.Item key={index}>
                            <h2> {it.verbo}</h2>

                        </ListGroup.Item>

                    ))

                    }
                </ListGroup>
            </InfiniteScroll>
        </>
    );
}


