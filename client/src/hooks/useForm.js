// React tools
import { useState } from "react"

// ---------------------------------------IMPORTS---------------------------------------

// Custom hook to handle forms
export const useForm = (initValue) => {
    const [formData, setFormData] = useState(initValue || {});

    // Function to handle input change
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Function to handle form submit
    const handleSubmit = (e, cb) => {
        e.preventDefault();

        cb(formData);
    };

    // Function to clear input fields after submit form
    const resetForm = () => setFormData(initValue || {});

    return [formData, handleChange, handleSubmit, resetForm];
};
