import { getDatabase, set, remove, ref } from "firebase/database";
import { NewTutor } from "./NewTutor";
import { NewUser } from "./NewUser";

export class Review {

    static create_review(reviewID, rating, content, userID, tutorID) {
        
        set(ref(getDatabase(), `Reviews/${reviewID}`), { 
            Rating: rating,
            Content: content,
            Disputed: false,
            CreatedBy: userID,
            createdFor: tutorID
        });

        const dataUser = NewUser.getUserAccountInformation(userID).Review;
        const tutor = NewTutor.getTutorAccountInformation(tutorID).ReviewsForTutor;
        dataUser.Review.push(reviewID);
        tutor.ReviewsForTutor.push(reviewID);
        set(ref(getDatabase(), `Users/${userID}/Reviews`),dataUser);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/ReviewsForTutor`),tutor);
    }

    static dispute_review(reviewID) {

        set(ref(getDatabase(), `Reviews/${reviewID}/Disputed`),true);
    }

    static delete_review(reviewID, userID, tutorID) {

        remove(ref(getDatabase(), `Reviews/${reviewID}`));
        const dataUser = NewUser.getUserAccountInformation(userID);
        const tutor = NewTutor.getTutorAccountInformation(tutorID);

        const userReviews = dataUser.Review;
        const tutorReview = tutor.ReviewsForTutor;

        for (let i = 0; i < userReviews.length(); i += 1) {

            if (userReviews[i] === reviewID) {
                userReviews.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < tutorReview.length(); i += 1) {

            if (tutorReview[i] === reviewID) {
                tutorReview.splice(i, 1);
                break;
            }
        }

        set(ref(getDatabase(), `Users/${userID}/Reviews`),userReviews);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/ReviewsForTutor`),tutorReview);
    }


    static getReviewInformation(reviewID){

        get(child(ref(getDatabase()), `Reviews/${reviewID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }

    
}