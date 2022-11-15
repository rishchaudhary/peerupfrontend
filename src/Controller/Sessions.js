import {getDatabase, get, ref, set, push} from "firebase/database";
import { Requests } from "./Requests";
import {User} from "./User";
import {Tutor} from "./Tutor";

export class Sessions{

    static async create_session(requestID, tutorID) {

        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        console.log(data);
        const userID = data.CreatedBy;
        const startTime = data.Time;
        const length = data.Length;
        const date = data.Date;
        const description = data.Description;
        const location = data.Location;
        const format = data.Format;
        const tutorData1 = User.get_information(tutorID);
        const data7 = await tutorData1.then(val => {return val;});
        const tutorName = data7.Name;

        await Requests.delete_request([requestID]);
        const userData = User.get_information(userID);
        const data2 = await userData.then(val => {return val;});
        const sessionsUser = data2.Sessions;
        const nameStudent = data2.Name;
        let result = Object.keys(sessionsUser).map((key) => sessionsUser[key]);

        const dbRef = push(ref(getDatabase(), `Sessions/${userID}`));
        await set(dbRef, {

            StartTime: startTime,
            Length: length,
            Date: date,
            Description: description,
            Student: nameStudent,
            StudentID: userID,
            TutorID: tutorID,
            Tutor: tutorName,
            Completed: false,
            Location: location,
            Format: format,
            id: result.length
        });

        result.push(`${dbRef.key}`);
        await set(ref(getDatabase(), `Users/${userID}/Sessions`), result);

        const tutorData = Tutor.get_information(tutorID);
        const data3 = await tutorData.then(val => {return val;});
        const sessionsTutor = data3.Sessions;
        result = Object.keys(sessionsTutor).map((key) => sessionsTutor[key]);
        result.push(`${userID}/${dbRef.key}`);
        await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Sessions`), result);

    }
    
    static async get_info(sessionID) {

        const db = getDatabase();
        const sessionRef = ref(db, `Sessions/${sessionID}`);
        const snapshot = (await (get(sessionRef))).toJSON();
        return snapshot;
    }
}
