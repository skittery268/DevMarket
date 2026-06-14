// React router
import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";

// ---------------------------------------IMPORTS---------------------------------------

const Nav = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            <p><NavLink to={"/"}>Home</NavLink></p>
            
            {
                user ? (
                    <>
                        <p><NavLink to={"/profile"}>Profile</NavLink></p>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <p><NavLink to={"/login"}>Login</NavLink></p>
                        <p><NavLink to={"/register"}>Register</NavLink></p>
                    </>
                )
            }
        </nav>
    );
};

export default Nav;