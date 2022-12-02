import React, {Component} from 'react';
import { getAuth } from 'firebase/auth';

// Components
import RequestType from '../../../components/RequestForm/RequestType';
import DateTime from '../../../components/RequestForm/DateTime';
import FormatDetails from '../../../components/RequestForm/FormatDetails';
import AdditionalDetails from '../../../components/RequestForm/AdditionalDetails';
import SelectCourse from '../../../components/RequestForm/SelectCourse';
import MatchPriority from '../../../components/RequestForm/MatchPriority'
import ReqConfirmation from '../../../components/RequestForm/ReqConfirmation';
import RecurringDates from '../../../components/RequestForm/RecurringDates';
import PostRequest from '../../../components/RequestForm/PostRequest';

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
            location: 'Online',
            format: '',
            description: '',
            files: [],
            matchPriority: ["course", "day", "time", "language"],
            recurring: false,
            rDays: [],
            rNumWeeks: '',
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

    jumpStep = (newStep) => {
        this.setState({step: newStep})
        if (newStep === 1) {
            this.setState({recurring: false})
        } else if (newStep === 2) {
            this.setState({recurring: true})
        }
    }

    handleChange = input => e => {
        console.log("Handle Change Called: ", input, e.target.value)
        this.setState({ [input]: e.target.value });
    }

    handleDateChange = (newDate) => {
        const dateData = newDate.$d.toString();
        const dateVal = dateData.split(' ').slice(0, 4);
        const finalDate = `${dateVal[0]}, ${dateVal[1]} ${dateVal[2]}, ${dateVal[3]}`;
        console.log("Date Changed: ", finalDate)
        this.setState({date: finalDate})
    }

    handleTimeChange = (newTime) => {
        const timeData = newTime.$d.toString();
        const timeVal = timeData.split(' ')[4];
        const timeVals = timeVal.split(':');
        let finalTime = '';
        if (Number(timeVals[0]) < 12) {
            finalTime = `${timeVals[0]}:${timeVals[1]} AM`
        } else if (Number(timeVals[0]) > 12) {
            finalTime = `${Number(timeVals[0]) - 12}:${timeVals[1]} PM`
        } else {
            finalTime = `${timeVals[0]}:${timeVals[1]} PM`
        }
        console.log("Time Changed: ", finalTime)
        this.setState({time: finalTime})
    }

    handlePriorities = (newOrder) => {
        console.log("Priorities:", newOrder)
        this.setState({matchPriority: newOrder})
    }

    handleRecurringDays = (selectedDays) => {
        console.log("Recurring Days:", selectedDays)
        this.setState({rDays: selectedDays})
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
            description,
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
            description,
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
                        handleChange={ this.handleChange }
                    />
                )
            case 2:
                return (
                    <SelectCourse
                        nextStep={ this.nextStep }
                        jumpStep={ this.jumpStep }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            case 3:
                return (
                    <DateTime
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        handleDateChange={ this.handleDateChange }
                        handleTimeChange={ this.handleTimeChange }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            case 4:
                return (
                    <FormatDetails
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            case 5:
                return (
                    <AdditionalDetails
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            case 6:
                return (
                    <MatchPriority
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        handlePriorities={ this.handlePriorities }
                        values={ values }
                    />
                )
            case 7:
                return (
                    <ReqConfirmation
                        nextStep={ this.nextStep }
                        prevStep={ this.prevStep }
                        values={ values }
                    />
                )
            case 8:
                console.log('values:', values)
                return (
                    <PostRequest
                        jumpStep={ this.jumpStep }
                        values={ values }
                    />
                )
            case 9:
                return (
                    <RecurringDates
                        jumpStep={ this.jumpStep }
                        handleDateChange={ this.handleDateChange }
                        handleTimeChange={ this.handleTimeChange }
                        handleRecurringDays={ this.handleRecurringDays }
                        handleChange={ this.handleChange }
                        values={ values }
                    />
                )
            default:
                // Nothing
        }
    }
}