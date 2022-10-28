import { getDatabase,set, ref, get, child } from "firebase/database";
import { Review } from "./Review";

export class NewTutor {
    

    static create_aprofile(userID, transcriptFile, university, price, courses, preferedTimes, preferedDays) {

        set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), true);
        
        set(ref(getDatabase(), `TutorAccounts/${userID}`), {
        Transcript: transcriptFile,
        University: university,
        Sessions: ["N/A"],
        Messages: ["N/A"],
        Requests: ["N/A"],
        Price: price,
        Offers: ['N/A'],
        Rating: 0,
        PreferedTime: preferedTimes,
        PreferedDays: preferedDays,
        RewiewsForTutor: ["N/A"],
        VerifedCourses: ["N/A"],
        NotVerifiedCourses: courses},
        
        ).then(() => {
            return "Data Saved Successfully";
        })
        .catch((error) => {
            return error
        });

    }

    // needs to be edited
    static delete_profile(userID) {
        
        remove(ref(getDatabase(), `TutorAccounts/${userID}`))

        .then(() => {

            set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), false);
            return "Data Deleted Successfully";
        })
        .catch((error) => {
            return error;
        });

    }

    static update_tutor_profile_tutor(userID, transcipt, newPrice, university, courses, preferedDays, preferedTimes) {
        
        const data = NewTutor.getTutorAccountInformation(userID);
        const verifiedList = data.VerifedCourses;
        const notverifiedList = data.NotVerifiedCourses;
        const verified = [];
        const notVerified = [];

        for(let i = 0; i < courses.length(); i += 1) {

            for (let j = 0; j < verifiedList.length; j += 1) {

                if (courses[i] === verifiedList[i]) {
                    verified.push(courses[i])
                }
            }
        }

        for(let i = 0; i < courses.length(); i += 1) {

            for (let j = 0; j < notverifiedList.length; j += 1) {

                if (courses[i] === notverifiedList[i]) {
                    notVerified.push(courses[i])
                }
            }
        }

        set(ref(getDatabase(), `TutorAccounts/${userID}/Price`), newPrice);
        set(ref(getDatabase(), `TutorAccounts/${userID}/University`), university);
        set(ref(getDatabase(), `TutorAccounts/${userID}/Transcript`), transcipt);
        set(ref(getDatabase(), `TutorAccounts/${userID}/VerifiedCourses`), verified);
        set(ref(getDatabase(), `TutorAccounts/${userID}/NotVerifiedCourses`), notVerified);
        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferedTime`), preferedTimes);
        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferedDays`), preferedDays);
    }

    static update_tutor_profile_admin(userID, newVerifiedList, newNotVerifiedList) {
        
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/VerifiedCourses`), newVerifiedList);
        set(ref(getDatabase(), `TutorAccounts/${userID}/NotVerifiedCourses`), newNotVerifiedList);

    }

    static tutor_rating(userID) {

        const data = this.getTutorAccountInformation(userID);
        const reviews = data.RewiewsForTutor;
        const len = reviews.length();

        if (len >= 11) {

            const sum = 0.0;
            for (let i = 1; i < len; i += 1) {
                sum += Review.getReviewInformation(reviews[i]).Rating;
            }

            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), sum / len);
        }
    }

    static getTutorAccountInformation(userID){

        get(child(ref(getDatabase()), `TutorAccounts/${userID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }
    
    
}


