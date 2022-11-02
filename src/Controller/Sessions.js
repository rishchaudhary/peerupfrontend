import { getDatabase, get,ref, set } from "firebase/database";
import { Requests } from "./Requests";
import {User} from "./User";
import {Tutor} from "./Tutor";

export class Sessions{

    static async create_session(sessionID, requestID, tutorID) {

        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const userID = data.CreatedBy;
        const startTime = data.Time;
        const length = data.Length;
        const date = data.Date;
        const description = data.Description;
        const location = data.Location;
        const format = data.IsOnline;

        await set(ref(getDatabase(), `Sessions/${sessionID}`), {

            StartTime: startTime,
            Length: length,
            Date: date,
            Description: description,
            Student: userID,
            Tutor: tutorID,
            Completed: false,
            Location: location,
            Format: format
        });

        await Requests.delete_request(requestID);

        const userData = User.get_information(userID);
        const data2 = await userData.then(val => {return val;});
        const sessionsUser = data2.Sessions;
        let result = Object.keys(sessionsUser).map((key) => sessionsUser[key]);
        result.push(sessionID);
        await set(ref(getDatabase(), `Users/${userID}/Sessions`), result);

        const tutorData = Tutor.get_information(tutorID);
        const data3 = await tutorData.then(val => {return val;});
        const sessionsTutor = data3.Sessions;
        result = Object.keys(sessionsTutor).map((key) => sessionsTutor[key]);
        result.push(sessionID);
        await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Sessions`), result);

    }

    static async session_completed(sessionID) {

        await set(ref(getDatabase(), `Sessions/${sessionID}/Completed`), true);
    }

    static async delete_session(sessionID) {

        const sessionData = this.get_information(sessionID);
        const data = await sessionData.then(val => {return val;});
        const student = data.Student;
        const tutor = data.Tutor;

        const userData = User.get_information(student);
        const data2 = await userData.then(val => {return val;});
        const sessionsUser = data2.Sessions;
        let result = Object.keys(sessionsUser).map((key) => sessionsUser[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < result.length; i += 1) {
            if (sessionID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `Users/${student}/Sessions`), result);
                break;
            }
        }
        /* eslint-disable no-await-in-loop */
        const tutorData = Tutor.get_information(tutor);
        const data3 = await tutorData.then(val => {return val;});
        const sessionsTutor = data3.Sessions;
        result = Object.keys(sessionsTutor).map((key) => sessionsTutor[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < result.length; i += 1) {
            if (sessionID === result[i]) {
                result.splice(i, 1);
                await set(ref(getDatabase(), `TutorAccounts/${tutor}/Sessions`), result);
                break;
            }
        }
        /* eslint-disable no-await-in-loop */

        await set(ref(getDatabase(), `Sessions/${sessionID}`), null);

    }

    static async get_information(sessionID) {

        const db = getDatabase();
        const sessionRef = ref(db, `Sessions/${sessionID}`);
        const snapshot = (await (get(sessionRef))).toJSON();
        return snapshot;

    }


}