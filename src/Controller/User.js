import {getDatabase, ref, set,remove, get} from "firebase/database";
import { Requests } from "./Requests";
import {Review} from "./Review"
import { Tutor } from "./Tutor";

 
export class User {

    static create_account(userID, emailAddress, fullName, major, standing, preferredDays, preferredTimings) {

        const days = [false, false, false, false, false, false, false];
        for (let i = 0; i < 7; i += 1) {
            for (let j = 0; j < preferredDays.length; j += 1) {
                if (i === preferredDays[j]) {
                    days[i] = true;
                }
            }
        }

        const times = [false, false, false];
        for (let i = 0; i < 7; i += 1) {
            for (let j = 0; j < preferredTimings.length; j += 1) {
                if (i === preferredTimings[j]) {
                    times[i] = true;
                }
            }
        }




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
        Bio: 'Enter Bio here',
        University: 'Purdue'
        
        })
        .then(() => {
            return "Data Saved Successfully";
        })
        .catch((error) => {
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


    static update_preferred_days(userID, updatedValues) {

        const days = [false, false, false, false, false, false, false];
        for (let i = 0; i < 7; i += 1) {
            for (let j = 0; j < updatedValues.length; j += 1) {
                if (i === updatedValues[j]) {
                    days[i] = true;
                }
            }
        }
        set(ref(getDatabase(), `Users/${userID}/PreferredDays`), days);
        
    }

    static update_preferred_times(userID, updatedValues) {

        const times = [false, false, false];
        for (let i = 0; i < 7; i += 1) {
            for (let j = 0; j < updatedValues.length; j += 1) {
                if (i === updatedValues[j]) {
                    times[i] = true;
                }
            }
        }

        set(ref(getDatabase(), `Users/${userID}/PreferredTimings`), times);
        
    }

    static update_name(userID, name) {

        set(ref(getDatabase(), `Users/${userID}/Name`), name);
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

    static async get_information(userID) {

        const db = getDatabase();
        const userRef = ref(db, `Users/${userID}`);
        const snapshot = (await (get(userRef))).toJSON();
        return snapshot;
        
    }   
    
} 


export default User;