import { useRouteError } from "react-router-dom";


const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);
    return (
        <div>
            <h1>Error occured</h1>
        </div>
    );
};

export default ErrorPage;