import { getDatabase, get, set, ref, push } from "firebase/database";
import { User } from "./User";
import {Tutor} from "./Tutor";
import {MatchingAlgorithm} from "./MatchingAlgorithm";

export class Requests {

    // These function will be called when the user wants to create a new studying request.
    // It stores the request data in the db under Requests/RequestID.
    // The requestID is also added to the user's list of requests (Users/userID/Requests)
    // Function inputs --
    // requestID -- any whole number (must be hard coded for now)
    // startTime -- a string telling when the session is supposed to start
    // length -- a string telling how long the session will be
    // date -- a string telling the date when the session has been requested
    // description -- a string containing a description of what the student wants in this session
    // userID -- can be given by auth.currentUser.uid
    // course -- The course for which they want help. Example input 'CS180'
    // format (string) -- Online or In-Person
    // location (string) -- where the session is being hosted. If the Format is Online give
    // N/A for the location.
    static async create_request( startTime, length, date, description, userID, course, location, format, name) {

        const dbRef = push(ref(getDatabase(), `Requests/${userID}`));
        await set(dbRef, {

            Time: startTime,
            Length: length,
            Date: date,
            Description: description,
            CreatedBy: userID,
            Name: name,
            Format: format,
            Location: location,
            LanguagePreference: 'English',
            CourseWanted: course,
            TutorsWhoAccepted: ["N/A"]
        });

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const requestData = data.Requests;
        const result = Object.keys(requestData).map((key) => requestData[key]);
        result.push(dbRef.key);

        await set(ref(getDatabase(), `Users/${userID}/Requests`), result);
        await MatchingAlgorithm.match(`${userID}/${dbRef.key}`);


    }

    // This function is used to delete a request if the student is no longer wanting
    // the requested session.
    // This function will remove each of the tutors who had accepted this request.
    // It will change TutorAccounts/tutorID/RequestsYouAccepted for each of these tutors.
    static async delete_request(requestIDs) {

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < requestIDs.length; i += 1 ) {
            const requestIDUser = requestIDs[i].split('/');

            const requestData = Requests.get_information(requestIDs[i]);
            const data = await requestData.then(val => {return val;});
            const requestInfo = data.TutorsWhoAccepted;
            let result = Object.keys(requestInfo).map((key) => requestInfo[key]);
            console.log(result)
            /* eslint-disable no-await-in-loop */
            for (let j = 1; j < result.length; j += 1) {
                console.log(result[i])
                await this.remove_tutor_from_request(requestIDs[i], result[j]);

            }
            /* eslint-disable no-await-in-loop */
            const userData = User.get_information(data.CreatedBy);
            const user = await userData.then(val => {return val;});
            const userinfo = user.Requests;
            result = Object.keys(userinfo).map((key) => userinfo[key]);

            for (let k = 0; k < result.length; k += 1) {
                if (requestIDUser[1] === result[k]) {
                    result.splice(k, 1);
                    await set(ref(getDatabase(), `Users/${data.CreatedBy}/Requests`), result);
                    break;
                }
            }

            await set(ref(getDatabase(), `Requests/${requestIDs[i]}`), null);

        }
        /* eslint-disable no-await-in-loop */

    }

    // If the tutor wants to reject a student request, yoy must call this function
    // It will remove the request from the tutor's list of requests.
    // As this function is called by the tutor side of the website, you can get the tutorID
    // by calling auth.currentUser.uid
    static async reject_request(requestID, tutorID,) {

        const tutorData = Tutor.get_information(requestID);
        const tutor = await tutorData.then(val => {return val;});
        const requests = tutor.Requests;
        const result = Object.keys(requests).map((key) => requests[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Requests`), result);
                break;
            }
        }
    }

    // if the tutor accepts the student's tutoring request call this function.
    // It will add the tutor's ID to the list of tutor's who have accepted this request.
    // As this function is called by the tutor side of the website, you can get the tutorID
    // by calling auth.currentUser.uid
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

    // If the tutor has accepted the student's tutoring request and later decides that
    // they don't want to tutor that student then call this function.
    // This function will remove the tutor from the list of tutor's who accepted the request
    // but will not delete that request in the tutor profile.
    static async remove_tutor_from_request(requestID, tutorID){

        const requestData = this.get_information(requestID);
        console.log('I am here');
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
        const data4 = data2.Requests;
        result = Object.keys(data3).map((key) => data3[key]);
        console.log('I am here');
        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `TutorAccounts/${tutorID}/RequestsYouAccepted`), result);
                break;
            }
        }

        result = Object.keys(data4).map((key) => data4[key]);
        console.log(result);
        console.log('I am here');
        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Requests`), result);
                return;
            }
        }

    }

    static update_time(requestID, startTime) {

        set(ref(getDatabase(), `Requests/${requestID}/Time`), startTime);

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

        set(ref(getDatabase(), `Requests/${requestID}/Format`), format);

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
