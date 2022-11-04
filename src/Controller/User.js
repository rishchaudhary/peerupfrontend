import {getDatabase, ref, set, remove, get} from "firebase/database";
import { Requests } from "./Requests";
import {Review} from "./Review"
import { Tutor } from "./Tutor";
import {Feedback} from './Feedback'

 
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
        const data3 = Object.keys(data2).length;


        set(ref(getDatabase(), `Users/${userID}`), {
            Name: fullName,
            Email: emailAddress,
            HasTutorAccount: false,
            Sessions: ["Session ID"],
            Requests: ["Request ID"],
            Reviews: ["Review ID"],
            Message: ["Message ID"],
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


    // needs to be edited
    static async delete_account(userID){ 

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const userDataRequests = data.Requests;
        let result = Object.keys(userDataRequests).map((key) => userDataRequests[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result.length; i += 1) {
            await Requests.delete_request(result[i]);
        }
        /* eslint-disable no-await-in-loop */
        const userDataReviews = data.Reviews;
        result = Object.keys(userDataReviews).map((key) => userDataReviews[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result.length; i += 1) {
            await Review.delete_review(result[i]);
        }
        /* eslint-disable no-await-in-loop */
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
        const userRef = ref(db, `Users/${userID}/Requests`);
        const snapshot = (await get(userRef)).toJSON();

        const reqObjects = [];
        for (let i = 0; i < Object.entries(snapshot).length; i+= 1){
            const value = Object.entries(snapshot)[i];
            const reqRef = ref(db, `Requests/${value[1]}`);
            const request = (await get(reqRef)).toJSON();
            if (request !== null) {
                reqObjects.push(request);
            }
        }
        // console.log(reqObjects);

        return reqObjects;

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
    
} 


export default User;
