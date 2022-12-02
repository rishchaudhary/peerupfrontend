import { getDatabase, get, set, ref, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "firebase/storage";
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
    static async create_request(
        startTime,
        length,
        date,
        description,
        userID,
        course,
        location,
        format,
        fileAttachments,
        priorityList,
        recurring,
        preferredDays,
        weeks) {

        const dbRef = push(ref(getDatabase(), `Requests/${userID}`));
        const uploadInput = fileAttachments.files;
        const fileURLs = [];
        /* eslint-disable no-await-in-loop */
        /* eslint-disable no-restricted-syntax */
        for (const file of uploadInput) {
            const fileRef = storageRef(getStorage(), `Request_docs/${dbRef.key}/${file.name}`);
            await uploadBytes(fileRef, file).catch((error) => {
                console.log(error);
            });
            await getDownloadURL(fileRef).then((url) => {
                console.log('File uploaded. URL: ', url);
                fileURLs.push(url);
            })
            
        }
        /* eslint-enable no-await-in-loop */
        /* eslint-enable no-restricted-syntax */
        console.log('file URLs: ', fileURLs);
        
        const days = [
            {key:"Mon", value: false},
            {key:"Tue", value: false},
            {key:"Wed", value: false},
            {key:"Thu", value: false},
            {key:"Fri", value: false},
            {key:"Sat", value: false},
            {key:"Sun", value: false},
        ];
        for (let i = 0; i < preferredDays.length; i += 1) {
            days[preferredDays[i]].value = true;
        }

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const requestData = data.Requests;
        const language = data.Language;
        const name = data.Name;
        const totalSessions = preferredDays.length * weeks;

        await set(dbRef, {

            Time: startTime,
            Length: length,
            Date: date,
            Description: description,
            CreatedBy: userID,
            Name: name,
            Format: format,
            Location: location,
            LanguagePreference: language,
            Recurring: recurring,
            Weeks: weeks,
            PreferredDays: days,
            TotalSessionsWanted: totalSessions,
            CourseWanted: course,
            Offers: ['Offer ID'],
            attachmentURLS: fileURLs
        });

        const result = Object.keys(requestData).map((key) => requestData[key]);
        result.push(dbRef.key);

        await set(ref(getDatabase(), `Users/${userID}/Requests`), result);
        const tutorList = await MatchingAlgorithm.match(`${userID}/${dbRef.key}`, priorityList);
        await set(ref(getDatabase(), `Requests/${userID}/${dbRef.key}/MatchedTutors`), tutorList);
        return `${userID}/${dbRef.key}`;

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
            const requestInfo = data.MatchedTutors;
            let result = Object.keys(requestInfo).map((key) => requestInfo[key]);
            console.log(result)
            /* eslint-disable no-await-in-loop */
            for (let j = 0; j < result.length; j += 1) {

                const tutorData = Tutor.get_information(result[j]);
                const tutor = await tutorData.then(val => {return val;});
                const requests = tutor.Requests;
                const result1 = Object.keys(requests).map((key) => requests[key]);

                for (let m = 0; m < result.length; m += 1) {
                    if (requestIDs[i] === result1[m]) {
                        result1.splice(m, 1);
                        console.log(result);
                        await set(ref(getDatabase(), `TutorAccounts/${result[j]}/Requests`), result1);
                        break;
                    }
                }

            }
            /* eslint-disable no-await-in-loop */
            const userData = User.get_information(data.CreatedBy);
            const user = await userData.then(val => {return val;});
            const userinfo = user.Requests;
            result = Object.keys(userinfo).map((key) => userinfo[key]);

            for (let k = 0; k < result.length; k += 1) {
                if (requestIDUser[1] === result[k]) {
                    result.splice(k, 1);
                    console.log(result);
                    await set(ref(getDatabase(), `Users/${data.CreatedBy}/Requests`), result);
                    break;
                }
            }

            await set(ref(getDatabase(), `Requests/${requestIDs[i]}`), null);

        }
        /* eslint-disable no-await-in-loop */

    }

    // If the tutor wants to reject a student request, you must call this function
    // It will remove the request from the tutor's list of requests.
    // As this function is called by the tutor side of the website, you can get the tutorID
    // by calling auth.currentUser.uid
    static async reject_request(requestID, tutorID) {

        const tutorData = Tutor.get_information(tutorID);
        const tutor = await tutorData.then(val => {return val;});
        const requests = tutor.Requests;
        let result = Object.keys(requests).map((key) => requests[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                console.log(result);
                await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Requests`), result);
                break;
            }
        }

        const requestData = Requests.get_information(requestID);
        const request = await requestData.then(val => {return val;});
        const tutorsMatched = request.MatchedTutors;
        result = Object.keys(tutorsMatched).map((key) => tutorsMatched[key]);

        for (let j = 0; j < result.length; j += 1) {
            if (tutorID === result[j]) {
                result.splice(j, 1);
                console.log(result);
                await set(ref(getDatabase(), `Requests/${requestID}/MatchedTutors`), result);
                break;
            }
        }
    }

    // if the tutor accepts the student's tutoring request call this function.
    // It will add the tutor's ID to the list of tutor's who have accepted this request.
    // As this function is called by the tutor side of the website, you can get the tutorID
    // by calling auth.currentUser.uid
    static async create_offer(requestID, tutorID, startTime, length, date, location, format, days) {


        await set(ref(getDatabase(), `Requests/${requestID}/Offers/${tutorID}`), {
            Time: startTime,
            Length: length,
            Date: date,
            Location: location,
            Format: format,
            Tutor: tutorID,
            Days: days
        },);

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
    
    static async get_offer_info(requestID, offerID) {

        const db = getDatabase();
        const offerRef = ref(db, `Requests/${requestID}/Offers/${offerID}`);
        const snapshot = (await (get(offerRef))).toJSON();
        return snapshot;
    }

    static async get_university_courses() {
        const db = getDatabase();
        const coursesRef = ref(db, `University/Purdue`);
        const snapshot = (await (get(coursesRef))).toJSON();
        console.log(snapshot)
        return Object.keys(snapshot);
    }

}
