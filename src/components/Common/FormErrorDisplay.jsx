const FormErrorDisplay = ({ error }) => {
    return (
        <div className="flex items-start mb-2">
            <span className="text-red-500 self-start">{error}</span>
        </div>
    );
};

export default FormErrorDisplay;
