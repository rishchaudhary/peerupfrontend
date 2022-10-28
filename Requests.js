import { getDatabase, get, child, set, ref} from "firebase/database";
import { Offers } from "./Offers";

export class Requests {

    static create_request(requestID, time, date, description, userID) {

        set(ref(getDatabase(), `Requests/${requestID}`), {

            Time: time,
            Date: date,
            Description: description,
            CreatedBy: userID,
            Offers: ["N/A"]
        });

        get(child(ref(getDatabase()), `Users/${userID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.child("Requests").toJSON();
                const count = Object.keys(val).length;
                set(ref(getDatabase(), `Users/${userID}/Requests/${count}`), requestID);
            
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

    }

    static delete_request(requestID) {

        
        get(child(ref(getDatabase()), `Requests/${requestID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.toJSON().CreatedBy;
                const offers = snapshot.child("Offers").toJSON();
                const keys = Object.keys(offers)

                for (let i = 1; i < keys.length; i += 1) {
                    Offers.cancel_offer(offers[keys[i]]);
                }

                get(child(ref(getDatabase()), `Users/${user}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const requests = snapshot.child("Requests").toJSON();
                        const keys = Object.keys(requests);
                        const values = [];

                        for (let i = 0; i < keys.length; i += 1) {
                            
                            if (requests[keys[i]] !== requestID) {
                                values.push(requests[keys[i]]);
                            }
                        }

                        set(ref(getDatabase(), `Users/${user}/Requests`), values);
                        set(ref(getDatabase(), `Requests/${requestID}`), null);
        
                        }});
            
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
        
    }

    static add_offer_to_request(requestID, offerID, time, location,tutorID) {

        Offers.create_offer(offerID, time, location,tutorID);
        
        get(child(ref(getDatabase()), `Requests/${requestID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.child("Offers").toJSON();
                const count = Object.keys(val).length;
                set(ref(getDatabase(), `Requests/${requestID}/Offers/${count}`), offerID);
            
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

          get(child(ref(getDatabase()), `TutorAccounts/${tutorID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.child("Requests").toJSON();
                const count = Object.keys(val).length;
                set(ref(getDatabase(), `TutorAccounts/${tutorID}/Requests/${count}`), requestID);
                
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    static cancel_offer_for_request(requestID, offerID){
       

        console.log(requestID);
        get(child(ref(getDatabase()), `Requests/${requestID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.child("Offers").toJSON();
                const keys = Object.keys(val);
                console.log(keys);
                const values = [];
                for(let i = 0; i < keys.length; i += 1) {
                            
                    if (val[keys[i]] !== offerID) {
                            values.push(val[keys[i]]);
                    }
                }

                console.log(values);
                set(ref(getDatabase(), `Requests/${requestID}/Offers`), values);
            
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

          get(child(ref(getDatabase()), `Offers/${offerID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const tutor = snapshot.toJSON().Tutor;
                console.log(tutor);

                get(child(ref(getDatabase()), `TutorAccounts/${tutor}`)).then((snapshot2) => {
                    if (snapshot2.exists()) {

                        const requests = snapshot2.child("Requests").toJSON();
                        const keys = Object.keys(requests);
                        const values = [];
                        for(let i = 0; i < keys.length; i += 1) {
                            
                            if (requests[keys[i]] !== requestID) {
                                values.push(requests[keys[i]]);
                            }
                        }

                        set(ref(getDatabase(), `TutorAccounts/${tutor}/Requests`), values);

                    }});

                
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

          Offers.cancel_offer(offerID);
        
    }

    static update_request(requestID, time, date, description) {
        set(ref(getDatabase(), `Requests/${requestID}/Date`), date);
        set(ref(getDatabase(), `Requests/${requestID}/Time`), time);
        set(ref(getDatabase(), `Requests/${requestID}/Description`), description);
        
    }
       
}