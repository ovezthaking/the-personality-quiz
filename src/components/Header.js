import { Link } from "react-router-dom";

export default function Header(){
    return (
        <header>
        <h1><b>What Element Are You?</b></h1>
        <p>(based on completely random things)</p>
        <Link to='/'>Home</Link> <span>     </span>
        <Link to="/quiz">Quiz</Link>
        </header>
    );
}