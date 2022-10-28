import {getDatabase, ref, child, set, get, remove} from "firebase/database";
import { size } from "lodash";

export class NewUser {

    static create_account(userID, emailAddress, fullName, password) {

        set(ref(getDatabase(), `Users/${userID}`), {
        Name: fullName,
        Email: emailAddress,
        HasTutorAccount: false,
        Sessions: ["N/A"],
        // Username: username,
        Password: password,
        Requests: ["N/A"],
        Reviews: ["N/A"],
        Message: ["N/A"]
        
        })
        .then(() => {
            return "Data Saved Successfully";
        })
        .catch((error) => {
            return error;
        });

    }


    // needs to be edited
    static delete_account(userID){
        
        remove(ref(getDatabase(), `Users/${userID}`)
        )

        .then(() => {
            return "Data Deleted Successfully";
        })
        .catch((error) => {
            return error;
        });

    }

    
    static update_account(userID, newEmail, newUsername, newPassword) {

        set(ref(getDatabase(), `Users/${userID}/Email`), newEmail);
        set(ref(getDatabase(), `Users/${userID}/Username`), newUsername);
        set(ref(getDatabase(), `Users/${userID}/Password`), newPassword);
    }  


    static getUserAccountInformation(userID){

        get(child(ref(getDatabase()), `Users/${userID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }
    
    
}

