import React, {Component} from 'react';
import { getAuth } from 'firebase/auth';

// Components
import RequestType from '../../../components/RequestForm/RequestType';
import DateTime from '../../../components/RequestForm/DateTime';
import FormatDetails from '../../../components/RequestForm/FormatDetails';
import AdditionalDetails from '../../../components/RequestForm/AdditionalDetails';
import RecurringTable from "../../../components/RequestForm/RecurringTable";
import SelectCourse from '../../../components/RequestForm/SelectCourse';


const auth = getAuth();

export default class CreateRequestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            userID: auth.currentUser.uid,
            course: '',
            otherCourse: '',
            date: '',
            time: '',
            length: '',
            location: '',
            format: '',
            files: [],
            matchPriority: ["course", "day", "time", "language"],
            recurring: false,
            rDays: [],
            rNumWeeks: 0,
        }
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({step: step - 1});
    }

    nextStep = () => {
        const { step } = this.state;
        this.setState({step: step + 1})
    }

    jumpStep = () => {
        const { step } = this.state;
        this.setState({step: step + 5})
        this.setState({recurring: true})
    }

    handleChange = input => e => {
        console.log("Handle Change Called: ", input, e.target.value)
        this.setState({ [input]: e.target.value });
    }

    render() {
        const { step } = this.state;
        const {
            userID,
            course,
            otherCourse,
            date,
            time,
            length,
            location,
            format,
            files,
            matchPriority,
            recurring,
            rDays,
            rNumWeeks,
        } = this.state
        const values = {
            userID,
            course,
            otherCourse,
            date,
            time,
            length,
            location,
            format,
            files,
            matchPriority,
            recurring,
            rDays,
            rNumWeeks
        }

        switch (step) {
            case 1:
                return (
                    <RequestType
                        nextStep={ this.nextStep }
                        jumpStep={ this.jumpStep }
                    />
                )
            case 2:
                return (
                    <SelectCourse
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            default:
                return (
                    <h3>TESTING</h3>
                )
        }
    }
}