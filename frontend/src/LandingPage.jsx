import {Link} from "react-router-dom";

const LandingPage = () => {
    return (
        <div>
            <Link to={"/login"}>Login</Link>
            <Link to={"/signup"}>Signup</Link>
            <h1>Welcome to E-Commerce Platform</h1>
        </div>  
    )
}

export default LandingPage;