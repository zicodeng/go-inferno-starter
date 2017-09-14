import Component from "inferno-component";
import { connect } from "inferno-redux";

import * as UserActions from "scripts/redux/actions/user-actions";

@connect((Store) => {
    return {
        user: Store.user
    };
})

class App extends Component<any, any> {
    private count: number = 0;

    constructor(props, context) {
        super(props, context);
        this.state = {
            data: "my data",
            count: 0
        }
    }

    public render() {
        return (
            <div>
                <h1>{ this.state.data }</h1>
                <h2>{ `User Name: ${ this.props.user.name }` }</h2>
                <h2>{ `User Age: ${ this.props.user.age }` }</h2>
                <button onclick={ (e) => { this.handleBtnClicked(e) } }>SET AGE</button>
            </div>
        )
    }

    private handleBtnClicked(e) {
        this.props.dispatch(UserActions.setAge(this.count));
        this.count += 2;
    }
}

export default App;