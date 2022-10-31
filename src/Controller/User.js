import {getDatabase, ref, set,remove, get} from "firebase/database";
import { Requests } from "./Requests";
import {Review} from "./Review"
import { Tutor } from "./Tutor";



export class User {

    static create_account(userID, emailAddress, fullName, major, standing) {

        
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
        PreferredDays: [false, false, false, false, false],
        PreferredTimings: [false, false, false],
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

        for (let i = 1; i < result.length; i += 1) {
            Requests.delete_request(result[i]);
        }

        const userDataReviews = data.Reviews;
        result = Object.keys(userDataReviews).map((key) => userDataReviews[key]);

        for (let i = 1; i < result.length; i += 1) {
            Review.delete_review(result[i]);
        }

        const hasTutorAccount = data.HasTutorAccount;

        if (hasTutorAccount) {
            Tutor.delete_profile(userID);
        }

        
        remove(ref(getDatabase(), `Users/${userID}`))

        .then(() => {
            return "Data Deleted Successfully";
        })
        .catch((error) => {
            return error;
        });

    }


    static update_preferred_days(userID, updatedValue, index) {

        set(ref(getDatabase(), `Users/${userID}/PreferredDays/${index}`), updatedValue);
        
    }

    static update_preferred_times(userID, updatedValue, index) {

        set(ref(getDatabase(), `Users/${userID}/PreferredTimings/${index}`), updatedValue);
        
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