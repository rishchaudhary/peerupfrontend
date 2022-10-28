import { getDatabase,off,ref, remove, set, get, child} from "firebase/database";
import { NewTutor } from "./NewTutor";

export class Offers{

    static create_offer(offerID, time, location, tutorID) {

        set(ref(getDatabase(), `Offers/${offerID}`), {
            Time: time,
            Location: location,
            Tutor: tutorID
        },
            
            ).then(() => {
                const data = NewTutor.getTutorAccountInformation(tutorID).Requests;
                data.push(offerID);
                set(ref(getDatabase(), `TutorAccounts/${tutorID}/Offers`), data);
                return "Data Saved Successfully";
            })
            .catch((error) => {
                return error
            });
    
    }

    static cancel_offer(offerID){

        remove(ref(getDatabase(), `Offers/${offerID}`));
        const tutor = this.getOfferInformation(offerID).Tutor;
        const data = NewTutor.getTutorAccountInformation(tutor).Requests;

        for (let i = 0; i < data.length; i += 1) {
            
            if (offerID === data[i]) {
                data.splice(i, 1);
                set(ref(getDatabase(), `TutorAccounts/${tutor}/Offers`), data);
                return;
            }
        }
    }

    static getOfferInformation(offerID){

        get(child(ref(getDatabase()), `Offers/${offerID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }


}