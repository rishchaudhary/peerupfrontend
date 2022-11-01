import { getDatabase, set, get, ref } from "firebase/database";
import {User} from './User'
import { Tutor } from "./Tutor";

export class Review {

    static async create_review(reviewID, rating, content, userID, tutorID) {
        
        set(ref(getDatabase(), `Reviews/${reviewID}`), { 
            Rating: rating,
            Content: content,
            Disputed: false,
            CreatedBy: userID,
            CreatedFor: tutorID
        });

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const reviews = data.Reviews;
        let result = Object.keys(reviews).map((key) => reviews[key]);
        result.push(reviewID);
        set(ref(getDatabase(), `Users/${userID}/Reviews`), result);

        const tutorData = Tutor.get_information(tutorID);
        const data2 = await tutorData.then(val => {return val;});
        const reviewsForTutor = data2.ReviewsForTutor;
        // console.log(tutorID)
        // console.log(reviewsForTutor);
        result = Object.keys(reviewsForTutor).map((key) => reviewsForTutor[key]);
        result.push(reviewID);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/ReviewsForTutor`), result);

        await Tutor.tutor_rating(tutorID);

    }

    static dispute_review(reviewID) {

        set(ref(getDatabase(), `Reviews/${reviewID}/Disputed`),true);
    }

    static async delete_review(reviewID) {

        const reviewData = this.getReviewInformation(reviewID);
        const data = await reviewData.then(val => {return val;});
        const user = data.CreatedBy;
        const tutor = data.CreatedFor;
        
        const userData = User.get_information(user);
        const data2 = await userData.then(val => {return val;});
        const reviews = data2.Reviews;
        let result = Object.keys(reviews).map((key) => reviews[key]);
        
        for (let i = 0; i < result.length; i += 1) {
            if (reviewID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `Users/${user}/Reviews`), result);
                break;
            }
        }

        const tutorData = Tutor.get_information(tutor);
        const data3 = await tutorData.then(val => {return val;});
        const reviewsForTutor = data3.ReviewsForTutor;
        result = Object.keys(reviewsForTutor).map((key) => reviewsForTutor[key]);
        
        for (let i = 0; i < result.length; i += 1) {
            if (reviewID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `TutorAccounts/${tutor}/ReviewsForTutor`), result);
                break;
            }
        }

        set(ref(getDatabase(), `Reviews/${reviewID}`), null);
        await Tutor.tutor_rating(tutor);
        
    }


    static async getReviewInformation(reviewID){

        const db = getDatabase();
        const reviewRef = ref(db, `Reviews/${reviewID}`);
        const snapshot = (await (get(reviewRef))).toJSON();
        return snapshot;
    }

    
}