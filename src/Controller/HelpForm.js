import {getDatabase, set, get, ref, push} from "firebase/database";
import {User} from './User';

export class HelpForm {

    // this function will store the help form created the user.
    // storage format -- HelpForms/userID/FormID
    // the db will store -- description, user's name and id along with an 'ID' field that may be useful for creating tables
    // in the front end.
    static async create_help_form(userID, description) {

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const name = data.Name;
        const email = data.Email;

        const dbRef = push(ref(getDatabase(), `HelpForms`));
        await set(dbRef,{
            Description: description,
            CreatedBy: name,
            Email: email,
            UserID: userID
        });
    }

    // this function should be called when the help request of the user has been resolved
    // it removes the forms from the list of help forms for that user
    static async delete_help_form(formIDs) {

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < formIDs.length; i += 1) {
            await set(ref(getDatabase(), `HelpForms/${formIDs[i]}`), null);
        }
        /* eslint-disable no-await-in-loop */
    }

    // This function will get you all help forms for a particular user
    // This function can only be used by backend.
    static async get_help_forms() {

        const db = getDatabase();
        const helpFormRef = ref(db, `HelpForms`);
        const snapshot = (await (get(helpFormRef))).toJSON();
        return snapshot;
    }
}
