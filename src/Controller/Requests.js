import { getDatabase, get, set, ref} from "firebase/database";
import { User } from "./User";
import {Tutor} from "./Tutor";

export class Requests { 

    static async create_request(requestID, startTime, length, date, description, userID, course, location, format) {

        await set(ref(getDatabase(), `Requests/${requestID}`), {

            Time: startTime,
            Length: length,
            Date: date,
            Description: description,
            CreatedBy: userID,
            IsOnline: format,
            Location: location,
            LanguagePreference: 'English',
            CourseWanted: course,
            TutorsWhoAccepted: ["N/A"]
        });

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const requestData = data.Requests;
        const result = Object.keys(requestData).map((key) => requestData[key]);
        result.push(requestID);
        await set(ref(getDatabase(), `Users/${userID}/Requests`), result);

    }

    static async delete_request(requestID) {

        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const requestInfo = data.TutorsWhoAccepted;
        let result = Object.keys(requestInfo).map((key) => requestInfo[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result.length; i += 1) {

            await this.remove_tutor_to_request(requestID, result[i]);
        }
        /* eslint-disable no-await-in-loop */
        const userData = User.get_information(data.CreatedBy);
        const user = await userData.then(val => {return val;});
        const userinfo = user.Requests;
        result = Object.keys(userinfo).map((key) => userinfo[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `Users/${data.CreatedBy}/Requests`), result);
                break;
            }
        }
        
        set(ref(getDatabase(), `Requests/${requestID}`), null);
      
    }

    static async add_tutor_to_request(requestID, tutorID) {

        const requestData = this.get_information(requestID);
        const data1 = await requestData.then(val => {return val;});
        const data = data1.TutorsWhoAccepted;
        let result = Object.keys(data).map((key) => data[key]);
        result.push(tutorID);
        await set(ref(getDatabase(), `Requests/${requestID}/TutorsWhoAccepted`), result);

        const tutorData = Tutor.get_information(tutorID);
        const data2 = await tutorData.then(val => {return val;});
        const data3 = data2.RequestsYouAccepted;
        result = Object.keys(data3).map((key) => data3[key]);
        result.push(requestID);
        await set(ref(getDatabase(), `TutorAccounts/${tutorID}/RequestsYouAccepted`), result);

    }

    static async remove_tutor_to_request(requestID, tutorID){

        const requestData = this.get_information(requestID);
        const data1 = await requestData.then(val => {return val;});
        const data = data1.TutorsWhoAccepted;
        let result = Object.keys(data).map((key) => data[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (tutorID === result[i]) {
                result.splice(i, 1);
                console.log(result);
                await set(ref(getDatabase(), `Requests/${requestID}/TutorsWhoAccepted`), result);
                break;
            }
        }

        const tutorData = Tutor.get_information(tutorID);
        const data2 = await tutorData.then(val => {return val;});
        const data3 = data2.RequestsYouAccepted;
        result = Object.keys(data3).map((key) => data3[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `TutorAccounts/${tutorID}/RequestsYouAccepted`), result);
                return;
            }
        }

    }

    static update_time(requestID, startTime) {
        
        set(ref(getDatabase(), `Requests/${requestID}/StartTime`), startTime);
        
    }

    static update_language_preference(requestID, language) {

        set(ref(getDatabase(), `Requests/${requestID}/LanguagePreference`), language);

    }

    static update_length(requestID, length) {

        set(ref(getDatabase(), `Requests/${requestID}/Length`), length);

    }

    static update_date(requestID, date) {

        set(ref(getDatabase(), `Requests/${requestID}/Date`), date);
        
    }

    static update_description(requestID, description) {
        
        set(ref(getDatabase(), `Requests/${requestID}/Description`), description);
        
    }

    static update_course(requestID, course) {
        
        set(ref(getDatabase(), `Requests/${requestID}/Course`), course);
        
    }

    static update_location(requestID, location) {

        set(ref(getDatabase(), `Requests/${requestID}/Location`), location);

    }

    static update_format(requestID, format) {

        set(ref(getDatabase(), `Requests/${requestID}/IsOnline`), format);

    }

    static async get_information(requestID) {

        const db = getDatabase();
        const requestRef = ref(db, `Requests/${requestID}`);
        const snapshot = (await (get(requestRef))).toJSON();
        return snapshot;
        
    }

    static async data(snapshot) {
        const info = await snapshot.then(val => {return val;});
        return info;
    }

}