import React from "react";
import Event from './Event';
import { Notification } from 'react-notification';

class EventPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            status: '',
            statusTitle: ''
        };

        this.componentDidMount = this.componentDidMount.bind(this);

    }

    componentDidMount() {
        const token = localStorage.token;
        fetch('/api/events', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then((res) => res.json())
            .then((data) => this.setState({events: data}));
    }

    removeEvent(id) {
        let form = new FormData();
        form.append('id',id);
        form.append('_method','DELETE');

        const token = localStorage.token;

        fetch('/api/event/' + id, {
            method: 'POST',
            body: form,
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        })
            .then((res) => {
                const statusOk = res.status === 200;
                const statusTitle = statusOk ? 'SUCCESS' : 'ERROR';
                const status = statusOk ? 'The event has been updated.' : 'Something went wrong';

                this.toggleNotification(statusTitle,status);
                this.removeEventFromState(id);

                return res.json();
            })
            .then((data) => console.log(data));

    }
    removeEventFromState(id){
        const events = this.state.events.filter((event) => event.id !== id);
        this.setState({events: events})
    }

    toggleNotification(statusTitle = '',status = '') {
        this.setState({statusTitle: statusTitle, status: status,notification: !this.state.notification})
    }

    render() {
        const events = this.state.events;

        const eventList = events.map((event) => {

                const {title, description, start, end, id} = event;

                return (
                    <Event key={id} removeEvent={() => this.removeEvent(id)} title={title} description={description} start={start} end={end} id={id}/>
                )
            }
        );

        return (
            <div>
                <div className="container">
                    <h3>My Events</h3>
                    <div className="card event-list">
                        <a className="btn btn-primary link-button event-form-btn-add" href="/events/create">Add Event</a>
                        <table>
                            <tbody>
                            {eventList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Notification
                    isActive={this.state.notification}
                    message={this.state.status}
                    action="Dismiss"
                    title={this.state.statusTitle}
                    style={false}
                    onDismiss={this.toggleNotification.bind(this)}
                    onClick={() =>  this.setState({ notification: false })}
                />
            </div>
        )
    }
}
export default EventPage;