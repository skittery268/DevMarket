// Hooks
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

// ---------------------------------------IMPORTS---------------------------------------

const Login = () => {
    const [formData, handleChange, handleSubmit, resetForm] = useForm({
        email: "",
        password: ""
    });

    const { login } = useAuth();

    const googleOAuth = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <form onSubmit={(e) => { handleSubmit(e, login); resetForm() }}>
            <h1>Login</h1>
            <input type="email" name="email" placeholder="Email..." value={formData.email} onChange={handleChange} />
            <br />
            <input type="password" name="password" placeholder="Password..." value={formData.password} onChange={handleChange} />
            <br />
            <button onClick={googleOAuth} type="button">Continue with google</button>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;