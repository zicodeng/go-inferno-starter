import Inferno from "inferno";

import { Provider } from "inferno-redux";
import Store from "scripts/redux/store";

// Import container.
import App from "scripts/redux/containers/app";

// Import stylesheets.
import "stylesheets/entries/app.scss";

Inferno.render(
    <Provider store={ Store }>
        <App />
    </Provider>,
    document.getElementById("app")
);