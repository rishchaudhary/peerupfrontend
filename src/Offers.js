import { getDatabase,ref, remove, set } from "firebase/database";

export class Offers{

    constructor(offerID, time, location, userID, tutorID) {

        this.offerID = offerID;
        this.time = time;
        this.location = location;
        this.user = userID;
        this.tutor = tutorID;
        this.add_offer();
        

    }

    add_offer() {

        set(ref(getDatabase(), `Offers/${this.offerID}`), {
            Time: this.time,
            Location: this.location,
            User: this.user,
            Tutor: this.tutor
        },
            
            ).then(() => {
                return "Data Saved Successfully";
            })
            .catch((error) => {
                return error
            });
    
    }

    static cancel_offer(offerID){

        remove(ref(getDatabase(), `Offers/${offerID}`))
    }


}