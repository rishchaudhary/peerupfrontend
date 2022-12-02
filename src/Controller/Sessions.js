import {getDatabase, get, ref, set, push} from "firebase/database";
import { Requests } from "./Requests";
import {User} from "./User";
import {Tutor} from "./Tutor";

export class Sessions{

    static async create_session(requestID, tutorID) {

        const requestData = Requests.get_information(requestID);
        const offerData = Requests.get_offer_info(requestID, tutorID)
        const data = await requestData.then(val => {return val;});
        const info = await offerData.then(val => {return val;});



        console.log(info);
        const userID = data.CreatedBy;
        const startTime = info.Time;
        const date = info.Date;
        const weeks = data.Weeks;
        const preferredDays = data.PreferredDays;
        const totalSessions = data.TotalSessionsWanted;
        const recurring = data.Recurring;
        const length = data.Length;
        const description = data.Description;
        const location = info.Location;
        const format = info.Format;
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
            Weeks: weeks,
            Recurring: recurring,
            PreferredDays: preferredDays,
            Tutor: tutorName,
            Completed: false,
            CompletedSubSessions: 0,
            TotalSessions: totalSessions,
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
    
    static async session_completed(sessionID) {



        const sessionData = this.get_info(sessionID);
        const data = await sessionData.then(val => {return val;});
        const tutorID = data.TutorID;
        const recurring = data.Recurring;
        const sessionCompleted = data.CompletedSubSessions;
        const totalSessions = data.TotalSessions;

        if (recurring && sessionCompleted >= totalSessions) {
            await set(ref(getDatabase(), `Sessions/${sessionID}/Completed`), true);
        }

        if (recurring) {
            await set(ref(getDatabase(), `Sessions/${sessionID}/CompletedSubSessions`), sessionCompleted + 1);
        }
        const tutorData = Tutor.get_information(tutorID);
        const data3 = await tutorData.then(val => {return val;});
        const sessionsCompleted = parseFloat(data3.SessionsCompleted) + 1;
        await set(ref(getDatabase(), `TutorAccounts/${tutorID}/SessionsCompleted`), sessionsCompleted);
        await Tutor.update_badge_for_tutor(tutorID);

    }

    static async create_reoccurring_session(sessionID) {

        const sessionData = this.get_info(sessionID);
        const data = await sessionData.then(val => {return val;});
        console.log(data);
        const userID = data.StudentID;
        const userName = data.Student;
        const startTime = data.StartTime;
        const length = data.Length;
        const date = data.Date;
        const description = data.Description;
        const location = data.Location;
        const format = data.Format;
        const tutorID = data.TutorID;
        const tutorName = data.Tutor;

        const userData = User.get_information(userID);
        const data2 = await userData.then(val => {return val;});
        const sessionsUser = data2.Sessions;
        let result = Object.keys(sessionsUser).map((key) => sessionsUser[key]);

        const dbRef = push(ref(getDatabase(), `Sessions/${userID}`));
        await set(dbRef, {

            StartTime: startTime,
            Length: length,
            Date: date,
            Description: description,
            Student: userName,
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
