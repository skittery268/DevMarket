// Hooks
import { useAuth } from "../hooks/useAuth";

// ---------------------------------------IMPORTS---------------------------------------

const Profile = () => {
    const { user } = useAuth();

    return (
        <section>
            <p>Fullname: {user?.fullname}</p>
            <p>Email: {user?.email}</p>
        </section>
    );
};

export default Profile;