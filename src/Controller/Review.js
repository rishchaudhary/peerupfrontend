import { getDatabase, set, get, child, ref } from "firebase/database";
import {User} from './User'
import { Tutor } from "./Tutor";

export class Review {

    static async create_review(reviewID, rating, content, userID, tutorID) {
        
        set(ref(getDatabase(), `Reviews/${reviewID}`), { 
            Rating: rating,
            Content: content,
            Disputed: false,
            CreatedBy: userID,
            createdFor: tutorID
        });

        const userData = User.get_information(userID);
        let data = await userData.then(val => {return val;});
        const reviews = data.Reviews;
        let result = Object.keys(reviews).map((key) => reviews[key]);
        result.push(reviewID);
        set(ref(getDatabase(), `Users/${userID}/Reviews`), result);

        const tutorData = Tutor.get_information(userID);
        data = await tutorData.then(val => {return val;});
        const reviewsForTutor = data.ReviewsForTutor;
        result = Object.keys(reviewsForTutor).map((key) => reviewsForTutor[key]);
        result.push(reviewID);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/Reviews`), result);

    }

    static dispute_review(reviewID) {

        set(ref(getDatabase(), `Reviews/${reviewID}/Disputed`),true);
    }

    static async delete_review(reviewID) {

        const reviewData = this.getReviewInformation(reviewID);
        let data = await reviewData.then(val => {return val;});
        const user = data.CreatedBy;
        const tutor = data.CreatedFor;
        
        const userData = User.get_information(user);
        data = await userData.then(val => {return val;});
        const reviews = data.Reviews;
        let result = Object.keys(reviews).map((key) => reviews[key]);
        
        for (let i = 0; i < result.length; i += 1) {
            if (reviewID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `Users/${user}/Reviews`), result);
                break;
            }
        }

        const tutorData = Tutor.get_information(tutor);
        data = await tutorData.then(val => {return val;});
        const reviewsForTutor = data.ReviewsForTutor;
        result = Object.keys(reviewsForTutor).map((key) => reviewsForTutor[key]);
        
        for (let i = 0; i < result.length; i += 1) {
            if (reviewID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `TutorAccounts/${tutor}/ReviewsForTutor`), result);
                break;
            }
        }

        set(ref(getDatabase(), `Reviews/${reviewID}`), null);
        
    }


    static async getReviewInformation(reviewID){

        const db = getDatabase();
        const reviewRef = ref(db, `Reviews/${reviewID}`);
        const snapshot = (await (get(reviewRef))).toJSON();
        return snapshot;
    }

    
}