const ErrorContent = ({ status, message }) => {
    return (
        <div className="flex items-center justify-center min-h-screen z-2">
            <div className="text-center">
                <div className="mb-4">
                    {status ?
                        <h1 className="text-6xl mb-0">{status}</h1> :
                        <h2 className="text-4xl">SORRY!</h2>
                    }
                </div>
                <div>
                    <div className="font-light">
                        {message}
                    </div>
                </div>
                <div className="mt-5">
                    <p className="font-medium">
                        Copyright © All rights reserved | made by Sm15700
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorContent;