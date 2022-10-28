import { getDatabase, set, get, ref } from "firebase/database";

export class University{

    static add_university_data(id, name) {

        set(ref(getDatabase(), `University/${name}`), {
            UnivID: id,
            Courses: ["N/A"]
        });

    }

    static edit_university_data(name, newID) {

        set(ref(getDatabase(), `University/${name}/UnivID`),newID);
    }


    static edit_course(name, courseID, courseName, description) {

       set(ref(getDatabase(), `University/${name}/Courses/${courseID}`), {
             Name: courseName,
            Description: description});

    }

    static add_course(name, courseID, courseName, description) {

        set(ref(getDatabase(), `University/${name}/Courses/${courseID}`), {
            Name: courseName,
            Description: description
        });
    }

    static remove_course(name, courseID){

        remove(ref(getDatabase(), `University/${name}/Courses/${courseID}`))
        
    }

    static getUniversityInformation(name){

        get(child(ref(getDatabase()), `University/${name}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }


}


