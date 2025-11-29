import { JSX } from "react";
import HeaderComponent from "../components/HeaderComponent";

function HomePage(): JSX.Element {


    return <>
        <HeaderComponent />
        <div>HomePage</div>
        <p>
            This site is deployed thanks to github, it's source code is also hosted in github:  https://github.com/rczyzewski/conjugator
        </p>
        <div></div>

    </>



}

export default HomePage;