const handleFormErrors = (error, setErrors, setServerResponse) => {
    if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach(err => {
            // Check if the error path is nested within address
            if (err.path.startsWith("address.")) {
                // Remove "address." prefix to get the nested field name
                const nestedField = err.path.replace("address.", "");
                // Set error for nested field
                validationErrors.address = {
                    ...validationErrors.address,
                    [nestedField]: err.message
                };
            } else {
                // Set error for non-nested field
                validationErrors[err.path] = err.message;
            }
        });
        setErrors(validationErrors);
    } else {
        console.error("Error:", error);
        setServerResponse({ status: "failed", message: error.response?.data?.message });
    }
};

export default handleFormErrors;