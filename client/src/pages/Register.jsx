// Hooks
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

// ---------------------------------------IMPORTS---------------------------------------

const Register = () => {
    const [formData, handleChange, handleSubmit, resetForm] = useForm({
        fullname: "",
        email: "",
        password: ""
    });

    const { register } = useAuth();

    const googleOAuth = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <form onSubmit={(e) => { handleSubmit(e, register); resetForm() }}>
            <h1>Register</h1>
            <input type="text" name="fullname" placeholder="Fullname..." value={formData.fullname} onChange={handleChange} />
            <br />
            <input type="email" name="email" placeholder="Email..." value={formData.email} onChange={handleChange} />
            <br />
            <input type="password" name="password" placeholder="Password..." value={formData.password} onChange={handleChange} />
            <br />
            <button onClick={googleOAuth} type="button">Continue with google</button>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;