import { getDatabase,child, get,ref, set } from "firebase/database";


export class Offers{

    static create_offer(offerID, time, location, tutorID) {

        set(ref(getDatabase(), `Offers/${offerID}`), {
            Time: time,
            Location: location,
            Tutor: tutorID
        },
            
            )
        get(child(ref(getDatabase()), `TutorAccounts/${tutorID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.child("Offers").toJSON();
                const count = Object.keys(val).length;
                set(ref(getDatabase(), `TutorAccounts/${tutorID}/Offers/${count}`), offerID);
                
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    
    }

    static cancel_offer(offerID){

        get(child(ref(getDatabase()), `Offers/${offerID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const tutor = snapshot.toJSON().Tutor;
                console.log(tutor);

                get(child(ref(getDatabase()), `TutorAccounts/${tutor}`)).then((snapshot2) => {
                    if (snapshot2.exists()) {

                        const offers = snapshot2.child("Offers").toJSON();
                        const keys = Object.keys(offers);
                        const values = [];
                        for(let i = 0; i < keys.length; i += 1) {
                            
                            if (offers[keys[i]] !== offerID) {
                                values.push(offers[keys[i]]);
                            }
                        }

                        set(ref(getDatabase(), `TutorAccounts/${tutor}/Offers`), values);

                    }});

                    set(ref(getDatabase(), `Offers/${offerID}`), null);
                
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }

}