import { getDatabase, set, get, ref } from "firebase/database";
import {User} from './User'
import { Tutor } from "./Tutor";

export class Feedback {

    static async create_feedback(feedbackID, rating, content, userID, tutorID) {

        set(ref(getDatabase(), `Feedback/${feedbackID}`), {
            Rating: rating,
            Content: content,
            Disputed: false,
            CreatedBy: tutorID,
            CreatedFor: userID,
            WhyDisputed: 'N/A'
        });

        const tutorData = Tutor.get_information(tutorID);
        const data = await tutorData.then(val => {
            return val;
        });
        const reviews = data.Feedback;
        let result = Object.keys(reviews).map((key) => reviews[key]);
        result.push(feedbackID);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/Feedback`), result);

        const userData = User.get_information(userID);
        const data2 = await userData.then(val => {
            return val;
        });
        const reviewsForUser = data2.Feedback;
        // console.log(tutorID)
        // console.log(reviewsForTutor);
        result = Object.keys(reviewsForUser).map((key) => reviewsForUser[key]);
        result.push(feedbackID);
        set(ref(getDatabase(), `Users/${userID}/Feedback`), result);

        await Tutor.tutor_rating(tutorID);

    }

    static dispute_review(feedbackID, comment) {

        set(ref(getDatabase(), `Feedback/${feedbackID}/Disputed`), true);
        set(ref(getDatabase(), `Feedback/${feedbackID}/WhyDisputed`), comment);
    }

    static async delete_review(feedbackID) {

        const reviewData = this.getReviewInformation(feedbackID);
        const data = await reviewData.then(val => {
            return val;
        });
        const tutor = data.CreatedBy;
        const user = data.CreatedFor;

        const userData = User.get_information(user);
        const data2 = await userData.then(val => {
            return val;
        });
        const reviews = data2.Feedback;
        let result = Object.keys(reviews).map((key) => reviews[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (feedbackID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `Users/${user}/Feedback`), result);
                break;
            }
        }

        const tutorData = Tutor.get_information(tutor);
        const data3 = await tutorData.then(val => {
            return val;
        });
        const reviewsForTutor = data3.Feedback;
        result = Object.keys(reviewsForTutor).map((key) => reviewsForTutor[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (feedbackID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `TutorAccounts/${tutor}/Feedback`), result);
                break;
            }
        }

        set(ref(getDatabase(), `Feedback/${feedbackID}`), null);

    }


    static async getReviewInformation(feedbackID) {

        const db = getDatabase();
        const feedbackRef = ref(db, `Feedback/${feedbackID}`);
        const snapshot = (await (get(feedbackRef))).toJSON();
        return snapshot;
    }


}