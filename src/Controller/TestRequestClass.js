import {Requests} from "./Requests";
import {Tutor} from "./Tutor";
import {User} from "./User";


export class TestRequestClass {

    constructor() {
        this.requestID = null;
    }

    async test_create_request(time, length, date, description, course, location, format, name) {

        this.requestID = await Requests.create_request(time, length, date, description, 'test3', course, location, format, name);
        const requestData = Requests.get_information(this.requestID);
        const data = await requestData.then(val => {
            return val;
        });
        console.log(data);
    }

    async test_add_tutor_to_request() {

        const tutorData = Tutor.get_information('test2');
        const data = await tutorData.then(val => {
            return val;
        });
        const data2 = data.RequestsYouAccepted;
        const result = Object.keys(data2).map((key) => data2[key]);
        await Requests.add_tutor_to_request(this.requestID, 'test2');

        const tutorData1 = Tutor.get_information('test2');
        const data3 = await tutorData1.then(val => {
            return val;
        });
        const data4 = data3.RequestsYouAccepted;
        const result1 = Object.keys(data4).map((key) => data4[key]);

        console.log(`The list of accepted requests for the tutor before -- ${result}`);
        console.log(`The list of accepted requests for the tutor after -- ${result1}`);

    }

    async test_remove_tutor_from_request() {

        const tutorData = Tutor.get_information('test2');
        const data = await tutorData.then(val => {
            return val;
        });
        const data2 = data.RequestsYouAccepted;
        const result = Object.keys(data2).map((key) => data2[key]);

        await Requests.remove_tutor_from_request(this.requestID, 'test2');

        const tutorData1 = Tutor.get_information('test2');
        const data3 = await tutorData1.then(val => {
            return val;
        });
        const data4 = data3.RequestsYouAccepted;
        const result1 = Object.keys(data4).map((key) => data4[key]);

        console.log(`The list of accepted requests for the tutor before -- ${result}`);
        console.log(`The list of accepted requests for the tutor after -- ${result1}`);

    }

    async test_delete_request() {

        const userData = User.get_information('test3');
        const data = await userData.then(val => {
            return val;
        });
        const data2 = data.Requests;
        const result = Object.keys(data2).map((key) => data2[key]);
        console.log(this.requestID)
        await Requests.delete_request([this.requestID]);

        const userData1 = User.get_information('test3');
        const data3 = await userData1.then(val => {
            return val;
        });
        const data4 = data3.Requests;
        const result1 = Object.keys(data4).map((key) => data4[key]);

        console.log(`The list of requests for the user before -- ${result}`);
        console.log(`The list of requests for the user after -- ${result1}`);

    }
}
