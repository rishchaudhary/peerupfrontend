import { getDatabase, get, set, ref } from "firebase/database";
import {Requests} from './Requests';
import {Tutor} from './Tutor'

export class MatchingAlgorithm{


    static async match(requestID) {

        const requestData = Requests.get_information(requestID)
        const data = await requestData.then(val => {return val;});
        const language = data.LanguagePreference;
        const course = data.CourseWanted;

        const tutorListData = this.get_all_tutors();
        const data2 = await tutorListData.then(val => {return val;});
        const tutorIDs = Object.keys(data2);

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < tutorIDs.length; i += 1) {

            const tutorData = Tutor.get_information(tutorIDs[i]);
            const data3 = await tutorData.then(val => {return val;});
            const verifiedCourses = data3.VerifiedCourses;
            const requests = data3.Requests;
            const verifiedCoursesArray = Object.keys(verifiedCourses).map((key) => verifiedCourses[key]);
            const requestsArray = Object.keys(requests).map((key) => requests[key]);
            const languageTutor = data3.Language;

            for (let j = 0; j < verifiedCoursesArray.length; j += 1) {

                if ((verifiedCoursesArray[j] === course) && (language === languageTutor)) {

                    requestsArray.push(requestID);
                    set(ref(getDatabase(), `TutorAccounts/${tutorIDs[i]}/Requests`), requestsArray);
                }

            }
        }
        /* eslint-disable no-await-in-loop */


    }


    static async get_all_tutors() {

        const db = getDatabase();
        const tutorRef = ref(db, `TutorAccounts`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
    }
}