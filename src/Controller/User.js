import {getDatabase, ref, set, remove, get, onValue} from "firebase/database";
import { Requests } from "./Requests";
import {Review} from "./Review"
import { Tutor } from "./Tutor";
import {Feedback} from './Feedback';
import { Sessions } from "./Sessions";

 
export class User {

    static async create_account(userID, emailAddress, fullName, major, standing, preferredDays, preferredTimings) {
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

        const times = [
            {key:"Morning", value: false},
            {key:"Afternoon", value: false},
            {key:"Evening", value: false},
        ];
        for (let i = 0; i < preferredTimings.length; i += 1) {
            times[preferredTimings[i]].value = true;
        }

        const data = User.get_all_users();
        const data2 = await data.then(val => {return val;});
        let data3;
        if (data2 === null) {
            data3 = 0;
        }

        else {
            data3 = Object.keys(data2).length;
        }


        set(ref(getDatabase(), `Users/${userID}`), {
            Name: fullName,
            Email: emailAddress,
            HasTutorAccount: false,
            Sessions: ["Session ID"],
            Requests: ["Request ID"],
            Reviews: ["Review ID"],
            Major: major,
            Standing: standing,
            PreferredDays: days,
            PreferredTimings: times,
            Bio: 'Go to settings to update your bio!',
            University: 'Purdue',
            Language: 'English',
            Feedback: ['Feedback ID'],
            Rating: 0,
            UserID: userID,
            id: data3
        
        })
        .then(() => "Data Saved Successfully")
        .catch((error) => {
            console.log(error)
            return error;
        });

    }


    static async delete_account(userID){

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const userDataRequests = data.Requests;
        let result = Object.keys(userDataRequests).map((key) => userDataRequests[key]);
        let result7 = [];
        for (let l = 1; l < result.length; l += 1) {
            result7[l - 1] = `${userID}/${result[l]}`;
        }

        console.log(result7);
        await Requests.delete_request(result7);

        const userDataReviews = data.Reviews;
        result = Object.keys(userDataReviews).map((key) => userDataReviews[key]);
        result7 = [];
        for (let l = 1; l < result.length; l += 1) {
            result7[l - 1] = `${userID}/${result[l]}`;
        }
        await Review.delete_review(result7);


        const feedbackData = data.Feedback;
        result = Object.keys(feedbackData).map((key) => feedbackData[key]);
        result7 = [];
        for (let l = 1; l < result.length; l += 1) {
            result7[l - 1] = result[l];
        }

        await Feedback.delete_feedback(result7);

        const sessionData = data.Sessions;
        const result4 = Object.keys(sessionData).map((key) => sessionData[key]);

        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result4.length; i += 1) {

            const data = Sessions.get_info(`${userID}/${result4[i]}`);
            const data2 = await data.then(val => {return val;});
            const tutorID = data2.TutorID;

            const data3 = Tutor.get_information(tutorID);
            const data4 = await data3.then(val => {return val;});
            const sessions = data4.Sessions;
            const result3 = Object.keys(sessions).map((key) => sessions[key]);
            console.log(result3);
            for (let j = 0; j < result3.length; j += 1) {

                if (result3[j] === `${userID}/${result4[i]}`) {
                    result3.splice(j, 1);
                    await set(ref(getDatabase(), `TutorAccounts/${tutorID}/Sessions`), result3);
                    break;
                }
            }
            await set(ref(getDatabase(), `Sessions/${userID}/${result4[i]}`), null);
        }

        const hasTutorAccount = data.HasTutorAccount;

        if (hasTutorAccount) {
            await Tutor.delete_profile(userID);
        }


        remove(ref(getDatabase(), `Users/${userID}`))

            .then(() => {
                return "Data Deleted Successfully";
            })
            .catch((error) => {
                return error;
            });

    }


    static async user_rating(userID) {

        const userData = this.get_information(userID);
        const data = await userData.then(val => {return val;});
        const feedback = data.Feedback;
        let rating = data.Rating;
        const result = Object.keys(feedback).map((key) => feedback[key]);
        console.log(`The length is ${result.length}`);

        if (result.length > 3) {

            const feedbackData =  Feedback.getFeedbackInformation(result[result.length - 1]);
            const info = await feedbackData.then(val => {return val;});
            rating += parseFloat(info.Rating);
            rating /= 2;
            set(ref(getDatabase(), `Users/${userID}/Rating`), rating);

        }

        else if (result.length === 3 ) {


            let sum = 0.0;
            /* eslint-disable no-await-in-loop */
            for (let i = 1; i < result.length; i += 1) {
                const feedbackData =  Feedback.getFeedbackInformation(result[i]);
                const info = await feedbackData.then(val => {return val;});
                sum += parseFloat(info.Rating);
                console.log(sum);

            }
            /* eslint-disable no-await-in-loop */
            set(ref(getDatabase(), `Users/${userID}/Rating`), sum / (result.length - 1));

        }

        else {
            set(ref(getDatabase(), `Users/${userID}/Rating`), 0);
        }
    }


    static update_preferred_days(userID, updatedValues) {

        const days = [
            {key:"Mon", value: false},
            {key:"Tue", value: false},
            {key:"Wed", value: false},
            {key:"Thu", value: false},
            {key:"Fri", value: false},
            {key:"Sat", value: false},
            {key:"Sun", value: false},
        ];
        for (let i = 0; i < updatedValues.length; i += 1) {
            days[updatedValues[i]].value = true;
        }
        set(ref(getDatabase(), `Users/${userID}/PreferredDays`), days);

        
    }

    static update_preferred_times(userID, updatedValues) {

        const times = [
            {key:"Morning", value: false},
            {key:"Afternoon", value: false},
            {key:"Evening", value: false},
        ];
        for (let i = 0; i < updatedValues.length; i += 1) {
            times[updatedValues[i]].value = true;
        }

        set(ref(getDatabase(), `Users/${userID}/PreferredTimings`), times);
        
    }

    static update_name(userID, name) {

        set(ref(getDatabase(), `Users/${userID}/Name`), name);
    }

    static update_language(userID, language) {

        set(ref(getDatabase(), `Users/${userID}/Language`), language);
    }


    static update_email(userID, newEmail) {

        set(ref(getDatabase(), `Users/${userID}/Email`), newEmail);
    }

    static update_bio(userID, bio) {

        set(ref(getDatabase(), `Users/${userID}/Bio`), bio);
    }

    static update_major(userID, major) {

        set(ref(getDatabase(), `Users/${userID}/Major`), major);
    }
    
    static update_standing(userID, standing) {

        set(ref(getDatabase(), `Users/${userID}/Standing`), standing);
    }

    static update_university(userID, university) {

        set(ref(getDatabase(), `Users/${userID}/University`), university);
    }

    static async get_user_requests(userID) {
        const db = getDatabase();
        const reqObjsRef = ref(db, `Requests/${userID}`);
        const userReqObjs = (await get(reqObjsRef)).toJSON();

        const reqIdArr = Object.keys(userReqObjs)
        const reqObjsArr = Object.values(userReqObjs)

        const reqObjs = []
        let i = 0;
        reqIdArr.forEach(reqId => {
            const reqObject = reqObjsArr[i]
            console.log("The Object", reqObject)
            if (reqObject != null) {
                reqObjs.push({
                    id: reqId,
                    time: reqObject.Time,
                    length: reqObject.Length,
                    date: reqObject.Date,
                    description: reqObject.Description,
                    name: reqObject.Name,
                    format: reqObject.Format,
                    location: reqObject.Location,
                    language: reqObject.LanguagePreference,
                    recurring: reqObject.Recurring,
                    weeks: reqObject.Weeks,
                    prefDays: reqObject.PreferredDays,
                    numSess: reqObject.TotalSessionsWanted,
                    course: reqObject.CourseWanted,
                })
                i += 1;
            }
        })


        console.log("User req Objsects",reqObjs);

        return reqObjs;
    }

    static async get_days(userID) {
        const db = getDatabase();
        const daysRef = ref(db, `Users/${userID}/PreferredDays`);
        const snapshot = (await (get(daysRef))).toJSON();
        return Object.values(snapshot);
    }

    static async get_times(userID) {
        const db = getDatabase();
        const timesRef = ref(db, `Users/${userID}/PreferredTimings`);
        const snapshot = (await (get(timesRef))).toJSON();
        console.log(snapshot)
        return Object.values(snapshot);
    }


    static async get_information(userID) {

        const db = getDatabase();
        const userRef = ref(db, `Users/${userID}`);
        const snapshot = (await (get(userRef))).toJSON();
        return snapshot;
        
    }
    
    static async get_all_users() {

        const db = getDatabase();
        const userRef = ref(db, `Users`);
        const snapshot = (await (get(userRef))).toJSON();
        return snapshot;
    }

    static async get_sessions(userID) {
        const db = getDatabase();
        const sessionsRef = ref(db, `Sessions/${userID}`);
        const snapshot = (await (get(sessionsRef))).toJSON();

        const sessions = Object.values(snapshot)
        const sessIds = Object.keys(snapshot)

        console.log("SESS IDS", sessIds)

        const sessObjs = []
        let i = 0;
        sessIds.forEach(sessId => {
            const sessObj = sessions[i]
            console.log("The Session", sessObj)
            if (sessObj != null) {
                sessObjs.push({
                    id: sessId,
                    completed: sessObj.Completed,
                    numCompleted: sessObj.CompletedSubSessions,
                    date: sessObj.Date,
                    description: sessObj.Description,
                    format: sessObj.Format,
                    length: sessObj.Length,
                    location: sessObj.Location,
                    rDays: sessObj.PreferredDays,
                    recurring: sessObj.Recurring,
                    time: sessObj.StartTime,
                    student: sessObj.Student,
                    studentID: sessObj.studentID,
                    totalSessions: sessObj.totalSessions,
                    tutor: sessObj.Tutor,
                    tutorID: sessObj.tutorID,
                    weeks: sessObj.Weeks,
                })
                i += 1;
            }


        })
        return sessObjs;
    }
    
} 


export default User;
