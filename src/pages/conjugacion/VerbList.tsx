import {useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import ListGroup from 'react-bootstrap/ListGroup';
import fetchData, { VerbEntry } from './VerbsService';
import InfiniteScroll from "react-infinite-scroll-component";


export default function VerbList(): JSX.Element {

    const refresh = () => { console.log("refresh") }

    const [items, setItems] = useState<VerbEntry[]>([])

    const getData = () => { 
        //TODO:  just to get some test items
        fetchData(10).then(it =>
            setItems([...items, ...it])
        )
    }

    useEffect(getData, [])

    return (
        <>
            <HeaderComponent />
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
                <ListGroup>
                    {items.map((it) => (
                        <ListGroup.Item>{it.verbo}</ListGroup.Item>
                    ))}
                </ListGroup>
            </InfiniteScroll>
        </>
    );
}


